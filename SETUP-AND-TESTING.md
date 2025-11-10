# Complete Setup and Testing Guide

## 🚀 Step-by-Step Setup

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

This will install all required packages including Supabase, Zod, and rate limiting libraries.

### Step 2: Set Up Environment Variables

1. **Copy the example file:**
   ```bash
   cp env.example .env.local
   ```

2. **Get your Supabase credentials:**
   - Go to your Supabase project dashboard
   - Navigate to **Settings > API**
   - Copy the following:
     - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
     - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

3. **Edit `.env.local` file:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   
   # Optional: For OAuth (skip for now if not needed)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   
   # Optional: For production rate limiting (skip for now)
   UPSTASH_REDIS_REST_URL=your-upstash-url
   UPSTASH_REDIS_REST_TOKEN=your-upstash-token
   
   # Application settings
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   REVALIDATE_TIME=3600
   ```

### Step 3: Set Up Row Level Security (RLS) Policies

1. **Open your Supabase project dashboard**
2. **Go to SQL Editor**
3. **Copy and paste the SQL from `supabase/rls-policies.sql`**
4. **Click "Run"**

This will:
- Enable RLS on products, companies, and reviews tables
- Allow anonymous read access to all data
- Set up policies for future authentication

### Step 4: Generate TypeScript Types (Optional but Recommended)

**Option A: Using Supabase CLI (Recommended)**

```bash
# Install Supabase CLI globally
npm install -g supabase

# Link your project
supabase link --project-ref <your-project-ref>
# You can find your project ref in Supabase dashboard URL:
# https://app.supabase.com/project/<project-ref>

# Generate types
npm run generate-types
```

**Option B: Using Supabase Dashboard**

1. Go to your Supabase project dashboard
2. Navigate to **Settings > API**
3. Scroll to **"Generate TypeScript types"**
4. Copy the generated types
5. Paste into `types/database.types.ts`

### Step 5: Start the Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000`

---

## 🧪 Testing the API Routes

### Method 1: Using Browser

Open your browser and navigate to:

- **Products List**: http://localhost:3000/api/products
- **Products with Pagination**: http://localhost:3000/api/products?page=1&limit=5
- **Products with Search**: http://localhost:3000/api/products?search=software
- **Products with Filters**: http://localhost:3000/api/products?minRating=4&category=CRM
- **Single Product**: http://localhost:3000/api/products/your-product-id
- **Companies List**: http://localhost:3000/api/companies
- **Single Company**: http://localhost:3000/api/companies/your-company-id
- **Reviews List**: http://localhost:3000/api/reviews
- **Search**: http://localhost:3000/api/search?q=software&type=all

### Method 2: Using cURL

```bash
# Get all products
curl http://localhost:3000/api/products

# Get products with pagination
curl "http://localhost:3000/api/products?page=1&limit=10"

# Search products
curl "http://localhost:3000/api/products?search=project%20management"

# Filter products by rating
curl "http://localhost:3000/api/products?minRating=4&sortBy=rating&sortOrder=desc"

# Get single product (replace with actual product_id)
curl http://localhost:3000/api/products/your-product-id

# Get all companies
curl http://localhost:3000/api/companies

# Search across products and companies
curl "http://localhost:3000/api/search?q=software&type=all&limit=10"

# Get reviews for a product
curl "http://localhost:3000/api/reviews/product/your-product-id?page=1&limit=10"

# Get company by product
curl http://localhost:3000/api/companies/product/your-product-id
```

### Method 3: Using Postman or Thunder Client (VS Code Extension)

1. **Create a new request**
2. **Set method to GET**
3. **Enter URL**: `http://localhost:3000/api/products`
4. **Add query parameters** (if needed):
   - Key: `page`, Value: `1`
   - Key: `limit`, Value: `10`
   - Key: `search`, Value: `software`
5. **Send request**

### Method 4: Using JavaScript/TypeScript (Node.js)

Create a test file `test-api.js`:

