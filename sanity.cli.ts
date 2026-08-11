import { defineCliConfig } from 'sanity/cli'

import { dataset, projectId } from './sanity/env'

/**
 * CLI config — used by `npx sanity <command>`, most importantly:
 *   npm run typegen   (schema extract + GROQ type generation)
 */
export default defineCliConfig({
  api: { projectId, dataset },
  /**
   * The Studio is served by Next.js at /studio, not by `sanity dev`, so
   * autoUpdates is off — Studio versioning follows package.json.
   */
  autoUpdates: false,
})
