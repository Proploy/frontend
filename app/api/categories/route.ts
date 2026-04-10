import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 //   


export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        
        const { data, error } = await supabase
            .from('products')
            .select('category, product_id')
            .not('category', 'is', null)

        if (error) {
            console.error('Supabase error:', error)
            return createErrorResponse('DATABASE_ERROR', error.message, 500)
        }

        
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

            
        const categories = Array.from(categoryMap.values()).sort((a, b) => b.count - a.count)

        return Response.json({
            data: categories,
            total: categories.length,
        })
    } catch (error) {
        return handleApiError(error)
    }
}