```javascript
async function testAPI() {
  try {
    // Test products endpoint
    const response = await fetch('http://localhost:3000/api/products?page=1&limit=5');
    const data = await response.json();
    console.log('Products:', JSON.stringify(data, null, 2));
    
    // Test search endpoint
    const searchResponse = await fetch('http://localhost:3000/api/search?q=software&type=all');
    const searchData = await searchResponse.json();
    console.log('Search Results:', JSON.stringify(searchData, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();
```

Run it:
```bash
node test-api.js
```

---

## 🎨 Using API Routes in Frontend Components

### Example 1: Server Component (Recommended for Next.js App Router)

Create `app/products/page.tsx`:

```typescript
// app/products/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function ProductsPage() {
  const supabase = await createClient()
  
  // Fetch products directly from Supabase (server-side)
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .limit(20)
    .order('created_at', { ascending: false })

  if (error) {
    return <div>Error loading products: {error.message}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products?.map((product) => (
          <div key={product.product_id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{product.product_name}</h2>
            <p className="text-gray-600">{product.product_description}</p>
            <p className="text-blue-600">Rating: {product.rating}/5</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Example 2: Using API Routes in Server Components

Create `app/products/page.tsx`:

```typescript
// app/products/page.tsx
interface Product {
  product_id: string
  product_name: string
  product_description: string | null
  rating: number | null
  reviews: number | null
  product_logo: string | null
}

