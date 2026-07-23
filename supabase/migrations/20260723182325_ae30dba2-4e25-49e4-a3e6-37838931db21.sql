
-- 1. Role system
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 2. contact_requests: admin-only SELECT; tighter INSERT
DROP POLICY IF EXISTS "Anyone can view contact requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Anyone can submit contact requests" ON public.contact_requests;

CREATE POLICY "Admins can view contact requests" ON public.contact_requests
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can submit contact requests" ON public.contact_requests
FOR INSERT TO anon, authenticated
WITH CHECK (
  client_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(client_name) BETWEEN 1 AND 200
  AND (message IS NULL OR char_length(message) <= 5000)
);

-- 3. quote_requests: admin-only SELECT; tighter INSERT
DROP POLICY IF EXISTS "Anyone can view quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Anyone can submit quote requests" ON public.quote_requests;

CREATE POLICY "Admins can view quote requests" ON public.quote_requests
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can submit quote requests" ON public.quote_requests
FOR INSERT TO anon, authenticated
WITH CHECK (
  email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(name) BETWEEN 1 AND 200
  AND (description IS NULL OR char_length(description) <= 5000)
);

-- 4. reviews: keep public SELECT but hide client_email column; tighter INSERT
DROP POLICY IF EXISTS "Anyone can submit reviews" ON public.reviews;
CREATE POLICY "Public can submit reviews" ON public.reviews
FOR INSERT TO anon, authenticated
WITH CHECK (
  client_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(client_name) BETWEEN 1 AND 200
  AND (rating IS NULL OR (rating BETWEEN 1 AND 5))
  AND (comment IS NULL OR char_length(comment) <= 5000)
);

REVOKE SELECT (client_email) ON public.reviews FROM anon, authenticated;

-- 5. professionals: expose only approved, hide email/phone from public
DROP POLICY IF EXISTS "Anyone can view approved professionals" ON public.professionals;
DROP POLICY IF EXISTS "Anyone can register as a professional" ON public.professionals;

CREATE POLICY "Public can view approved professionals" ON public.professionals
FOR SELECT TO anon, authenticated USING (status = 'approved');

CREATE POLICY "Admins can view all professionals" ON public.professionals
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can register as professional" ON public.professionals
FOR INSERT TO anon, authenticated
WITH CHECK (
  email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(name) BETWEEN 1 AND 200
  AND status = 'pending'
);

REVOKE SELECT (email, phone) ON public.professionals FROM anon, authenticated;
GRANT SELECT (email, phone) ON public.professionals TO service_role;

-- 6. analytics: tighter INSERT (not literally true)
DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.analytics;
CREATE POLICY "Public can insert analytics" ON public.analytics
FOR INSERT TO anon, authenticated
WITH CHECK (
  (page_path IS NULL OR char_length(page_path) <= 500)
  AND (visitor_id IS NULL OR char_length(visitor_id) <= 200)
);

-- 7. Lock down SECURITY DEFINER admin helper functions
CREATE OR REPLACE FUNCTION public.admin_get_professionals()
RETURNS SETOF public.professionals
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  RETURN QUERY SELECT * FROM public.professionals ORDER BY created_at DESC;
END; $$;

CREATE OR REPLACE FUNCTION public.admin_get_quote_requests()
RETURNS SETOF public.quote_requests
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  RETURN QUERY SELECT * FROM public.quote_requests ORDER BY created_at DESC;
END; $$;

CREATE OR REPLACE FUNCTION public.admin_delete_professional(professional_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  DELETE FROM public.professionals WHERE id = professional_id;
END; $$;

CREATE OR REPLACE FUNCTION public.admin_delete_all_professionals()
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE deleted_count integer;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  WITH deleted AS (DELETE FROM public.professionals RETURNING id)
  SELECT count(*)::int INTO deleted_count FROM deleted;
  RETURN deleted_count;
END; $$;

REVOKE ALL ON FUNCTION public.admin_get_professionals() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_get_quote_requests() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_delete_professional(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_delete_all_professionals() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_get_professionals() TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_get_quote_requests() TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_delete_professional(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_delete_all_professionals() TO service_role;
