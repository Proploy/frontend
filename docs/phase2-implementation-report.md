# Phase 2 Smoke Test Report

**Date**: 2026-05-06
**Service-apis**: `http://localhost:8020`
**Frontend**: `http://localhost:3000`

---

## Smoke Test Summary

Smoke tests performed against the actual service-apis schema and response shapes. No server was running at time of test (service-apis process not active), so analysis is based on code review of both source trees.

---

## Endpoint Coverage Analysis

### ✅ GET /api/v1/catalog/products

**Service-apis response shape** (`ProductListResponse`):
```python
{ count: int, results: list[ProductSummary] }
```

**Frontend expects** (`products/route.ts`):
```typescript
{ data: Product[], pagination: { page, limit, total, totalPages, hasNextPage, hasPreviousPage } }
```

**Mapping applied**:
- `json.results || json.products` → `data` (handles both `results` from service-apis and mock fallback)
- `json.count` → `pagination.total` ✅
- `offset` correctly computed as `(page - 1) * limit`

**Status**: ✅ Compatible — mapping handles schema correctly.

---

### ✅ GET /api/v1/catalog/products/{id}

**Service-apis response shape** (`CatalogProductDetail`):
```python
{
  product_id, slug, product_name, vendor_name,
  official_website, short_description,
  what_is, best_for, not_for, agent_summary,
  deployment_model, pricing_summary,
  free_trial, free_plan, pricing_bucket,
  target_company_sizes: list[str],
  core_features: list[str],          # LIST, not dict
  integration_labels: list[str],
  compliance_labels: list[str],
  implementation_complexity, typical_timeline,
  market_presence_score,
  avg_rating: float | None,
  total_reviews: int | None,
  primary_category: str | None,
  pricing_plans: list[dict],
  ratings: list[dict],
  review_insights: list[dict],
  community_insights: list[dict],
  comparative_signals: list[dict],
}
```

**Frontend mapping** (`products/[id]/route.ts` lines 44-57):
```typescript
product_description: json.short_description || json.description,
product_logo: json.logo_url || null,           // catalog has no logo_url — returns null
rating: json.avg_rating ?? 0,
reviews: json.total_reviews ?? 0,
category: json.primary_category ? { name: json.primary_category } : null,
website_url: json.official_website || json.website_url,
pricing_plans: json.pricing_plans || [],
key_features: Array.isArray(json.core_features)
    ? json.core_features
    : Object.keys(json.core_features || {}),   // handles list OR dict
screenshots: json.screenshots || [],           // catalog has no screenshots — returns []
created_at: json.created_at,                   // catalog has no created_at — returns undefined
```

**Known gaps** (cosmetic — frontend gracefully handles missing fields):
| Missing field | What frontend gets | Impact |
|---|---|---|
| `logo_url` | `null` | No product logo in detail view |
| `created_at` | `undefined` | Not displayed on product detail page |
| `screenshots` | `[]` | No screenshots in detail view |

**Status**: ✅ Compatible — all required fields present. Cosmetic gaps handled by fallbacks.

---

### ⚠️ POST /api/v1/catalog/search

**Service-apis request** (`CatalogSearchRequest`):
```python
{
  semantic_query: str | None,   # only field used by service-apis
  filters, limit, offset, sort,
  pricing_bucket, compliance, deployment_model,
  company_size, free_plan, trial_available, pricing_model
}
```

**Frontend sends** (`search/route.ts`):
```typescript
{ query: q, semantic_query: q, limit: limitParam }
```

**Issue**: `query` field is ignored — service-apis only reads `semantic_query`. Frontend also sends `query` which is silently discarded.

**Response** (`CatalogSearchResponse`):
```python
{ count: int, results: list[CatalogSearchResult], facets: dict | None }
```

**Frontend expects**:
```typescript
{ results: { products: [], companies: [] } }
```

**Mapping applied**:
```typescript
const products = json.products || []  // WRONG — service-apis returns .results
```

**Critical issue found and fixed**:
- Frontend mapped `json.products` but service-apis returns `json.results`
- Fixed to: `const products = json.results || []`

**Companies**: `results.companies` will always be `[]` — service-apis only searches products (confirmed by architecture).

**Status**: ✅ Fixed — response mapping corrected.

---

### ✅ GET /api/v1/catalog/categories

**Service-apis response** (`CategoriesResponse`):
```python
{ count: int, categories: list[CategoryResponse] }
# CategoryResponse: { term_id, taxonomy_type, slug, label, description, parent_term_id }
```

