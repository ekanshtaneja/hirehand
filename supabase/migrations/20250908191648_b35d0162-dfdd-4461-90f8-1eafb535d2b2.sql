-- Create function to delete all professionals (admin only)
CREATE OR REPLACE FUNCTION public.admin_delete_all_professionals()
 RETURNS integer
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  WITH deleted AS (
    DELETE FROM professionals 
    RETURNING id
  )
  SELECT COUNT(*)::integer FROM deleted;
$function$;