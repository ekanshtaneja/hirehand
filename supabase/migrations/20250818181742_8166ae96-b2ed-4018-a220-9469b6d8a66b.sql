-- Drop the existing view that may have SECURITY DEFINER
DROP VIEW IF EXISTS public.professionals_public;

-- Recreate the view without SECURITY DEFINER (default is SECURITY INVOKER)
CREATE VIEW public.professionals_public AS
SELECT 
  id,
  name,
  specialty,
  status,
  location,
  description,
  experience,
  hourly_rate,
  created_at,
  updated_at
FROM public.professionals
WHERE status = 'approved';

-- Grant public access to the view
GRANT SELECT ON public.professionals_public TO anon;
GRANT SELECT ON public.professionals_public TO authenticated;