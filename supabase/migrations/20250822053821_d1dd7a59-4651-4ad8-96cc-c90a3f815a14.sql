-- Create admin access function that bypasses RLS for admin operations
CREATE OR REPLACE FUNCTION admin_get_professionals()
RETURNS TABLE (
  id uuid,
  name text,
  email text,
  phone text,
  specialty text,
  location text,
  description text,
  experience text,
  hourly_rate text,
  status text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, name, email, phone, specialty, location, description, experience, hourly_rate, status, created_at, updated_at
  FROM professionals
  ORDER BY created_at DESC;
$$;

-- Create admin access function for quote requests
CREATE OR REPLACE FUNCTION admin_get_quote_requests()
RETURNS TABLE (
  id uuid,
  name text,
  email text,
  phone text,
  service text,
  location text,
  budget text,
  description text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, name, email, phone, service, location, budget, description, created_at, updated_at
  FROM quote_requests
  ORDER BY created_at DESC
  LIMIT 10;
$$;

-- Grant execute permissions to authenticated users (will be controlled by app logic)
GRANT EXECUTE ON FUNCTION admin_get_professionals() TO authenticated;
GRANT EXECUTE ON FUNCTION admin_get_quote_requests() TO authenticated;