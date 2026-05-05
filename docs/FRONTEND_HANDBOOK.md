# Proploy Frontend Handbook

**Version:** 1.0.0  
**Last Updated:** April 2026

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [User Flows](#user-flows)
4. [Authentication Integration](#authentication-integration)
5. [Error Handling](#error-handling)
6. [Environment Variables](#environment-variables)

---

## Project Overview

Proploy is a B2B software marketplace platform connecting businesses with software experts. The platform allows:

- **Users** to browse software products, save favorites, and track recently viewed items
- **Experts** to apply and showcase their expertise with B2B software tools
- **Admins** to review and approve expert applications

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x | App Router framework |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Supabase | 2.x | Auth & Database |
| Tailwind CSS | 4.x | Styling |
| Zod | 3.x | Form validation |
| Upstash Redis | 1.x | Rate limiting |

### Directory Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (sign-in, sign-up)
│   ├── api/               # API routes
│   │   ├── products/      # Product endpoints
│   │   ├── experts/       # Expert endpoints
│   │   ├── admin/        # Admin endpoints
│   │   ├── favorites/    # User favorites
│   │   └── ...
│   ├── products/         # Product pages
│   ├── experts/          # Expert pages
│   └── admin/            # Admin pages
├── components/            # React components
│   ├── providers/        # Context providers (auth)
│   ├── onboarding/       # Expert onboarding components
│   └── ...
├── lib/                   # Utilities
│   ├── auth.ts           # Auth helper functions
│   ├── supabase/         # Supabase clients
│   └── validations/      # Zod schemas
└── config/                # Configuration files
    └── onboarding-form.ts # Expert form config
```

---

## User Flows

### 1. Visitor Flow

```
Landing Page → Browse Products → View Product Details → Explore Experts
```

- All content is public
- No authentication required

### 2. Regular User Flow

```
Sign Up → Browse → Favorites → Recently Viewed → Interests
```

1. User registers via `/sign-in` or `/sign-up`
2. Can save products to favorites (`/api/favorites`)
3. Recently viewed products tracked automatically (`/api/recently-viewed`)
4. Can set interests for personalization (`/api/user-interests`)

### 3. Expert Applicant Flow

```
Sign Up → Become Expert → Fill Form (5 Steps) → Submit → Wait for Approval
```

**Steps:**
1. **Identity & Entity** - Name, headline, location, timezone
2. **Expertise & Focus** - Platforms, industries, project types, experience
3. **Proof & Portfolio** - Video, links, certifications, testimonials
4. **Availability & Fit** - Hours, tools stack, why join, strengths
5. **Compliance** - Terms agreement, contact consent

**Key Pages:**
- `/become-expert` - Multi-step form
- `/expert/apply` - Same form (protected route)
- `/become-expert/success` - Submission confirmation

**API Endpoints:**
- `GET /api/experts/me` - Get current user's expert profile
- `POST /api/experts/draft` - Save form progress
- `POST /api/experts/submit` - Submit application

**Statuses:** `draft` → `submitted` → `approved` | `rejected` | `changes_requested`

### 4. Approved Expert Flow

```
Login → Expert Dashboard → View Profile
```

- Only accessible if expert status is `approved`
- Endpoint: `GET /api/experts/dashboard`

### 5. Admin Flow

```
Login → Admin Dashboard → Review Applications → Approve/Reject
```

**Pages:**
- `/admin/experts` - List all applications with filters
- `/admin/experts/[id]` - Review single application

**Actions:**
- Approve → Expert can access dashboard
- Reject → Application denied
- Request Changes → Send back for updates

---

## Authentication Integration

### Using the Auth Hook

```tsx
import { useAuth } from '@/components/providers/auth-provider'

function MyComponent() {
  const { user, expert, isLoading, signIn, signOut } = useAuth()
  
  if (isLoading) return <Loading />
  
  if (!user) {
    return <button onClick={() => signIn(email, password)}>Login</button>
  }
  
  return (
    <div>
      <p>Welcome, {user.name}</p>
      {expert && <p>Expert Status: {expert.status}</p>}
      <button onClick={signOut}>Logout</button>
    </div>
  )
}
```

### Auth Context Properties

| Property | Type | Description |
|----------|------|-------------|
| `user` | `AuthUser \| null` | Current user object |
| `expert` | `Expert \| null` | User's expert profile |
| `isLoading` | `boolean` | Auth check in progress |
| `signIn` | `fn` | Email/password login |
| `signUp` | `fn` | Email/password registration |
| `signOut` | `fn` | Logout |
| `signInWithOAuth` | `fn` | OAuth login (Google, GitHub, Azure) |

### Auth User Object

```typescript
interface AuthUser {
  id: string
  email: string
  name: string | null
  image: string | null
}
```

### OAuth Providers

Configured in Supabase:
- Google
- GitHub
- Azure

---

## Error Handling

### Client-Side Error Display

```tsx
const handleSubmit = async () => {
  const res = await fetch('/api/experts/submit', {
    method: 'POST',
    body: JSON.stringify(formData)
  })
  
  if (!res.ok) {
    const err = await res.json()
    
    // Display field-specific errors
    if (err.details?.fields) {
      const fieldErrors = Object.entries(err.details.fields)
      fieldErrors.forEach(([field, message]) => {
        setFieldError(field, message)
      })
    } else {
      // Display general error
      setError(err.message)
    }
  }
}
```

### Error Response Format

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Please check all required fields",
  "details": {
    "fields": {
      "displayName": "Display name is required",
      "entityType": "Entity type is required"
    }
  },
  "statusCode": 400
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Admin access required |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |

---

## Environment Variables

### Required

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Optional

```env
# If using additional auth providers
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key
```

---

## Related Documentation

- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - Detailed API reference
- [AUTH_FLOW_GUIDE.md](./AUTH_FLOW_GUIDE.md) - Authentication flows