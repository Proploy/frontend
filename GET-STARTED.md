# 🚀 Get Started - Quick Setup Guide

## Prerequisites Checklist

Before starting, make sure you have:
- [ ] Node.js 18+ installed
- [ ] A Supabase project created
- [ ] Supabase project URL and API keys

## Step-by-Step Setup (5 Minutes)

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Set Up Environment Variables

```bash
# Copy the example file
cp env.example .env.local
```

**Get your Supabase credentials:**
1. Go to https://app.supabase.com
2. Select your project
3. Go to **Settings > API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

**Edit `.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up RLS Policies

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy the contents of `supabase/rls-policies.sql`
4. Paste and click **Run**

This enables read access to your data.

### 4. Start the Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

### 5. Test the API Routes

**Option A: Using Browser**
- Open: http://localhost:3000/api/products
- You should see JSON data

**Option B: Using Test Page**
- Open: http://localhost:3000/api-test
- Click the test buttons to test different endpoints

**Option C: Using cURL**
```bash
curl http://localhost:3000/api/products
```

**Option D: Using Test Script**
```bash
npm run test-api
```

### 6. Verify Setup

✅ **Checklist:**
- [ ] Server starts without errors
- [ ] `/api/products` returns data
- [ ] `/api/companies` returns data
- [ ] `/api/search?q=test` returns results
- [ ] No errors in terminal

## 🎯 Next Steps

### View Example Pages

1. **Products Page**: http://localhost:3000/products
2. **API Test Page**: http://localhost:3000/api-test

### Use APIs in Your Components

See `SETUP-AND-TESTING.md` for examples of:
- Server Components using API routes
- Client Components using API routes
- Search functionality
- Pagination

### Common Tasks

**Get Products:**
```typescript
const response = await fetch('/api/products?page=1&limit=20')
const data = await response.json()
```

**Search:**
```typescript
const response = await fetch('/api/search?q=software&type=all')
const data = await response.json()
```

**Get Single Product:**
```typescript
const response = await fetch('/api/products/product-id-here')
const data = await response.json()
```

## 🐛 Troubleshooting

### "Error: Invalid API key"
- Check your `.env.local` file
- Make sure keys are correct (no extra spaces)
- Restart the dev server after changing env vars

### "No data returned"
- Check if data exists in Supabase tables
- Verify RLS policies are applied
- Check browser console for errors

### "Rate limit exceeded"
- Wait a few seconds and try again
- This is normal if testing multiple requests quickly

### "Cannot find module"
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then `npm install`

## 📚 Documentation

- **Full Setup Guide**: `SETUP-AND-TESTING.md`
- **API Reference**: See "API Endpoints" section in `SETUP-AND-TESTING.md`
- **Deployment Guide**: `README-SETUP.md`

## ✅ You're Ready!

Your API routes are set up and ready to use. Start building your frontend components!

For more examples, see:
- `app/products/page.tsx` - Example products page
- `app/api-test/page.tsx` - API testing page

Happy coding! 🎉

