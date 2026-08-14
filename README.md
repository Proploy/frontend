# Proploy Frontend

**Version:** 2.0.0 (V2 Redesign)  
**Stack:** Next.js 16 (Turbopack) · React 19 · TypeScript 5 · Tailwind CSS 4 · Supabase 

This repository contains the Proploy platform frontend. It has been recently refactored to support the new **V2 Design System**, transitioning away from older legacy structures into a highly organized, feature-driven architecture. 

---

## 🏗 Architecture & Reasoning

The codebase follows a **Feature-Sliced Design** pattern to maximize modularity. Rather than lumping all hooks or components into giant root folders, logic is vertically sliced by domain (e.g., `workspace`, `catalog`, `experts`). 

This ensures that as the platform scales, the cognitive load remains low because all API integration, formatting logic, and domain-specific UI for a feature live together.

### 1. The `features/` Directory (Domain Logic)
This is the core of the application. Business domains (like `ai-workspace`, `workspace`, `catalog`, `experts`) are isolated here. 
- **Custom Hooks:** (e.g., `use-workspace.ts`) Directly interface with the backend (`service-apis`) to fetch, mutate, and manage domain state.
- **Data Formatting:** (e.g., `contract-format.ts`, `time-format.ts`) UI presentation logic.
- **Colocated Tests:** (e.g., `*.test.ts`) Tests live alongside the logic they verify.

### 2. The `app/(site)` Directory (Next.js App Router)
Handles routing, layouts, and page composition.
- **`(v2)` Route Group:** Encompasses all the newly redesigned V2 pages, utilizing the updated `v2-pages.css` Tailwind architecture.
- **Parallel & Intercepting Routes:** Used for complex dashboards and modal flows.
- *Note:* Legacy paths (like legacy home) have been retained but heavily updated to integrate with the V2 APIs (e.g., the contact flow).

### 3. The `hooks/` Directory (API Contracts & Mappers)
While `features/` handles domain logic, `hooks/` manages generic API boundaries.
- **`types/`**: Defines strictly typed API Contracts (mirroring backend Pydantic models) and ViewModels (what the UI actually renders).
- **`mappers/`**: Isolates the logic required to map raw API responses into UI ViewModels.

### 4. The Contact & Newsletter Flow
Lead capture forms (located on `legacy-home` and `products` pages) are fully wired up directly to the `service-apis` backend at the `/api/v1/contact` endpoint. This bypasses Next.js API route proxies to reduce latency and infrastructure overhead.

---

## 📂 Directory Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── (site)/                   # Main site layout boundary
│   │   ├── (v2)/                 # New V2 Redesign Pages
│   │   ├── legacy-home/          # Updated legacy entry pages
│   │   └── workspace/            # Authenticated workspace dashboard
│   ├── globals.css               # Global Tailwind directives
│   └── v2-pages.css              # V2 specific design system tokens
│
├── features/                     # Vertically sliced domain modules
│   ├── workspace/                # Dashboard, contracts, projects, hooks
│   ├── catalog/                  # Product and service catalog logic
│   ├── experts/                  # Expert directory and profiles
│   └── ai-workspace/             # AI evaluation logic
│
├── hooks/                        # Generic API and Data layers
│   ├── mappers/                  # API -> ViewModel mappers
│   └── types/                    # API Contracts and ViewModels
│
├── components/                   # Generic Reusable UI
│   ├── ui/                       # Primitive components (Button, Input, etc)
│   └── workspace/                # Shared dashboard shells (e.g., WorkspaceShell)
│
├── lib/                          # Third-party integrations & utilities
│   ├── supabase/                 # Supabase client instantiation
│   └── service-apis/             # Base API fetch clients (browser/server)
│
└── cloudbuild.yaml               # GCP Cloud Build automated deployment pipeline
```

---

## 🚀 Build & Deployment Flow (Google Cloud)

This frontend relies entirely on **Google Cloud Build** and **Cloud Run** (Netlify configurations have been fully deprecated).

1. **Trigger:** A push or merge to the `master` branch on GitHub automatically fires the Cloud Build trigger.
2. **Build:** `cloudbuild.yaml` executes a Docker build utilizing Next.js Turbopack. Required environment variables (Supabase, API URLs) are dynamically injected via Cloud Build substitution variables.
3. **Artifact Registry:** The resulting Docker image is pushed to the `australia-southeast1` Artifact Registry.
4. **Deploy:** The image is deployed to a managed Cloud Run instance (`proploy-frontend`) in the `australia-southeast1` (Sydney) region.

---

## 🔑 Environment Variables

To run the project locally, duplicate `env.example` to `.env` and provide:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SERVICE_APIS_URL` (Point to your local or deployed `service-apis` backend)
- `DATABASE_URL` (For Prisma/Direct DB connections if needed)
