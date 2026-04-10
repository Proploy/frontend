# API Endpoints Reference

**Version:** 1.0.0  
**Base URL:** `http://localhost:3000`

---

## Table of Contents

1. [Response Format](#response-format)
2. [Products API](#products-api)
3. [Categories API](#categories-api)
4. [Experts API](#experts-api)
5. [Admin API](#admin-api)
6. [User API](#user-api)
7. [Search API](#search-api)

---

## Response Format

### Success Response

```json
{
  "data": <any>,
  "rateLimit": {
    "remaining": 95,
    "limit": 100
  }
}
```

### Paginated Response

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 25,
    "total": 100,
    "totalPages": 4,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "rateLimit": { ... }
}
```

### Error Response

```json
{
  "error": "ERROR_CODE",
  "message": "Error message description",
  "statusCode": 400
}
```

---

## Products API

### Get All Products
```
GET /api/products
```

**Auth:** Not required

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 25 | Items per page (max 100) |
| search | string | - | Search term |
| category | string | - | Category filter (slug) |
| minRating | number | - | Minimum rating |
| sortBy | string | rating | Sort field (rating, reviews, product_name) |
| sortOrder | string | desc | Sort direction (asc, desc) |

**Response:**
```json
{
  "data": [
    {
      "product_id": "prod_123",
      "product_name": "Project Management Pro",
      "rating": 4.8,
      "reviews": 250,
      "product_logo": "https://...",
      "category": { "name": "Project Management", "slug": "project-management" }
    }
  ],
  "pagination": { "page": 1, "limit": 25, "total": 100, "totalPages": 4 }
}
```

---

### Get Product by ID
```
GET /api/products/{id}
```

**Auth:** Not required

**Response:**
```json
{
  "data": {
    "product_id": "prod_123",
    "product_name": "Project Management Pro",
    "product_description": "Best project management tool...",
    "rating": 4.8,
    "reviews": 250,
    "pricing_plans": [...],
    "features": [...]
  }
}
```

---

### Get Personalized Products
```
GET /api/products/personalized
```

**Auth:** Optional
- Authenticated users get personalized recommendations
- Anonymous users get popular products fallback

**Response:**
```json
{
  "data": [...],
  "personalized": true
}
```

---

## Categories API

### Get All Categories
```
GET /api/categories
```

**Auth:** Not required

**Response:**
```json
{
  "data": [
    { "name": "Project Management", "count": 45, "link": "/products?category=project-management" }
  ],
  "total": 15
}
```

---

## Experts API

### Get Approved Experts (Public)
```
GET /api/experts/approved
```

**Auth:** Not required

**Response:**
```json
{
  "data": [
    {
      "id": "exp_123",
      "displayName": "John Doe",
      "headline": "Senior Full-Stack Developer",
      "status": "approved",
      "regionCity": "San Francisco",
      "regionCountry": "USA",
      "yearsExperience": 10,
      "primaryPlatforms": ["Monday.com", "Asana"],
      "tags": [{ "tagType": "platform", "tagValue": "React" }],
      "links": [{ "linkType": "portfolio", "url": "https://..." }],
      "projects": [...]
    }
  ]
}
```

---

### Get My Expert Profile
```
GET /api/experts/me
```

**Auth:** Required

**Response:**
```json
{
  "data": {
    "id": "exp_123",
    "supabaseUserId": "user_456",
    "status": "draft",
    "displayName": "John Doe",
    "tags": [...],
    "links": [...],
    "projects": [...]
  }
}
```

---

### Save Expert Draft
```
POST /api/experts/draft
```

**Auth:** Required

**Request Body:**
```json
{
  "entityType": "Individual",
  "displayName": "John Doe",
  "headline": "Senior Developer",
  "regionCountry": "USA",
  "regionCity": "San Francisco",
  "timezone": "America/Los_Angeles",
  "yearsExperience": 5,
  "projectsCompletedTotal": 20,
  "primaryPlatforms": ["Monday.com", "Asana"],
  "secondaryPlatforms": ["HubSpot"],
  "industryExpertise": ["SaaS", "FinTech"],
  "preferredProjectTypes": ["Automation", "Ecosystem"],
  "toolsStack": ["Jira", "GitHub"],
  "tags": [{ "tagType": "platform", "tagValue": "Monday.com" }],
  "links": [{ "linkType": "portfolio", "url": "https://..." }],
  "projects": [...]
}
```

**Response:**
```json
{
  "data": { "id": "exp_123", "status": "draft", ... }
}
```

---

### Submit Expert Application
```
POST /api/experts/submit
```

**Auth:** Required

**Request Body:** Same as draft + required fields

**Validation Errors Response:**
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Please check all required fields",
  "details": {
    "fields": {
      "displayName": "Display name is required",
      "entityType": "Entity type is required",
      "primaryPlatforms": "At least one primary platform is required"
    }
  },
  "statusCode": 400
}
```

**Success Response:**
```json
{
  "data": { "id": "exp_123", "status": "submitted", ... }
}
```

---

### Get Expert Dashboard
```
GET /api/experts/dashboard
```

**Auth:** Required (must be approved expert)

**Response:**
```json
{
  "data": {
    "expert": { "id": "exp_123", "status": "approved", ... },
    "interests": [...],
    "recentlyViewed": [...]
  }
}
```

---

## Admin API

### Get All Expert Applications
```
GET /api/admin/experts
```

**Auth:** Admin only (email in ADMIN_EMAILS)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |
| status | string | Filter by status |

**Response:**
```json
{
  "data": [...],
  "pagination": { "page": 1, "limit": 20, "total": 50, "totalPages": 3 }
}
```

---

### Get Expert Stats
```
GET /api/admin/experts/stats
```

**Auth:** Admin only

**Response:**
```json
{
  "data": {
    "total": 50,
    "submitted": 10,
    "approved": 30,
    "rejected": 5,
    "draft": 5
  }
}
```

---

### Get Expert by ID
```
GET /api/admin/experts/{id}
```

**Auth:** Admin only

**Response:**
```json
{
  "data": {
    "id": "exp_123",
    "status": "submitted",
    "displayName": "John Doe",
    "tags": [...],
    "links": [...],
    "projects": [...],
    "reviews": [...]
  }
}
```

---

### Update Expert Status
```
PATCH /api/admin/experts/{id}
```

**Auth:** Admin only

**Request Body:**
```json
{
  "status": "approved",
  "notes": "Great experience and credentials!"
}
```

**Valid Status Values:**
- `approved` - Approve the expert
- `rejected` - Reject the application
- `changes_requested` - Request changes

**Response:**
```json
{
  "data": { "id": "exp_123", "status": "approved", ... }
}
```

---

## User API

### Get Favorites
```
GET /api/favorites
```

**Auth:** Required

**Response:**
```json
{
  "data": [
    {
      "id": "fav_123",
      "productId": "prod_123",
      "products": { "product_id": "prod_123", "product_name": "..." }
    }
  ]
}
```

---

### Add to Favorites
```
POST /api/favorites
```

**Auth:** Required

**Request Body:**
```json
{ "productId": "prod_123" }
```

**Response:**
```json
{ "data": { "id": "fav_123", "productId": "prod_123" } }
```

---

### Remove from Favorites
```
DELETE /api/favorites/{productId}
```

**Auth:** Required

**Response:**
```json
{ "data": { "success": true } }
```

---

### Get Recently Viewed
```
GET /api/recently-viewed
```

**Auth:** Required

**Response:**
```json
{
  "data": [
    { "id": "rv_123", "productId": "prod_123", "viewedAt": "2026-04-10T10:00:00Z" }
  ]
}
```

---

### Track Recently Viewed
```
POST /api/recently-viewed
```

**Auth:** Required

**Request Body:**
```json
{ "productId": "prod_123" }
```

**Response:**
```json
{ "data": { "success": true } }
```

---

### Get User Interests
```
GET /api/user-interests
```

**Auth:** Required

**Response:**
```json
{
  "data": {
    "id": "ui_123",
    "userId": "user_456",
    "industries": ["healthcare", "fintech"],
    "platforms": ["web", "mobile"],
    "projectTypes": ["SaaS", "e-commerce"],
    "companySizes": ["startup", "enterprise"]
  }
}
```

---

### Update User Interests
```
POST /api/user-interests
```

**Auth:** Required

**Request Body:**
```json
{
  "industries": ["healthcare", "fintech"],
  "platforms": ["web", "mobile"],
  "projectTypes": ["SaaS"],
  "companySizes": ["startup"]
}
```

**Response:**
```json
{ "data": { "success": true } }
```

---

## Search API

### Search Products
```
GET /api/search?q={query}
```

**Auth:** Not required

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| q | string | Search query (required) |
| category | string | Optional category filter |

**Response:**
```json
{ "data": [...] }
```

---

## Related Documentation

- [FRONTEND_HANDBOOK.md](./FRONTEND_HANDBOOK.md) - Project overview & flows
- [AUTH_FLOW_GUIDE.md](./AUTH_FLOW_GUIDE.md) - Authentication flows