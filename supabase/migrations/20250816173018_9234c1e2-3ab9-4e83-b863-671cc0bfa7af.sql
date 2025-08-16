-- Add approval status to professionals table
ALTER TABLE public.professionals 
ADD COLUMN status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Create index for better performance
CREATE INDEX idx_professionals_status ON public.professionals(status);

-- Update RLS policies to allow admins to update professional status
CREATE POLICY "Allow admins to update professional status" 
ON public.professionals 
FOR UPDATE 
USING (true) 
WITH CHECK (true);