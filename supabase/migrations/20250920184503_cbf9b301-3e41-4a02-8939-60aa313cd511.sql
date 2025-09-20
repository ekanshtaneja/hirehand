-- Allow public users to read all professionals (regardless of status)
-- This enables the "Find Professionals" page to display registered professionals
CREATE POLICY "Public can view all professionals" 
ON public.professionals 
FOR SELECT 
USING (true);