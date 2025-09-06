-- Create function to delete professionals
CREATE OR REPLACE FUNCTION public.admin_delete_professional(professional_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  DELETE FROM professionals 
  WHERE id = professional_id;
$$;