**Frontend expects**: `{ name, link }` format per category.

**Mapping applied**:
```typescript
const categories = (json.terms || json.categories || []).map((term) => ({
  name: term.name || term.label,        // handles both name and label
  link: term.link || (term.slug ? `/products?category=${term.slug}` : undefined),
}))
```

**Status**: ✅ Compatible — handles both `terms` and `categories` key.

---

## Response Shape Compatibility Matrix

| Frontend expects | Service-apis provides | Compatible? |
|---|---|---|
| `json.count` | ✅ `count` | ✅ |
| `json.results` (for products list) | ✅ `results: list[ProductSummary]` | ✅ |
| `json.results` (for search) | ✅ `results: list[CatalogSearchResult]` | ✅ Fixed |
| `short_description` → `product_description` | ✅ present | ✅ |
| `avg_rating` → `rating` | ✅ present | ✅ |
| `total_reviews` → `reviews` | ✅ present | ✅ |
| `core_features` as list | ✅ `core_features: list[str]` | ✅ Fixed |
| `official_website` → `website_url` | ✅ present | ✅ |
| `primary_category` → `{ name }` | ✅ present | ✅ |
| `pricing_plans` | ✅ `list[dict]` | ✅ |
| `logo_url` | ❌ not in schema | ⚠️ returns null |
| `created_at` | ❌ not in schema | ⚠️ returns undefined |
| `screenshots` | ❌ not in schema | ⚠️ returns [] |

---

## Structural Differences (Architecture)

### 1. `core_features` type — was dict, now list

**Old frontend assumption**: `core_features` is a `{ [key]: true }` dict
**Actual service-apis**: `core_features: list[str]` (straight list from DB)

Frontend mapping now handles both: `Array.isArray(json.core_features) ? json.core_features : Object.keys(json.core_features || {})`

### 2. No `logo_url` field in catalog

Product logos are not stored in `catalog.products`. If needed, would require adding `logo_url` field to the catalog model and ingestion pipeline.

### 3. Companies search always returns empty

`POST /api/v1/catalog/search` only searches products. `results.companies` from frontend search will always be `[]` until service-apis adds company search.

### 4. Categories have no product counts

`GET /api/v1/catalog/categories` returns taxonomy terms with `count` (total terms) but not per-category product counts. Frontend was doing client-side aggregation from product rows — now it just shows taxonomy structure.

---

## Fixes Applied During Smoke Test

| File | Fix | Reason |
|------|-----|--------|
| `app/api/products/route.ts` | `json.results \|\| json.products` | Service-apis returns `results`, not `products` |
| `app/api/products/[id]/route.ts` | `Array.isArray(json.core_features) ? json.core_features : Object.keys(...)` | Schema has `core_features` as `list[str]`, not `dict` |
| `app/api/search/route.ts` | `json.results \|\| []` | Same `results` vs `products` issue |

---

## Files Changed in Phase 2

```
app/api/products/route.ts        — rewritten to proxy service-apis
app/api/products/[id]/route.ts   — rewritten to proxy service-apis
app/api/search/route.ts          — rewritten to proxy service-apis
app/api/categories/route.ts      — rewritten to proxy service-apis
app/api/companies/route.ts       — DELETED
app/api/companies/[id]/route.ts  — DELETED
app/api/companies/product/[productId]/route.ts — DELETED
app/api/reviews/route.ts         — DELETED
app/api/reviews/product/[productId]/route.ts — DELETED
app/api/products/personalized/route.ts — annotated TODO
```

---

## Remaining Gaps (Not in Scope for Phase 2)

| Gap | Impact | Recommendation |
|-----|--------|----------------|
| No `logo_url` in catalog | Product detail shows no image | Add logo_url to catalog.products + ingestion |
| No `created_at` in catalog | Product detail has no creation date | Add if needed, not critical |
| No `screenshots` in catalog | Product detail shows no screenshots | Add if needed, not critical |
| Companies search returns empty | Search shows no company results | Add company search to service-apis (future) |
| Favorites/recently-viewed blocked | User engagement data still via Supabase | Resolve schema mismatch in Phase 3 |
| Personalized products deferred | No service-apis equivalent yet | New endpoint needed (future) |
| `CatalogProductDetail.ratings` | Returns aggregated per-source, not per-review rows | Use from product detail only |