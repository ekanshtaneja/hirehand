CREATE TABLE public.professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  experience TEXT,
  hourly_rate TEXT,
  specialty TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT,
  location TEXT,
  description TEXT,
  budget TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  message TEXT,
  professional_id UUID,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  rating INTEGER,
  comment TEXT,
  professional_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT,
  visitor_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.professionals TO authenticated;
GRANT SELECT, INSERT ON public.professionals TO anon;
GRANT ALL ON public.professionals TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.quote_requests TO authenticated;
GRANT SELECT, INSERT ON public.quote_requests TO anon;
GRANT ALL ON public.quote_requests TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_requests TO authenticated;
GRANT SELECT, INSERT ON public.contact_requests TO anon;
GRANT ALL ON public.contact_requests TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT ALL ON public.reviews TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.analytics TO authenticated;
GRANT SELECT, INSERT ON public.analytics TO anon;
GRANT ALL ON public.analytics TO service_role;

ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved professionals" ON public.professionals FOR SELECT USING (status = 'approved' OR status = 'pending');
CREATE POLICY "Anyone can register as a professional" ON public.professionals FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view quote requests" ON public.quote_requests FOR SELECT USING (true);
CREATE POLICY "Anyone can submit quote requests" ON public.quote_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view contact requests" ON public.contact_requests FOR SELECT USING (true);
CREATE POLICY "Anyone can submit contact requests" ON public.contact_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can submit reviews" ON public.reviews FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view analytics" ON public.analytics FOR SELECT USING (true);
CREATE POLICY "Anyone can insert analytics" ON public.analytics FOR INSERT WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.admin_get_professionals()
RETURNS SETOF public.professionals
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.professionals ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.admin_get_quote_requests()
RETURNS SETOF public.quote_requests
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.quote_requests ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_professional(professional_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.professionals WHERE id = professional_id;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_all_professionals()
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH deleted AS (
    DELETE FROM public.professionals RETURNING id
  )
  SELECT count(*)::INTEGER FROM deleted;
$$;

GRANT EXECUTE ON FUNCTION public.admin_get_professionals() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_get_quote_requests() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_delete_professional(UUID) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_delete_all_professionals() TO anon, authenticated, service_role;