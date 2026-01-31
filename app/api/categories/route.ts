import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'

export const revalidate = 3600 // Revalidate every hour

/**
 * GET /api/categories
 * Get unique categories from products with counts
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Get all products with category field (JSONB with name and link)
        const { data, error } = await supabase
            .from('products')
            .select('category, product_id')
            .not('category', 'is', null)

        if (error) {
            console.error('Supabase error:', error)
            return createErrorResponse('DATABASE_ERROR', error.message, 500)
        }

        // Extract unique category names and count products per category
        const categoryMap = new Map<string, { name: string; count: number; link?: string }>()

        data?.forEach((product: any) => {
            if (product.category && product.category.name) {
                const catName = product.category.name
                const existing = categoryMap.get(catName)
                if (existing) {
                    existing.count++
                } else {
                    categoryMap.set(catName, {
                        name: catName,
                        count: 1,
                        link: product.category.link
                    })
                }
            }
        })

        // Sort by count (descending) to show most popular categories first
        const categories = Array.from(categoryMap.values()).sort((a, b) => b.count - a.count)

        return Response.json({
            data: categories,
            total: categories.length,
        })
    } catch (error) {
        return handleApiError(error)
    }
}