interface ApiResponse {
  data: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string }
}) {
  const page = searchParams.page || '1'
  const search = searchParams.search || ''
  
  // Fetch from API route
  const url = new URL('/api/products', 'http://localhost:3000')
  url.searchParams.set('page', page)
  url.searchParams.set('limit', '20')
  if (search) {
    url.searchParams.set('search', search)
  }

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // Revalidate every hour
  })

  if (!response.ok) {
    return <div>Error loading products</div>
  }

  const result: ApiResponse = await response.json()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Products</h1>
      
      {/* Search form */}
      <form className="mb-4">
        <input
          type="text"
          name="search"
          placeholder="Search products..."
          defaultValue={search}
          className="border p-2 rounded"
        />
        <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {result.data.map((product) => (
          <div key={product.product_id} className="border p-4 rounded">
            {product.product_logo && (
              <img src={product.product_logo} alt={product.product_name} className="w-16 h-16 mb-2" />
            )}
            <h2 className="text-xl font-semibold">{product.product_name}</h2>
            <p className="text-gray-600 line-clamp-2">{product.product_description}</p>
            <div className="mt-2">
              <span className="text-blue-600">Rating: {product.rating || 'N/A'}/5</span>
              <span className="ml-4 text-gray-500">{product.reviews || 0} reviews</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex gap-2">
        {result.pagination.hasPreviousPage && (
          <a
            href={`?page=${parseInt(page) - 1}${search ? `&search=${search}` : ''}`}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Previous
          </a>
        )}
        <span className="px-4 py-2">
          Page {result.pagination.page} of {result.pagination.totalPages}
        </span>
        {result.pagination.hasNextPage && (
          <a
            href={`?page=${parseInt(page) + 1}${search ? `&search=${search}` : ''}`}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Next
          </a>
        )}
      </div>
    </div>
  )
}
```

### Example 3: Client Component with API Routes

Create `app/products/client-page.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'

interface Product {
  product_id: string
  product_name: string
  product_description: string | null
  rating: number | null
}

export default function ProductsClientPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const url = new URL('/api/products', window.location.origin)
        url.searchParams.set('page', page.toString())
        url.searchParams.set('limit', '20')
        if (search) {
          url.searchParams.set('search', search)
        }

        const response = await fetch(url.toString())
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const result = await response.json()
        setProducts(result.data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [page, search])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Products</h1>
      
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="border p-2 rounded mb-4"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.product_id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{product.product_name}</h2>
            <p className="text-gray-600">{product.product_description}</p>
            <p className="text-blue-600">Rating: {product.rating}/5</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  )
}
```

### Example 4: Search Component

Create `app/search/page.tsx`:

```typescript
// app/search/page.tsx
interface SearchResult {
  query: string
  type: string
  totalResults: number
  results: {
    products?: Array<{
      product_id: string
      product_name: string
      product_description: string | null
      rating: number | null
    }>
    companies?: Array<{
      company_id: string
      name: string
      website: string | null
    }>
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string }
}) {
  const query = searchParams.q || ''
  const type = searchParams.type || 'all'

  let results: SearchResult | null = null

  if (query) {
    const url = new URL('/api/search', 'http://localhost:3000')
    url.searchParams.set('q', query)
    url.searchParams.set('type', type)
    url.searchParams.set('limit', '20')

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    })

    if (response.ok) {
      results = await response.json()
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Search</h1>
      
      <form className="mb-4">
        <input
          type="text"
          name="q"
          placeholder="Search products and companies..."
          defaultValue={query}
          className="border p-2 rounded w-full max-w-md"
        />
        <select name="type" defaultValue={type} className="border p-2 rounded ml-2">
          <option value="all">All</option>
          <option value="products">Products</option>
          <option value="companies">Companies</option>
        </select>
        <button type="submit" className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>

      {results && (
        <div>
          <p className="text-gray-600 mb-4">
            Found {results.totalResults} results for "{results.query}"
          </p>

          {results.results.products && results.results.products.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.results.products.map((product) => (
                  <div key={product.product_id} className="border p-4 rounded">
                    <h3 className="text-lg font-semibold">{product.product_name}</h3>
                    <p className="text-gray-600">{product.product_description}</p>
                    <p className="text-blue-600">Rating: {product.rating}/5</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.results.companies && results.results.companies.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-2">Companies</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.results.companies.map((company) => (
                  <div key={company.company_id} className="border p-4 rounded">
                    <h3 className="text-lg font-semibold">{company.name}</h3>
                    <p className="text-gray-600">{company.website}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

---

## 🔍 Troubleshooting

### API Returns 500 Error

1. **Check environment variables:**
   ```bash
   # Make sure .env.local exists and has correct values
   cat .env.local
   ```

2. **Check Supabase connection:**
   - Verify your Supabase URL and keys are correct
   - Make sure RLS policies are set up

3. **Check server logs:**
   - Look at the terminal where `npm run dev` is running
   - Check for error messages

### API Returns Empty Results

1. **Check if data exists in Supabase:**
   - Go to Supabase dashboard
   - Check the tables have data

2. **Check RLS policies:**
   - Make sure RLS policies allow read access
   - Run the SQL from `supabase/rls-policies.sql`

### Rate Limiting Errors

- This is normal if you make too many requests quickly
- Wait a few seconds and try again
- For production, set up Upstash Redis

### Types Not Working

1. **Generate types:**
   ```bash
   npm run generate-types
   ```

2. **Restart TypeScript server in VS Code:**
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
   - Type "TypeScript: Restart TS Server"
   - Press Enter

---

## 📝 Quick Reference

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | List products with pagination and filters |
| `/api/products/[id]` | GET | Get single product |
| `/api/companies` | GET | List companies with pagination |
| `/api/companies/[id]` | GET | Get single company |
| `/api/companies/product/[productId]` | GET | Get company by product |
| `/api/reviews` | GET | List reviews with filters |
| `/api/reviews/product/[productId]` | GET | Get reviews by product |
| `/api/search` | GET | Full-text search |

### Query Parameters

**Products:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `search` - Search query
- `category` - Filter by category
- `minRating` - Minimum rating
- `maxRating` - Maximum rating
- `sortBy` - Sort field (rating, reviews, created_at, updated_at, product_name)
- `sortOrder` - Sort order (asc, desc)
- `companyId` - Filter by company

**Search:**
- `q` - Search query (required)
- `type` - Search type (products, companies, all)
- `limit` - Results limit (default: 20, max: 50)

---

## ✅ Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables set up (`.env.local`)
- [ ] RLS policies applied in Supabase
- [ ] Development server running (`npm run dev`)
- [ ] API routes tested (browser or cURL)
- [ ] TypeScript types generated (optional)
- [ ] Frontend components created
- [ ] Data displaying correctly

---

## 🎯 Next Steps

1. **Create your landing page** using the search API
2. **Build product listing pages** with filters
3. **Create product detail pages** showing reviews
4. **Add company pages** with their products
5. **Implement search functionality** in the hero section
6. **Add loading states** and error handling
7. **Style with Tailwind CSS** according to your design system

Happy coding! 🚀

