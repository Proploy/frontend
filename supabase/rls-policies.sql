-- Row Level Security (RLS) Policies for Supabase
-- Run this SQL in your Supabase SQL Editor to enable RLS policies
-- These policies allow anonymous read access to products, companies, and reviews

-- Enable RLS on tables (if not already enabled)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Allow anonymous read access to products" ON products;
DROP POLICY IF EXISTS "Allow anonymous read access to companies" ON companies;
DROP POLICY IF EXISTS "Allow anonymous read access to reviews" ON reviews;

-- Products: Allow anonymous users to read all products
CREATE POLICY "Allow anonymous read access to products"
  ON products
  FOR SELECT
  TO anon
  USING (true);

-- Companies: Allow anonymous users to read all companies
CREATE POLICY "Allow anonymous read access to companies"
  ON companies
  FOR SELECT
  TO anon
  USING (true);

-- Reviews: Allow anonymous users to read all reviews
CREATE POLICY "Allow anonymous read access to reviews"
  ON reviews
  FOR SELECT
  TO anon
  USING (true);

-- Optional: Allow authenticated users to read (if you add auth later)
-- Uncomment these if you want authenticated users to have read access too

-- CREATE POLICY "Allow authenticated read access to products"
--   ON products
--   FOR SELECT
--   TO authenticated
--   USING (true);

-- CREATE POLICY "Allow authenticated read access to companies"
--   ON companies
--   FOR SELECT
--   TO authenticated
--   USING (true);

-- CREATE POLICY "Allow authenticated read access to reviews"
--   ON reviews
--   FOR SELECT
--   TO authenticated
--   USING (true);

