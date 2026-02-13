'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ExternalLink, Share2, ChevronRight, MessageSquare, Users, Zap, BarChart3, X, Maximize2, PlayCircle, CheckCircle2 } from 'lucide-react'
import { notFound, useParams } from 'next/navigation'
import ExpertsCallout from '@/components/ExpertsCallout'

// Product interface based on database schema
interface PricingPlan {
  plan_name: string
  plan_price: string
  plan_description: string
  features?: string[]
}

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
  pricing_plans?: PricingPlan[]
  screenshots?: string[]
  videos?: string[]
  popular_mentions?: string[]
  product_link?: string
}

const formatYouTubeEmbed = (url: string) => {
  if (!url) return ''
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) 
    ? `https://www.youtube.com/embed/${match[2]}`
    : url
}

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showAllIntegrations, setShowAllIntegrations] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${id}`)
        if (response.ok) {
          const result = await response.json()
          setProduct(result.data)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0466E7]"></div>
    </div>
  )

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 lg:pt-36 font-inter">
      {/* Media Modal/Lightbox */}
      {selectedMedia && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 lg:p-10">
          <button 
            onClick={() => setSelectedMedia(null)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="w-full max-w-[1200px] aspect-video flex items-center justify-center">
            {selectedMedia.type === 'video' ? (
              <iframe
                src={formatYouTubeEmbed(selectedMedia.url)}
                className="w-full h-full rounded-2xl shadow-2xl"
                allowFullScreen
                allow="autoplay"
              />
            ) : (
              <img 
                src={selectedMedia.url} 
                alt="Product screenshot" 
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              />
            )}
          </div>
        </div>
      )}

      {/* Hero Container */}
      <div className="max-w-[1454px] mx-auto px-8">
        
        {/* Full-width Product Banner */}
        <div className="w-full h-[363px] rounded-[32px] overflow-hidden shadow-sm mb-12 border border-gray-100 relative bg-white flex items-center justify-center">
          {product.screenshots && product.screenshots.length > 0 ? (
            <img 
              src={product.screenshots[0]} 
              alt={`${product.product_name} banner`}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0466E7] to-[#0355c0] flex items-center justify-center">
              <span className="text-white text-4xl font-bold opacity-20">{product.product_name}</span>
            </div>
          )}
        </div>

        {/* Product Information Header (Below Banner) */}
        <div className="flex gap-8 items-start mb-12">
             {/* Product Logo Large */}
             <div className="w-32 h-32 rounded-3xl bg-white shadow-md flex items-center justify-center overflow-hidden border border-gray-100 relative z-10 shrink-0">
                {product.product_logo ? (
                  <img 
                    src={product.product_logo}
                    alt={product.product_name}
                    className="w-24 h-24 object-contain"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold">
                    {product.product_name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-[40px] font-extrabold font-dm-sans leading-tight mb-2 text-gradient-blue">
                  {product.product_name}
                </h1>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(product.rating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-200 fill-gray-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
        </div>

        {/* Main 3-Column Columns */}
        <div className="flex gap-10">
          
          {/* Column 1: Navigation / TOC */}
          <aside className="w-[200px] shrink-0">
            <nav className="sticky top-28 space-y-4">
              <a href="#about" className="block text-[14px] font-bold text-[#0466E7] border-l-2 border-[#0466E7] pl-4 transition-all">
                Product Information
              </a>
              <a href="#reviews" className="block text-[14px] font-bold text-gray-400 hover:text-gray-600 pl-4 border-l-2 border-transparent transition-all">
                Reviews
              </a>
              <a href="#features" className="block text-[14px] font-bold text-gray-400 hover:text-gray-600 pl-4 border-l-2 border-transparent transition-all">
                Features
              </a>
              <a href="#vetted" className="block text-[14px] font-bold text-gray-400 hover:text-gray-600 pl-4 border-l-2 border-transparent transition-all">
                Vetted Expert Implementation
              </a>
              <div className="pt-4 border-t border-gray-100 mt-6">
                 <Link href="#leave-review" className="text-[14px] font-bold text-[#197CFF] hover:underline">
                  Leave a Review
                </Link>
              </div>
            </nav>
          </aside>

          {/* Column 2: Main Details & Sections */}
          <main className="flex-1 space-y-8 pb-20">
            
            {/* Section: Product Details */}
            <div id="about" className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 relative">
               <div className="flex justify-between items-start mb-8">
                  <h2 className="text-[20px] font-extrabold text-[#011127]">
                    {product.product_name} Reviews & Product Details
                  </h2>
                  {product.product_link && (
                    <div className="flex items-center gap-2">
                       <a href={product.product_link} target="_blank" className="text-[#197CFF] text-[13px] font-bold hover:underline flex items-center gap-1">
                        Visit Website
                        <Share2 className="w-3 h-3 ml-1" />
                       </a>
                    </div>
                  )}
               </div>

               <div className={`space-y-6 text-[#181D27] text-[16px] leading-[1.6] ${!showFullDescription ? 'max-h-[160px] overflow-hidden' : ''}`}>
                  {product.product_description?.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  )) || 'No description available.'}
               </div>

               <div className="mt-12 space-y-8">
                  {showFullDescription && (
                    <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-top-4">
                      <div>
                        <h4 className="text-[12px] font-bold text-[#667085] uppercase tracking-widest mb-2 font-dm-sans">Product Website</h4>
                        <a href={product.product_link || '#'} className="text-[#0466E7] font-bold text-[15px] hover:underline">
                          {product.product_name}
                        </a>
                      </div>
                      <div>
                        <h4 className="text-[12px] font-bold text-[#667085] uppercase tracking-widest mb-2 font-dm-sans">Seller</h4>
                        <div className="text-[#0466E7] font-bold text-[15px] cursor-pointer hover:underline">
                          {product.product_name}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[12px] font-bold text-[#667085] uppercase tracking-widest mb-2 font-dm-sans">Discussions</h4>
                        <div className="text-[#0466E7] font-bold text-[15px] cursor-pointer hover:underline">
                          {product.product_name} Community
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[12px] font-bold text-[#667085] uppercase tracking-widest mb-2 font-dm-sans">Languages Supported</h4>
                        <p className="text-[#181D27] text-[14px]">
                          German, English, French, Italian, Japanese, Korean, Dutch, Polish, Portuguese, Russian, Spanish, Swedish, Turkish, Chinese (Traditional)
                        </p>
                      </div>
                    </div>
                  )}
                  <button 
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-[#197CFF] font-bold text-[14px] flex items-center gap-1 mt-4"
                  >
                    {showFullDescription ? 'Show Less' : 'Show More'} 
                    <ChevronRight className={`w-4 h-4 transition-transform ${showFullDescription ? 'rotate-[-90deg]' : 'rotate-90'}`} />
                  </button>
               </div>
            </div>

            {/* Section: Reviews */}
            <div id="reviews" className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
               <h3 className="text-[18px] font-extrabold text-[#011127] mb-8">{product.product_name} Reviews <span className="text-gray-400 font-medium">({product.reviews?.toLocaleString()})</span></h3>
               
               <div className="flex gap-12 items-center mb-6">
                  <div className="bg-[#F8F9FA] rounded-2xl p-10 flex flex-col items-center justify-center min-w-[200px] shadow-sm border border-gray-50">
                    <div className="text-[54px] font-black text-[#011127] leading-none mb-4">{product.rating?.toFixed(1) || '4.0'}</div>
                    <div className="flex gap-1 mb-2">
                      {[1,2,3,4,5].map((s) => <Star key={s} className="w-6 h-6 text-[#FFB800] fill-[#FFB800]" />)}
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 pt-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-4">
                        <div className="flex gap-1 w-28">
                          {[1,2,3,4,5].map((s) => (
                            <Star key={s} className={`w-4 h-4 ${s <= stars ? 'text-[#FFB800] fill-[#FFB800]' : 'text-gray-200 fill-gray-100'}`} />
                          ))}
                        </div>
                        <div className="flex-1 h-2 bg-[#F2F4F7] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#197CFF] rounded-full" 
                            style={{ width: `${stars === 5 ? 85 : stars === 4 ? 12 : 3}%` }}
                          />
                        </div>
                        <div className="text-[13px] font-bold text-gray-400 w-16 text-end">{(stars === 5 ? 8652 : stars === 4 ? 4120 : 156).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Section: Features */}
            <div id="features" className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
               <h3 className="text-[18px] font-extrabold text-[#011127] mb-8">{product.product_name} Features</h3>
               <div className="grid grid-cols-3 gap-6">
                 {[
                   { title: 'Tasks', features: ['Creation & Assignment', 'Due Dates', 'Task Prioritisation'] },
                   { title: 'Projects', features: ['Planning', 'Views', 'Gantt Charts'] },
                   { title: 'Customisable', features: ['Drag & Drop', 'Widgets', 'Filtering'] }
                 ].map((cat, i) => (
                   <div key={i} className="p-6 bg-[#F8F9FA] rounded-2xl border border-gray-50">
                      <h4 className="text-[14px] font-bold text-[#011127] mb-4">{cat.title}</h4>
                      <ul className="space-y-3">
                        {cat.features.map((f, fi) => (
                          <li key={fi} className="flex items-center gap-2 text-[13px] text-[#4B515D]">
                            <svg className="w-4 h-4 text-[#12B76A]" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                   </div>
                 ))}
               </div>
            </div>

            {/* Section: Vetted Expert Implementation */}
            <div id="vetted" className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#197CFF] opacity-[0.02] rounded-full translate-x-1/2 -translate-y-1/2" />
               
               <div className="relative">
                 <h3 className="text-[18px] font-extrabold text-[#011127] mb-8">Vetted Expert Implementation</h3>
                 
                 <div className="grid grid-cols-2 gap-12">
                   <div className="space-y-6">
                     <p className="text-[#4B515D] text-[15px] leading-relaxed">
                       Don't let implementation hurdles slow you down. Our vetted experts have a proven track record of successful deployment and operational excellence.
                     </p>
                     <ul className="space-y-4">
                       {[
                         'Average setup time: 2-3 weeks',
                         'Custom workflow automation',
                         'Team training & onboarding',
                         'Post-implementation support'
                       ].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-[14px] text-[#181D27] font-medium">
                           <CheckCircle2 className="w-5 h-5 text-[#12B76A]" />
                           {item}
                         </li>
                       ))}
                     </ul>
                   </div>
                   
                   <div className="bg-[#F8F9FA] rounded-3xl p-8 border border-gray-50 flex flex-col justify-center items-center text-center">
                     <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                       <Users className="w-8 h-8 text-[#197CFF]" />
                     </div>
                     <h4 className="text-[16px] font-bold text-[#011127] mb-2">Ready to scale?</h4>
                     <p className="text-[13px] text-gray-500 mb-6 px-4">
                       Connect with an expert who understands your industry and goals.
                     </p>
                     <Link 
                       href="/experts"
                       className="px-8 py-3 bg-[#197CFF] text-white rounded-full font-bold text-[14px] hover:bg-[#0466E7] transition-all shadow-md"
                     >
                       Talk to an Expert
                     </Link>
                   </div>
                 </div>
               </div>
            </div>

          </main>

          {/* Column 3: Pricing & Media Sidebar */}
          <aside className="w-[360px] shrink-0">
             <div className="sticky top-28 space-y-8">
                
                {/* Pricing Section */}
                <div className="bg-white rounded-[32px] p-8 shadow-md border border-gray-100">
                  <h3 className="text-[18px] font-extrabold text-[#011127] mb-[20px]">Pricing</h3>
                  <p className="text-[11px] text-gray-400 mb-6 font-bold uppercase tracking-wider">Provided by {product.product_name}</p>
                  
                  <div className="space-y-4">
                    {product.pricing_plans && product.pricing_plans.length > 0 ? (
                      product.pricing_plans.map((plan, idx) => (
                        <div key={idx} className="p-6 rounded-2xl bg-[#F8F9FA] border border-gray-50 hover:border-[#197CFF10] transition-colors group">
                           <div className="text-[14px] font-bold text-[#667085] mb-2">{plan.plan_name}</div>
                           <div className="text-[28px] font-black text-[#011127] mb-1">
                             {plan.plan_price === "Contact Us" ? "Contact Us" : plan.plan_price}
                           </div>
                           <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0">
                             {plan.plan_price === "Contact Us" ? "Custom Quote" : "Per Month or Annually"}
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center rounded-2xl border-2 border-dashed border-gray-100">
                        <p className="text-[12px] text-gray-400 mb-4">Contact for pricing</p>
                        <a href={product.product_link || '#'} className="block w-full py-4 bg-[#0466E7] text-white rounded-full font-bold text-[14px]">
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Media Section (Now in Sidebar!) */}
                <div className="bg-white rounded-[32px] p-8 shadow-md border border-gray-100">
                   <h3 className="text-[16px] font-extrabold text-[#011127] mb-6">{product.product_name} Media</h3>
                   <div className="space-y-4">
                      {/* Main Featured Media */}
                      <div 
                        className="w-full aspect-video rounded-2xl bg-black overflow-hidden relative group cursor-pointer shadow-sm"
                        onClick={() => setSelectedMedia({ url: product.screenshots?.[1] || product.screenshots?.[0] || '', type: 'image' })}
                      >
                         <img 
                          src={product.screenshots?.[1] || product.screenshots?.[0] || ''} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          alt="featured" 
                         />
                         <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all flex items-center justify-center">
                            <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all" />
                         </div>
                      </div>
                      
                      {/* Thumbnail Strip */}
                      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
                         {/* Video Thumb first */}
                         {product.videos?.slice(0, 1).map((v, i) => (
                           <div 
                            key={`v-${i}`} 
                            className="w-20 h-14 rounded-lg bg-black shrink-0 relative cursor-pointer"
                            onClick={() => setSelectedMedia({ url: v, type: 'video' })}
                           >
                             <img src={`https://img.youtube.com/vi/${(v.split('embed/')[1] || '').split('?')[0]}/hqdefault.jpg`} className="w-full h-full object-cover opacity-50 rounded-lg" alt="video" />
                             <PlayCircle className="w-6 h-6 text-white absolute inset-0 m-auto opacity-80" />
                           </div>
                         ))}
                         {product.screenshots?.slice(1, 4).map((ss, i) => (
                           <div 
                            key={`s-${i}`} 
                            className="w-20 h-14 rounded-lg bg-gray-100 shrink-0 cursor-pointer overflow-hidden"
                            onClick={() => setSelectedMedia({ url: ss, type: 'image' })}
                           >
                             <img src={ss} className="w-full h-full object-cover hover:scale-110 transition-transform" alt="thumb" />
                           </div>
                         ))}
                         <div className="w-10 h-14 rounded-lg bg-[#E8F1FF] shrink-0 flex items-center justify-center cursor-pointer">
                            <ChevronRight className="w-4 h-4 text-[#197CFF]" />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Experts Callout */}
                <ExpertsCallout />

             </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
