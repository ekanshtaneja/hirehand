-- Remove SECURITY DEFINER view and replace with a safe RPC
-- 1) Drop the view that triggers the linter error
DROP VIEW IF EXISTS public.professionals_public;

-- 2) Create a SECURITY DEFINER function that returns only safe, public columns
--    and applies filtering in SQL. Set search_path to avoid mutable path issues.
CREATE OR REPLACE FUNCTION public.list_approved_professionals()
RETURNS TABLE (
  id uuid,
  name text,
  specialty text,
  location text,
  description text,
  experience text,
  hourly_rate text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT id, name, specialty, location, description, experience, hourly_rate, status, created_at, updated_at
  FROM public.professionals
  WHERE status = 'approved'
  ORDER BY created_at DESC;
$$;

-- 3) Allow public and authenticated clients to execute this RPC
GRANT EXECUTE ON FUNCTION public.list_approved_professionals() TO anon, authenticated;