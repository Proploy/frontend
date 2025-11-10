# Next.js + Supabase Setup Guide

This guide will help you set up the Next.js frontend with Supabase integration.

## Prerequisites

- Node.js 18+ installed
- A Supabase project created
- Supabase project URL and API keys

## Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file and fill in your values:

```bash
cp env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OAuth Configuration - Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OAuth Configuration - GitHub
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Rate Limiting - Upstash Redis (Optional, for production)
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Revalidation Configuration (in seconds)
REVALIDATE_TIME=3600
```

### 3. Set Up Row Level Security (RLS) Policies

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Run the SQL from `supabase/rls-policies.sql`

This will enable RLS and create policies that allow anonymous read access to products, companies, and reviews.

### 4. Generate TypeScript Types

#### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI globally:

   ```bash
   npm install -g supabase
   ```

2. Link your project:

   ```bash
   supabase link --project-ref <your-project-ref>
   ```

   (You can find your project ref in your Supabase project settings)

3. Generate types:

   ```bash
   # Using the shell script
   chmod +x scripts/generate-types.sh
   ./scripts/generate-types.sh

   # Or using Node.js script
   node scripts/generate-types.js

   # Or directly
   npx supabase gen types typescript --linked > types/database.types.ts
   ```

#### Option B: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Settings > API**
3. Scroll to **"Generate TypeScript types"**
4. Copy the generated types
5. Paste into `types/database.types.ts`

### 5. Set Up OAuth Providers (Optional)

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret to `.env.local`

#### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to `.env.local`

### 6. Set Up Rate Limiting (Optional, for Production)

For production, it's recommended to use Upstash Redis for rate limiting:

1. Create a free account at [Upstash](https://upstash.com/)
2. Create a new Redis database
3. Copy the REST URL and token
4. Add them to `.env.local`

**Note:** The application will fall back to in-memory rate limiting if Redis is not configured (suitable for development).

## Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

The following API routes are available:

### Products

- `GET /api/products` - Get paginated list of products
  - Query params: `page`, `limit`, `search`, `category`, `minRating`, `maxRating`, `sortBy`, `sortOrder`, `companyId`
- `GET /api/products/[id]` - Get a single product by ID

### Companies

- `GET /api/companies` - Get paginated list of companies
  - Query params: `page`, `limit`, `search`, `sortBy`, `sortOrder`
- `GET /api/companies/[id]` - Get a single company by ID
- `GET /api/companies/product/[productId]` - Get company by product ID

### Reviews

- `GET /api/reviews` - Get paginated list of reviews
  - Query params: `page`, `limit`, `productId`, `minRating`, `maxRating`, `sortBy`, `sortOrder`, `startDate`, `endDate`
- `GET /api/reviews/product/[productId]` - Get reviews by product ID

### Search

- `GET /api/search` - Full-text search across products and companies
  - Query params: `q` (search query), `type` (products|companies|all), `limit`

## Project Structure

```
frontend/
├── app/
│   ├── api/              # API routes
│   │   ├── products/
│   │   ├── companies/
│   │   ├── reviews/
│   │   └── search/
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── supabase/         # Supabase client utilities
│   │   ├── server.ts     # Server-side client
│   │   └── client.ts     # Browser-side client
│   ├── utils/            # Utility functions
│   │   ├── ratelimit.ts  # Rate limiting
│   │   └── errors.ts     # Error handling
│   └── validations/      # Zod validation schemas
│       └── api.ts
├── types/
│   └── database.types.ts # Generated TypeScript types
├── middleware.ts         # Next.js middleware for session refresh
└── supabase/
    └── rls-policies.sql  # RLS policies SQL
```

## Deployment to Google Cloud Platform (GCP)

### Option 1: Cloud Run (Recommended)

1. Build the Docker image:

   ```bash
   docker build -t gcr.io/<project-id>/nextjs-app .
   ```

2. Push to Google Container Registry:

   ```bash
   docker push gcr.io/<project-id>/nextjs-app
   ```

3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy nextjs-app \
     --image gcr.io/<project-id>/nextjs-app \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

### Option 2: App Engine

1. Create `app.yaml`:

   ```yaml
   runtime: nodejs20
   env: standard
   instance_class: F2
   ```

2. Deploy:
   ```bash
   gcloud app deploy
   ```

### Option 3: Compute Engine

1. Set up a VM instance
2. Install Node.js and PM2
3. Clone and deploy your application
4. Use PM2 to manage the process

### Environment Variables in GCP

Set environment variables in your GCP deployment:

- **Cloud Run**: Use the Cloud Console or `gcloud run services update`
- **App Engine**: Add to `app.yaml`
- **Compute Engine**: Set in your startup script or use Secret Manager

## Features

- ✅ Server-side rendering with Next.js App Router
- ✅ Supabase integration with RLS policies
- ✅ Rate limiting (Upstash Redis or in-memory fallback)
- ✅ TypeScript types generated from Supabase schema
- ✅ Zod validation for API inputs
- ✅ ISR (Incremental Static Regeneration) with 1-hour revalidation
- ✅ Full-text search across products and companies
- ✅ Pagination support
- ✅ Filtering and sorting
- ✅ Standardized error handling
- ✅ Session refresh middleware

## Next Steps

1. Customize the API routes based on your needs
2. Add authentication if needed (policies are already set up for anonymous access)
3. Implement the frontend components to consume these APIs
4. Set up monitoring and logging
5. Configure CDN for static assets
6. Set up CI/CD pipeline

## Troubleshooting

### Types not generating

- Make sure Supabase CLI is installed and linked
- Check that your project ref is correct
- Try generating types from the Supabase dashboard

### Rate limiting not working

- Check that Upstash Redis credentials are correct
- The app will fall back to in-memory rate limiting if Redis is not configured
- Check the console logs for rate limiting errors

### RLS policies blocking queries

- Make sure you've run the RLS policies SQL
- Check that policies are enabled in Supabase dashboard
- Verify that you're using the anon key (not service role key) in the client

### API routes returning errors

- Check that environment variables are set correctly
- Verify that Supabase URL and keys are correct
- Check the browser console and server logs for detailed error messages

## Support

For issues or questions, please refer to:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com/)
