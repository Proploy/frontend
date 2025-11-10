# 🎯 START HERE - Complete Setup Guide

## What You Need to Do (In Order)

### ✅ Step 1: Install Dependencies (1 minute)

```bash
cd frontend
npm install
```

### ✅ Step 2: Set Up Environment Variables (2 minutes)

1. **Copy the example file:**

   ```bash
   cp env.example .env.local
   ```

2. **Get your Supabase credentials:**

   - Go to: https://app.supabase.com
   - Select your project
   - Go to: **Settings > API**
   - Copy these values:
     - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
     - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

3. **Edit `.env.local` file** and paste your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### ✅ Step 3: Set Up RLS Policies (2 minutes)

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Open the file: `supabase/rls-policies.sql`
4. Copy all the SQL code
5. Paste it into the SQL Editor
6. Click **Run**

This enables read access to your data.

### ✅ Step 4: Start the Server (30 seconds)

```bash
npm run dev
```

The server will start at: http://localhost:3000

### ✅ Step 5: Test the APIs (2 minutes)

**Option 1: Browser Test (Easiest)**

- Open: http://localhost:3000/api/products
- You should see JSON data with products

**Option 2: Test Page (Recommended)**

- Open: http://localhost:3000/api-test
- Click the test buttons to test different endpoints
- See the JSON responses

**Option 3: Command Line**

```bash
curl http://localhost:3000/api/products
```

**Option 4: Test Script**

```bash
npm run test-api
```

### ✅ Step 6: Verify Everything Works

Check these URLs in your browser:

- ✅ http://localhost:3000/api/products → Should show products
- ✅ http://localhost:3000/api/companies → Should show companies
- ✅ http://localhost:3000/api/search?q=software → Should show search results
- ✅ http://localhost:3000/api-test → Should show test page
- ✅ http://localhost:3000/products → Should show products page

## 🎉 You're Done!

Your API routes are set up and ready to use!

## 📚 Next Steps

### 1. Explore the Example Pages

- **Products Page**: http://localhost:3000/products

  - Shows how to use API routes in server components
  - Includes pagination and search

- **API Test Page**: http://localhost:3000/api-test
  - Interactive testing interface
  - Test all endpoints easily

### 2. Use APIs in Your Components

See `SETUP-AND-TESTING.md` for complete examples:

**Server Component (Recommended):**

```typescript
// app/my-page/page.tsx
export default async function MyPage() {
  const response = await fetch(
    "http://localhost:3000/api/products?page=1&limit=20",
    {
      next: { revalidate: 3600 },
    }
  );
  const { data } = await response.json();

  return (
    <div>
      {data.map((product) => (
        <div key={product.product_id}>{product.product_name}</div>
      ))}
    </div>
  );
}
```

**Client Component:**

```typescript
"use client";
import { useState, useEffect } from "react";

export default function MyPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products?page=1&limit=20")
      .then((res) => res.json())
      .then((data) => setProducts(data.data));
  }, []);

  return <div>{/* Render products */}</div>;
}
```

### 3. Build Your Landing Page

Use the search API for your hero section search:

```typescript
// Search functionality
const searchProducts = async (query: string) => {
  const response = await fetch(`/api/search?q=${query}&type=all`);
  const data = await response.json();
  return data.results;
};
```

## 📖 Available API Endpoints

### Products

- `GET /api/products` - List all products
- `GET /api/products?page=1&limit=20` - Paginated list
- `GET /api/products?search=software` - Search products
- `GET /api/products?minRating=4` - Filter by rating
- `GET /api/products/[id]` - Get single product

### Companies

- `GET /api/companies` - List all companies
- `GET /api/companies/[id]` - Get single company
- `GET /api/companies/product/[productId]` - Get company by product

### Reviews

- `GET /api/reviews` - List all reviews
- `GET /api/reviews/product/[productId]` - Get reviews by product

### Search

- `GET /api/search?q=software&type=all` - Search all
- `GET /api/search?q=management&type=products` - Search products only
- `GET /api/search?q=tech&type=companies` - Search companies only

## 🐛 Troubleshooting

### Problem: "Error: Invalid API key"

**Solution:**

- Check your `.env.local` file
- Make sure there are no extra spaces
- Restart the dev server: `npm run dev`

### Problem: "No data returned"

**Solution:**

- Check if data exists in Supabase tables
- Verify RLS policies are applied (Step 3)
- Check browser console for errors

### Problem: "Rate limit exceeded"

**Solution:**

- Wait a few seconds and try again
- This is normal when testing multiple requests

### Problem: "Cannot find module"

**Solution:**

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📁 Important Files

- `GET-STARTED.md` - Quick start guide
- `SETUP-AND-TESTING.md` - Complete setup and testing guide
- `QUICK-REFERENCE.md` - Quick reference card
- `app/products/page.tsx` - Example products page
- `app/api-test/page.tsx` - API testing page
- `supabase/rls-policies.sql` - RLS policies SQL

## ✅ Checklist

Before you start building:

- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables set (`.env.local`)
- [ ] RLS policies applied (Supabase SQL Editor)
- [ ] Server running (`npm run dev`)
- [ ] APIs tested (browser or test page)
- [ ] Example pages working

## 🚀 You're Ready to Build!

Your API routes are set up, tested, and ready to use. Start building your frontend components!

**Need help?** Check:

- `SETUP-AND-TESTING.md` for detailed examples
- `QUICK-REFERENCE.md` for quick API reference
- `GET-STARTED.md` for step-by-step setup

Happy coding! 🎉
