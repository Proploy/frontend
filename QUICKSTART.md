# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment Variables

Copy `env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

## 3. Set Up RLS Policies

Run the SQL in `supabase/rls-policies.sql` in your Supabase SQL Editor.

## 4. Generate TypeScript Types

```bash
npm run generate-types
```

Or manually from Supabase Dashboard > Settings > API > Generate TypeScript types

## 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## API Endpoints

### Products

- `GET /api/products` - List products with pagination and filters
- `GET /api/products/[id]` - Get single product

### Companies

- `GET /api/companies` - List companies with pagination and filters
- `GET /api/companies/[id]` - Get single company
- `GET /api/companies/product/[productId]` - Get company by product

### Reviews

- `GET /api/reviews` - List reviews with pagination and filters
- `GET /api/reviews/product/[productId]` - Get reviews by product

### Search

- `GET /api/search?q=query&type=all` - Full-text search

## Example API Calls

```bash
# Get products
curl http://localhost:3000/api/products?page=1&limit=20

# Search products
curl http://localhost:3000/api/search?q=software&type=products

# Get product by ID
curl http://localhost:3000/api/products/product-id-123

# Get reviews for a product
curl http://localhost:3000/api/reviews/product/product-id-123?page=1&limit=20
```

For more details, see [README-SETUP.md](./README-SETUP.md)
