// Example Products Page using API Routes
import Link from 'next/link'

interface Product {
  product_id: string
  product_name: string
  product_description: string | null
  rating: number | null
  reviews: number | null
  product_logo: string | null
  created_at: string
}

interface ApiResponse {
  data: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; category?: string; minRating?: string }
}) {
  const page = searchParams.page || '1'
  const search = searchParams.search || ''
  const category = searchParams.category || ''
  const minRating = searchParams.minRating || ''

  // Build API URL - Use absolute URL for server-side fetch
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const apiUrl = new URL('/api/products', baseUrl)
  apiUrl.searchParams.set('page', page)
  apiUrl.searchParams.set('limit', '20')
  if (search) apiUrl.searchParams.set('search', search)
  if (category) apiUrl.searchParams.set('category', category)
  if (minRating) apiUrl.searchParams.set('minRating', minRating)

  // Fetch data from API route
  let result: ApiResponse | null = null
  let error: string | null = null

  try {
    // For server components, we can also fetch directly from Supabase
    // But using API route is good for consistency and rate limiting
    const response = await fetch(apiUrl.toString(), {
      next: { revalidate: 3600 }, // Revalidate every hour (ISR)
      cache: 'force-cache', // Cache the response
    })

    if (!response.ok) {
      error = `Failed to fetch products: ${response.statusText}`
    } else {
      result = await response.json()
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'An error occurred'
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-600">Error: {error}</div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="container mx-auto p-4">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-4xl font-bold mb-6">Products</h1>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <form className="flex gap-2">
          <input
            type="text"
            name="search"
            placeholder="Search products..."
            defaultValue={search}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="minRating"
            placeholder="Min Rating"
            defaultValue={minRating}
            min="0"
            max="5"
            step="0.1"
            className="w-32 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Count */}
      <p className="text-gray-600 mb-4">
        Showing {result.data.length} of {result.pagination.total} products
      </p>

      {/* Products Grid */}
      {result.data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.data.map((product) => (
            <Link
              key={product.product_id}
              href={`/products/${product.product_id}`}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              {product.product_logo && (
                <img
                  src={product.product_logo}
                  alt={product.product_name}
                  className="w-16 h-16 mb-4 object-contain"
                />
              )}
              <h2 className="text-xl font-semibold mb-2">{product.product_name}</h2>
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {product.product_description || 'No description available'}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  {product.rating && (
                    <span className="text-yellow-500 font-semibold">
                      ⭐ {product.rating.toFixed(1)}
                    </span>
                  )}
                  {product.reviews && (
                    <span className="text-gray-500 ml-2">({product.reviews} reviews)</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {result.pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {result.pagination.hasPreviousPage && (
            <Link
              href={`/products?page=${result.pagination.page - 1}${search ? `&search=${search}` : ''}${category ? `&category=${category}` : ''}${minRating ? `&minRating=${minRating}` : ''}`}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Previous
            </Link>
          )}
          <span className="px-4 py-2 text-gray-600">
            Page {result.pagination.page} of {result.pagination.totalPages}
          </span>
          {result.pagination.hasNextPage && (
            <Link
              href={`/products?page=${result.pagination.page + 1}${search ? `&search=${search}` : ''}${category ? `&category=${category}` : ''}${minRating ? `&minRating=${minRating}` : ''}`}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

