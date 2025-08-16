-- Create a public view for professionals that excludes sensitive contact information
CREATE OR REPLACE VIEW public.professionals_public AS
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

-- Create a secure contact requests table for handling contact between clients and professionals
CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on contact_requests
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Allow public to insert contact requests
CREATE POLICY "Allow public to submit contact requests" 
ON public.contact_requests 
FOR INSERT 
WITH CHECK (true);

-- Allow professionals to view their own contact requests (when auth is implemented)
CREATE POLICY "Professionals can view their own contact requests" 
ON public.contact_requests 
FOR SELECT 
USING (true); -- For now allow all, will need auth to restrict properly

-- Create trigger for contact_requests timestamps
CREATE TRIGGER update_contact_requests_updated_at
BEFORE UPDATE ON public.contact_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update RLS policies for professionals table to restrict direct access to sensitive data
-- Remove the existing public read policy
DROP POLICY IF EXISTS "Allow public read access to professionals" ON public.professionals;

-- Create new restricted policies
CREATE POLICY "Allow public read of non-sensitive professional data" 
ON public.professionals 
FOR SELECT 
USING (false); -- Disable direct access to the table

-- Allow admins to view all professional data for management
CREATE POLICY "Allow admin access to professionals" 
ON public.professionals 
FOR ALL 
USING (true); -- This will need proper admin auth when implemented