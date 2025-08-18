-- Fix Security Definer issue by recreating function without SECURITY DEFINER
-- First drop all dependent triggers, then the function, then recreate everything

-- Drop all triggers that depend on the function
DROP TRIGGER IF EXISTS update_professionals_updated_at ON public.professionals;
DROP TRIGGER IF EXISTS update_quote_requests_updated_at ON public.quote_requests;
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
DROP TRIGGER IF EXISTS update_contact_requests_updated_at ON public.contact_requests;

-- Drop the function
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

-- Recreate all the triggers
CREATE TRIGGER update_professionals_updated_at
  BEFORE UPDATE ON public.professionals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_requests_updated_at
  BEFORE UPDATE ON public.contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();