-- Create admin function to update professional status
CREATE OR REPLACE FUNCTION admin_update_professional_status(
  professional_id uuid,
  new_status text
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE professionals 
  SET status = new_status, updated_at = now()
  WHERE id = professional_id;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION admin_update_professional_status(uuid, text) TO authenticated;