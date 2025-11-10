/**
 * Generate TypeScript types from Supabase schema
 * Alternative to the shell script, using Node.js
 * 
 * Usage: node scripts/generate-types.js
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('Generating TypeScript types from Supabase schema...')

try {
  // Check if types directory exists
  const typesDir = path.join(process.cwd(), 'types')
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true })
  }

  // Generate types using Supabase CLI
  const output = execSync('npx supabase gen types typescript --linked', {
    encoding: 'utf-8',
    stdio: 'pipe',
  })

  // Write to file
  const outputPath = path.join(typesDir, 'database.types.ts')
  fs.writeFileSync(outputPath, output)

  console.log('✅ Types generated successfully at types/database.types.ts')
} catch (error) {
  console.error('❌ Failed to generate types:', error.message)
  console.log('\nMake sure you have:')
  console.log('1. Installed Supabase CLI: npm install -g supabase')
  console.log('2. Linked your project: supabase link --project-ref <your-project-ref>')
  console.log('\nAlternatively, use the Supabase Dashboard:')
  console.log('1. Go to your Supabase project')
  console.log('2. Navigate to Settings > API')
  console.log('3. Scroll to "Generate TypeScript types"')
  console.log('4. Copy the generated types to types/database.types.ts')
  process.exit(1)
}

