import Link from 'next/link'
import Image from 'next/image'
import { Star, ExternalLink, Share2, ChevronRight, MessageSquare, Users, Zap, BarChart3 } from 'lucide-react'
import { notFound } from 'next/navigation'

// Product interface based on database schema
interface Product {
  product_id: string
  product_name: string
  product_description: string | null
  product_logo: string | null
  rating: number | null
  reviews: number | null
  category?: { name: string; link?: string }
  features?: Array<{ name: string; features: string[] }>
  detailed_features?: Array<{
    name: string
    features: Array<{
      name: string
      content: string
      percentage: number
      based_on_number_of_reviews: number
    }>
  }>
  alternatives?: Array<{ name: string; rating: number; reviews: number; link: string }>
  comparisons?: Array<{ name: string; logo: string; link: string }>
  pricing?: Array<{ type: string; price: string; features?: string[] }>
  popular_mentions?: string[]
  product_link?: string
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      next: { revalidate: 3600 }
    })
    
    if (!response.ok) {
      return null
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-8 py-12">
          <div className="flex items-start justify-between">
            {/* Left: Logo & Info */}
            <div className="flex gap-6">
              {/* Product Logo */}
              <div className="w-24 h-24 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                {product.product_logo ? (
                  <img 
                    src={product.product_logo}
                    alt={product.product_name}
                    className="w-20 h-20 object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {product.product_name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <h1 className="text-[32px] font-bold text-gray-900 font-dm-sans mb-2">
                  {product.product_name}
                </h1>
                
                {/* Category Badge */}
                {product.category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E8F1FF] text-[#0466E7] text-sm font-medium mb-3">
                    {product.category.name}
                  </span>
                )}

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(product.rating || 0)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {product.rating?.toFixed(1) || 'N/A'}
                  </span>
                  <span className="text-gray-500">
                    ({product.reviews?.toLocaleString() || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-4">
              <button className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              {product.product_link && (
                <a 
                  href={product.product_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-[#0466E7] text-white rounded-full font-semibold hover:bg-[#0355c0] transition-colors"
                >
                  Visit Website
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - 3 Column Layout */}
      <div className="max-w-[1400px] mx-auto px-8 py-10">
        <div className="flex gap-8">
          {/* Left Sidebar - Navigation */}
          <aside className="w-[200px] shrink-0">
            <nav className="sticky top-24 space-y-1">
              <a href="#about" className="block px-4 py-2 rounded-lg text-[#0466E7] bg-[#E8F1FF] font-medium">
                Product Information
              </a>
              <a href="#features" className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
                Features
              </a>
              <a href="#reviews" className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
                Reviews
              </a>
              <a href="#alternatives" className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">
                Alternatives
              </a>
              <div className="pt-4 mt-4 border-t border-gray-200">
                <a href="#leave-review" className="block px-4 py-2 rounded-lg text-[#0466E7] hover:bg-[#E8F1FF]">
                  Leave a Review
                </a>
              </div>
            </nav>
          </aside>

          {/* Center Column - Main Content */}
          <main className="flex-1 min-w-0">
            {/* About Section */}
            <section id="about" className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About {product.product_name}</h2>
              <p className="text-gray-600 leading-relaxed">
                {product.product_description || 'No description available.'}
              </p>

              {/* Popular Mentions */}
              {product.popular_mentions && product.popular_mentions.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Popular Mentions</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.popular_mentions.slice(0, 10).map((mention, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {mention}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Features Section */}
            {product.detailed_features && product.detailed_features.length > 0 && (
              <section id="features" className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Features</h2>
                
                {product.detailed_features.map((category, catIdx) => (
                  <div key={catIdx} className="mb-8 last:mb-0">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-[#0466E7]" />
                      {category.name}
                    </h3>
                    <div className="space-y-4">
                      {category.features.map((feature, featIdx) => (
                        <div key={featIdx} className="p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{feature.name}</span>
                            <span className="text-sm text-gray-500">
                              Based on {feature.based_on_number_of_reviews} reviews
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{feature.content}</p>
                          {/* Progress Bar */}
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#0466E7] rounded-full"
                                style={{ width: `${feature.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-[#0466E7]">
                              {feature.percentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Reviews Summary */}
            <section id="reviews" className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Reviews</h2>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900">
                    {product.rating?.toFixed(1) || 'N/A'}
                  </div>
                  <div className="flex justify-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(product.rating || 0)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-500 mt-1">
                    {product.reviews?.toLocaleString() || 0} reviews
                  </p>
                </div>
                
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="w-8 text-sm text-gray-600">{stars}★</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400 rounded-full"
                          style={{ width: `${stars === 5 ? 60 : stars === 4 ? 25 : stars === 3 ? 10 : 3}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Alternatives */}
            {product.alternatives && product.alternatives.length > 0 && (
              <section id="alternatives" className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Top Alternatives</h2>
                <div className="grid grid-cols-3 gap-4">
                  {product.alternatives.slice(0, 6).map((alt, idx) => (
                    <a
                      key={idx}
                      href={alt.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-xl border border-gray-100 hover:border-[#0466E7] hover:shadow-md transition-all group"
                    >
                      <h4 className="font-semibold text-gray-900 group-hover:text-[#0466E7] mb-1">
                        {alt.name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 font-medium">{alt.rating}</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{alt.reviews?.toLocaleString()} reviews</span>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Right Sidebar - Pricing & Media */}
          <aside className="w-[300px] shrink-0">
            {/* Pricing Card */}
            <div className="sticky top-24 space-y-6">
              {product.pricing && product.pricing.length > 0 ? (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Pricing</h3>
                  <div className="space-y-3">
                    {product.pricing.map((plan, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="font-medium text-gray-900">{plan.type}</div>
                        <div className="text-2xl font-bold text-[#0466E7]">{plan.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Get Started</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Contact the vendor for pricing information.
                  </p>
                  <a 
                    href={product.product_link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-[#0466E7] text-white text-center rounded-full font-semibold hover:bg-[#0355c0] transition-colors"
                  >
                    Contact Sales
                  </a>
                </div>
              )}

              {/* Comparisons */}
              {product.comparisons && product.comparisons.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Compare With</h3>
                  <div className="space-y-3">
                    {product.comparisons.slice(0, 3).map((comp, idx) => (
                      <a
                        key={idx}
                        href={comp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {comp.logo && (
                          <img 
                            src={comp.logo}
                            alt={comp.name}
                            className="w-8 h-8 rounded object-contain"
                          />
                        )}
                        <span className="font-medium text-gray-900">{comp.name}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Back to Products */}
      <div className="max-w-[1400px] mx-auto px-8 pb-12">
        <Link 
          href="/products"
          className="inline-flex items-center gap-2 text-[#0466E7] hover:underline font-medium"
        >
          ← Back to All Products
        </Link>
      </div>
    </div>
  )
}
