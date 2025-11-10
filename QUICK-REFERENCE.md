# Quick Reference Card

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp env.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Set up RLS policies in Supabase SQL Editor
# Run: supabase/rls-policies.sql

# 4. Start development server
npm run dev

# 5. Test APIs
# Browser: http://localhost:3000/api/products
# Test Page: http://localhost:3000/api-test
# Script: npm run test-api
```

## 📡 API Endpoints

### Products
```
GET /api/products
GET /api/products?page=1&limit=20
GET /api/products?search=software
GET /api/products?minRating=4&category=CRM
GET /api/products/[id]
```

### Companies
```
GET /api/companies
GET /api/companies?page=1&limit=20
GET /api/companies?search=tech
GET /api/companies/[id]
GET /api/companies/product/[productId]
```

### Reviews
```
GET /api/reviews
GET /api/reviews?page=1&limit=20
GET /api/reviews?minRating=4
GET /api/reviews/product/[productId]
```

### Search
```
GET /api/search?q=software&type=all
GET /api/search?q=management&type=products
GET /api/search?q=tech&type=companies
```

## 💻 Code Examples

### Server Component
```typescript
// app/products/page.tsx
export default async function ProductsPage() {
  const response = await fetch('http://localhost:3000/api/products?page=1&limit=20', {
    next: { revalidate: 3600 }
  })
  const { data } = await response.json()
  
  return <div>{/* Render products */}</div>
}
```

### Client Component
```typescript
'use client'
import { useState, useEffect } from 'react'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    fetch('/api/products?page=1&limit=20')
      .then(res => res.json())
      .then(data => setProducts(data.data))
  }, [])
  
  return <div>{/* Render products */}</div>
}
```

### Direct Supabase (Server Component)
```typescript
import { createClient } from '@/lib/supabase/server'

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .limit(20)
  
  return <div>{/* Render products */}</div>
}
```

## 🔧 Query Parameters

### Products
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `search` - Search query
- `category` - Filter by category
- `minRating` - Minimum rating (0-5)
- `maxRating` - Maximum rating (0-5)
- `sortBy` - Sort field (rating, reviews, created_at, updated_at, product_name)
- `sortOrder` - Sort order (asc, desc)
- `companyId` - Filter by company ID

### Search
- `q` - Search query (required)
- `type` - Search type (products, companies, all)
- `limit` - Results limit (default: 20, max: 50)

## 🧪 Testing

### Browser
```
http://localhost:3000/api/products
http://localhost:3000/api-test
```

### cURL
```bash
curl http://localhost:3000/api/products
curl "http://localhost:3000/api/search?q=software&type=all"
```

### Test Script
```bash
npm run test-api
```

## 📁 File Structure

```
frontend/
├── app/
│   ├── api/              # API routes
│   ├── products/         # Products page
│   └── api-test/         # API test page
├── lib/
│   ├── supabase/         # Supabase clients
│   ├── utils/            # Utilities
│   └── validations/      # Zod schemas
├── types/                # TypeScript types
└── .env.local           # Environment variables
```

## 🔑 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🐛 Common Issues

**Error: Invalid API key**
→ Check `.env.local` file

**No data returned**
→ Check RLS policies in Supabase

**Rate limit exceeded**
→ Wait a few seconds

**Module not found**
→ Run `npm install`

## 📚 Documentation

- **Quick Start**: `GET-STARTED.md`
- **Full Guide**: `SETUP-AND-TESTING.md`
- **Deployment**: `README-SETUP.md`

## ✅ Checklist

- [ ] Dependencies installed
- [ ] Environment variables set
- [ ] RLS policies applied
- [ ] Server running
- [ ] APIs tested
- [ ] Components created

---

**Need Help?** Check `SETUP-AND-TESTING.md` for detailed examples!

