-- Add price field to professionals table
ALTER TABLE public.professionals 
ADD COLUMN hourly_rate text;

-- Create reviews table for live ratings
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  client_email text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow public to read reviews
CREATE POLICY "Allow public read access to reviews" 
ON public.reviews 
FOR SELECT 
USING (true);

-- Allow public to insert reviews
CREATE POLICY "Allow public insert to reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();