#!/bin/bash

# Generate TypeScript types from Supabase schema
# This script requires the Supabase CLI to be installed and linked to your project

echo "Generating TypeScript types from Supabase schema..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "Supabase CLI is not installed. Installing..."
    npm install -g supabase
fi

# Generate types
supabase gen types typescript --linked > types/database.types.ts

if [ $? -eq 0 ]; then
    echo "✅ Types generated successfully at types/database.types.ts"
else
    echo "❌ Failed to generate types. Make sure you're linked to your Supabase project."
    echo "Run: supabase link --project-ref <your-project-ref>"
    exit 1
fi

