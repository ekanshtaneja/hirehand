-- Fix security vulnerability: Remove public read access to quote_requests table
-- This prevents competitors from stealing customer contact information

-- Drop the existing public read policy that allows anyone to view quote requests
DROP POLICY IF EXISTS "Allow public read access to quote_requests" ON public.quote_requests;

-- Keep the INSERT policy so customers can still submit quote requests
-- The INSERT policy "Allow public insert to quote_requests" remains unchanged

-- Note: This will require implementing proper authentication for admin access
-- Admins will need to be authenticated users to view quote requests