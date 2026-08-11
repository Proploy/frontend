'use client'

/**
 * Sanity Studio configuration.
 *
 * Mounted at /studio by app/(studio)/studio/[[...tool]]/page.tsx, which lives
 * under its own root layout so the site's Navbar, providers and Tailwind
 * preflight never reach the Studio.
 *
 * presentationTool (Visual Editing) is added in Phase 5, once the draft-mode
 * route handlers exist.
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes } from './sanity/schemaTypes'
import { structure } from './sanity/structure'

export default defineConfig({
  basePath: '/studio',
  title: 'Proploy',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    // GROQ playground — use this to develop queries before moving them into
    // sanity/lib/queries.ts.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
