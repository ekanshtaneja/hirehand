-- Fix Security Definer issue by updating the update_updated_at_column function
-- Remove SECURITY DEFINER to use default SECURITY INVOKER

DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Recreate the function without SECURITY DEFINER (defaults to SECURITY INVOKER)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;