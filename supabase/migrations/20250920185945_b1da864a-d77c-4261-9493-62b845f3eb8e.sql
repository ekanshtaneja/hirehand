-- Allow nullable professional_id for general platform reviews
ALTER TABLE public.reviews ALTER COLUMN professional_id DROP NOT NULL;

-- Update the foreign key constraint to handle NULL values
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_professional_id_fkey;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_professional_id_fkey 
  FOREIGN KEY (professional_id) REFERENCES public.professionals(id) 
  ON DELETE CASCADE;