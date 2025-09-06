-- Fix search path for admin_delete_professional function
CREATE OR REPLACE FUNCTION public.admin_delete_professional(professional_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  DELETE FROM professionals 
  WHERE id = professional_id;
$function$

-- Fix search path for existing functions
CREATE OR REPLACE FUNCTION public.admin_get_professionals()
 RETURNS TABLE(id uuid, name text, email text, phone text, specialty text, location text, description text, experience text, hourly_rate text, status text, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT id, name, email, phone, specialty, location, description, experience, hourly_rate, status, created_at, updated_at
  FROM professionals
  ORDER BY created_at DESC;
$function$

CREATE OR REPLACE FUNCTION public.admin_get_quote_requests()
 RETURNS TABLE(id uuid, name text, email text, phone text, service text, location text, budget text, description text, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT id, name, email, phone, service, location, budget, description, created_at, updated_at
  FROM quote_requests
  ORDER BY created_at DESC
  LIMIT 10;
$function$

CREATE OR REPLACE FUNCTION public.admin_update_professional_status(professional_id uuid, new_status text)
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  UPDATE professionals 
  SET status = new_status, updated_at = now()
  WHERE id = professional_id;
$function$

CREATE OR REPLACE FUNCTION public.list_approved_professionals()
 RETURNS TABLE(id uuid, name text, specialty text, location text, description text, experience text, hourly_rate text, status text, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT id, name, specialty, location, description, experience, hourly_rate, status, created_at, updated_at
  FROM public.professionals
  WHERE status = 'approved'
  ORDER BY created_at DESC;
$function$