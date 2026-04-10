# Authentication & User Flow Guide

**Version:** 1.0.0  
**Last Updated:** April 2026

---

## Table of Contents

1. [User Types](#user-types)
2. [Authentication Flow](#authentication-flow)
3. [Expert Application Flow](#expert-application-flow)
4. [Admin Approval Flow](#admin-approval-flow)
5. [Protected Routes](#protected-routes)
6. [Session Management](#session-management)

---

## User Types

| Type | Description | Access |
|------|-------------|--------|
| **Visitor** | Unauthenticated user | Public pages only |
| **Regular User** | Authenticated user | Favorites, recently viewed, interests |
| **Expert Applicant** | User applying to be expert | Expert form (status: draft/submitted) |
| **Approved Expert** | Expert with approved status | Expert dashboard |
| **Admin** | Platform administrator | Admin dashboard |

---

## Authentication Flow

### Registration (Email/Password)

1. User visits `/sign-up`
2. Fills form with email & password
3. Calls `signUp(email, password)` from auth hook
4. Supabase creates user & sends confirmation email
5. User confirms via email link
6. Redirected to callback page → authenticated

```tsx
// Sign up component
const { signUp } = useAuth()

async function handleSignUp(e) {
  e.preventDefault()
  const { error } = await signUp(email, password)
  if (!error) {
    // Show verification email sent message
  }
}
```

### Login (Email/Password)

1. User visits `/sign-in`
2. Enters email & password
3. Calls `signIn(email, password)` from auth hook
4. Supabase validates credentials
5. Sets session cookie
6. Redirects to specified URL (default: `/`)

```tsx
// Sign in component
const { signIn } = useAuth()

async function handleSignIn(e) {
  e.preventDefault()
  const { error } = await signIn(email, password)
  if (!error) {
    router.push(redirectUrl || '/')
  }
}
```

### OAuth Login (Google, GitHub, Azure)

1. User clicks OAuth provider button
2. Calls `signInWithOAuth(provider)` from auth hook
3. Redirects to provider's login page
4. Provider redirects back to `/auth/callback`
5. Auth callback sets session cookie
6. Redirects to original destination

```tsx
// OAuth component
const { signInWithOAuth } = useAuth()

async function handleOAuth(provider: 'google' | 'github' | 'azure') {
  await signInWithOAuth(provider, '/dashboard')
}
```

### Logout

1. User clicks logout button
2. Calls `signOut()` from auth hook
3. Supabase clears session cookie
4. Redirects to landing page

```tsx
const { signOut } = useAuth()

function handleLogout() {
  await signOut()
  router.push('/')
}
```

---

## Expert Application Flow

### Overview

The expert application is a 5-step form:

1. **Identity & Entity** - Basic info & location
2. **Expertise & Focus** - Platforms, industries, experience
3. **Proof & Portfolio** - Links, certifications, video
4. **Availability & Fit** - Hours, tools, strengths
5. **Compliance** - Terms acceptance

### Flow Diagram

```
Start
  │
  ▼
/become-expert (Public)
/expert/apply (Protected)
  │
  ▼
Step 1: Identity & Entity
  │ - entityType (select)
  │ - displayName (text)
  │ - headline (text)
  │ - regionCountry (select)
  │ - regionCity (text)
  │ - timezone (select)
  │
  ▼ [Next] → Save Draft
Step 2: Expertise & Focus
  │ - primaryPlatforms (tags with suggestions)
  │ - secondaryPlatforms (tags)
  │ - industryExpertise (tags)
  │ - preferredProjectTypes (tags)
  │ - yearsExperience (number)
  │ - projectsCompletedTotal (number)
  │
  ▼ [Next] → Save Draft
Step 3: Proof & Portfolio
  │ - introVideoLink (url)
  │ - portfolioLinks (url list)
  │ - certificationLinks (url list)
  │ - testimonialsLinks (url list)
  │ - featuredProjects (project list)
  │
  ▼ [Next] → Save Draft
Step 4: Availability & Fit
  │ - availabilityHoursPerWeek (number)
  │ - availabilityNotes (textarea)
  │ - whyPlatform (textarea)
  │ - uniqueStrength (textarea)
  │ - idealClients (textarea)
  │ - biggestWin (textarea)
  │ - toolsStack (tags with suggestions)
  │
  ▼ [Next] → Save Draft
Step 5: Compliance
  │ - agreeTerms (checkbox)
  │ - consentContact (checkbox)
  │
  ▼ [Submit]
/become-expert/success
  │
  ▼
Status: submitted (waiting for review)
```

### Form Persistence

- **Auto-save**: Draft saved when user clicks "Next" or "Back"
- **Resume**: Form re-populates from `/api/experts/me` on page load
- **Status tracking**:
  - `draft` - Form in progress
  - `submitted` - Awaiting admin review
  - `approved` - Application accepted
  - `rejected` - Application denied
  - `changes_requested` - Admin requested updates

### Key API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/experts/me` | GET | Get current user's expert profile (including draft) |
| `/api/experts/draft` | POST | Save form progress |
| `/api/experts/submit` | POST | Submit application for review |

### Validation

The submit endpoint validates all required fields. On validation error:

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Please check all required fields",
  "details": {
    "fields": {
      "displayName": "Display name is required",
      "primaryPlatforms": "At least one primary platform is required"
    }
  }
}
```

Frontend should display these field-level errors next to each affected field.

---

## Admin Approval Flow

### Overview

Admins review submitted expert applications and approve, reject, or request changes.

### Flow Diagram

```
Admin Login
  │
  ▼
/admin/experts (Dashboard)
  │ - Shows all applications
  │ - Filter by status (all/submitted/approved/rejected/draft)
  │ - Shows stats (total, pending, approved, rejected)
  │
  ▼ [Click Application]
/admin/experts/[id] (Review Page)
  │ - Shows full application details
  │ - Review notes textarea
  │
  ▼ [Action Button]
Approve → Status: approved → Expert can access dashboard
Reject → Status: rejected → Application denied
Request Changes → Status: changes_requested → Applicant can edit & resubmit
```

### Admin Dashboard Features

- **Stats Overview**: Total, submitted, approved, rejected, draft counts
- **Filter Tabs**: All, Pending (submitted), Approved, Rejected, Draft
- **Application Cards**: Display name, headline, location, status badge
- **Review Actions**: Approve, Reject, Request Changes buttons

### Key API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/experts` | GET | List all expert applications |
| `/api/admin/experts/stats` | GET | Get application statistics |
| `/api/admin/experts/{id}` | GET | Get single application details |
| `/api/admin/experts/{id}` | PATCH | Update application status |

### Admin Check

Admin access is determined by email. The user's email must be in the `ADMIN_EMAILS` environment variable.

```typescript
// In admin routes
await verifyAdmin() // Throws if not admin
```

---

## Protected Routes

### Route Protection Levels

| Level | Description | Examples |
|-------|-------------|----------|
| **Public** | No auth required | `/`, `/products`, `/experts` |
| **Auth Required** | Must be logged in | `/favorites`, `/expert/apply` |
| **Expert Required** | Must be approved expert | `/expert/dashboard` |
| **Admin Required** | Must be admin | `/admin/*` |

### Client-Side Protection

Use the auth hook to check access:

```tsx
const { user, expert, isLoading } = useAuth()

if (isLoading) return <Loading />

if (!user) {
  router.push('/sign-in?redirect=/expert/apply')
  return
}

if (expert?.status !== 'approved') {
  router.push('/become-expert')
  return
}
```

### Server-Side Protection

API routes check authentication automatically:

```typescript
// Protected route example
export async function GET(request: NextRequest) {
  const user = await getUser()
  if (!user) {
    return createErrorResponse('UNAUTHORIZED', 'Not authenticated', 401)
  }
  // Continue with logic
}
```

### Middleware Protection

The `proxy.ts` file handles route protection at the edge:

- Public routes: `/`, `/products`, `/experts`, `/sign-in`, `/sign-up`
- Auth routes: Redirect to sign-in if not authenticated
- Admin routes: Verify admin email

---

## Session Management

### Cookie-Based Sessions

Supabase manages sessions via HTTP cookies:
1. User logs in → Supabase sets session cookie
2. Subsequent requests include cookie automatically
3. Server validates cookie on each request
4. Cookie expires after configured duration (default: 1 week)

### Session Verification

```typescript
// Server-side (API routes)
import { getUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const user = await getUser()
  // user contains { id, email } or null
}
```

### Auth Callback

The `/auth/callback` route handles OAuth callbacks:
1. OAuth provider redirects here with auth code
2. Code exchanged for session
3. User redirected to destination (stored in `next` query param)

### Auth Intent Cookie

When user tries to access protected page while logged out:
1. Store intended destination in cookie (`auth-intent`)
2. Redirect to sign-in
3. After login, read cookie and redirect to original destination

---

## Related Documentation

- [FRONTEND_HANDBOOK.md](./FRONTEND_HANDBOOK.md) - Project overview
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - Detailed API reference