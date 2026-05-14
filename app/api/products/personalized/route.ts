import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import { handleApiError, createErrorResponse } from '@/lib/utils/errors'
import { rateLimit, getClientIP } from '@/lib/utils/ratelimit'
import { getUserInterests } from '@/lib/service-apis/client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rateLimitResult = await rateLimit(ip)

    if (!rateLimitResult.success) {
      return createErrorResponse(
        'RATE_LIMIT_EXCEEDED',
        'Too many requests. Please try again later.',
        429
      )
    }

    const supabase = createAdminClient()
    let userId: string | null = null

    const user = await getUser()
    if (user) {
      userId = user.id
    }

    let productIds: string[] = []

    if (userId) {
      const { data: favorites } = await supabase
        .from('favorite')
        .select('productId')
        .eq('userId', userId)

      const { data: recentlyViewed } = await supabase
        .from('recently_viewed')
        .select('productId')
        .eq('userId', userId)
        .order('viewedAt', { ascending: false })
        .limit(10)

      const interestsResp = await getUserInterests().catch(() => null)
      const interests = (interestsResp?.data ?? null) as { industries?: string[] } | null

      const favoriteIds = favorites?.map(f => f.productId) || []
      const recentIds = recentlyViewed?.map(r => r.productId) || []

      productIds = [...new Set([...favoriteIds, ...recentIds])]

      let categoryFilter: string[] = []
      if (interests?.industries && interests.industries.length > 0) {
        categoryFilter = interests.industries.slice(0, 3)
      }

      if (categoryFilter.length > 0 && productIds.length < 10) {
        const { data: categoryProducts } = await supabase
          .from('products')
          .select('product_id')
          .ilike('category->>name', `%${categoryFilter[0]}%`)
          .limit(10 - productIds.length)

        if (categoryProducts) {
          const categoryIds = categoryProducts.map(p => p.product_id)
          productIds = [...new Set([...productIds, ...categoryIds])]
        }
      }
    }

    let products
    if (productIds.length > 0) {
      const { data } = await supabase
        .from('products')
        .select('*')
        .in('product_id', productIds)
        .order('rating', { ascending: false })
        .limit(10)

      products = data || []
    } else {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('rating', { ascending: false })
        .limit(10)

      products = data || []
    }

    return Response.json({
      data: products,
      personalized: !!userId,
      rateLimit: {
        remaining: rateLimitResult.remaining,
        limit: rateLimitResult.limit,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
