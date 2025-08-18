-- Tighten RLS on professionals to prevent public exposure of email/phone
-- 1) Remove overly-permissive policies
DROP POLICY IF EXISTS "Allow admin access to professionals" ON public.professionals;
DROP POLICY IF EXISTS "Allow admins to update professional status" ON public.professionals;
DROP POLICY IF EXISTS "Allow public read of non-sensitive professional data" ON public.professionals;

-- Ensure RLS is enabled
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;

-- 2) Public can submit applications but only as pending
DROP POLICY IF EXISTS "Allow public insert to professionals" ON public.professionals;
CREATE POLICY "Public can submit professional applications (pending only)"
ON public.professionals
FOR INSERT
WITH CHECK (status = 'pending');

-- 3) Restrict full access to service role only (for secure server/edge usage)
CREATE POLICY "Service role can read professionals"
ON public.professionals
FOR SELECT
USING (auth.role() = 'service_role');

CREATE POLICY "Service role can update professionals"
ON public.professionals
FOR UPDATE
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can delete professionals"
ON public.professionals
FOR DELETE
USING (auth.role() = 'service_role');