'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Briefcase, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  Shield, 
  MessageSquare,
  Wrench,
  Zap,
  Search
} from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import Badge from '@/components/Badge'
import ExpandableCard from '@/components/ExpandableCard'
import CategoryCard from '@/components/CategoryCard'
import MethodologyStep from '@/components/MethodologyStep'
import Footer from '@/components/Footer'

interface Product {
  product_id: string
  product_name: string
  product_logo: string | null
  product_description?: string
  category?: { name: string; link?: string }
}

interface Category {
  name: string
  count: number
  link?: string
}

// Icon mapping for categories - will be matched dynamically
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase()
  if (name.includes('sales') || name.includes('crm')) return Briefcase
  if (name.includes('marketing')) return ShoppingCart
  if (name.includes('hr') || name.includes('human') || name.includes('hcm')) return Users
  if (name.includes('analytics') || name.includes('data')) return BarChart3
  if (name.includes('support') || name.includes('customer service')) return MessageSquare
  if (name.includes('security') || name.includes('compliance')) return Shield
  if (name.includes('collaboration') || name.includes('work management')) return Users
  if (name.includes('automation') || name.includes('workflow')) return Zap
  if (name.includes('commerce') || name.includes('e-commerce')) return ShoppingCart
  if (name.includes('project') || name.includes('management')) return BarChart3
  if (name.includes('erp')) return Briefcase
  if (name.includes('ipaas')) return Zap
  return Wrench // Default icon
}

// Description mapping for categories
const getCategoryDescription = (categoryName: string): string => {
  const name = categoryName.toLowerCase()
  if (name.includes('crm') || name.includes('sales')) return 'Customer relationship management and sales automation tools'
  if (name.includes('marketing')) return 'Email marketing, campaign management, and lead nurturing'
  if (name.includes('project') || name.includes('management')) return 'Task tracking, team collaboration, and workflow optimisation'
  if (name.includes('analytics') || name.includes('business intelligence')) return 'Business intelligence, data visualisation, and reporting'
  if (name.includes('accounting') || name.includes('finance')) return 'Financial management, invoicing, and expense tracking'
  if (name.includes('hr') || name.includes('recruitment') || name.includes('hcm')) return 'Human resources, payroll, and talent management'
  if (name.includes('support') || name.includes('customer service')) return 'Help desk, live chat, and customer service platforms'
  if (name.includes('collaboration')) return 'Team communication, file sharing, and remote work software'
  if (name.includes('security') || name.includes('compliance')) return 'Cybersecurity, data protection, and compliance management'
  if (name.includes('erp')) return 'Enterprise resource planning and business process management'
  if (name.includes('ipaas')) return 'Integration platform as a service for connecting applications'
  if (name.includes('e-commerce') || name.includes('commerce')) return 'Online selling platforms and e-commerce management tools'
  return 'Discover the best software solutions for your business needs'
}

// Random growth percentage for display (simulated) will build the logic for this when we have adequate data 
const getGrowthPercent = (categoryName: string): number => {
  // Generate a consistent "random" number based on category name
  const hash = categoryName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return 15 + (hash % 30) // Returns between 15% and 44%
}

export default function LandingPage() {
  const [logos, setLogos] = useState<Product[]>([])
  const [expandedCard, setExpandedCard] = useState<number>(0) // First card expanded by default
  const [categories, setCategories] = useState<Category[]>([])
  const [showAllLogos, setShowAllLogos] = useState<boolean>(false)

  // Fetch logos for the ticker and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all 25 products
        const productsRes = await fetch('/api/products?limit=25')
        const productsData = await productsRes.json()
        if (productsData && productsData.data) {
          const filteredLogos = productsData.data.filter((p: Product) => p.product_logo)
          // Shuffle logos for random order
          const shuffled = [...filteredLogos].sort(() => Math.random() - 0.5)
          setLogos(shuffled)
        }

        // Fetch categories with counts
        const categoriesRes = await fetch('/api/categories')
        const categoriesData = await categoriesRes.json()
        if (categoriesData && categoriesData.data) {
          setCategories(categoriesData.data)
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-[#F4F8FD] font-inter">
      {/* Hero Section */}
      <section className="pt-32 md:pt-[140px] pb-16 md:pb-[80px] px-4 md:px-56 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-[60px] font-bold text-text-primary font-dm-sans leading-tight mb-6 md:mb-12">
          Discover, Decide, Deploy, <span className="text-cta-button">Done.</span>
        </h1>
        <p className="text-lg md:text-[20px] text-gray-600 font-dm-sans max-w-[800px] mb-8 md:mb-12 leading-relaxed">
          AI-powered marketplace that matches businesses with the right software solutions and the vetted experts to implement them successfully.
        </p>

        {/* Search Bar */}
        <div className="w-full flex justify-center mb-12 md:mb-20">
          <SearchBar className="w-full" />
        </div>

        {/* Ticker Section (80px height) */}
        <div className="w-full h-16 md:h-20 overflow-hidden relative opacity-50 mb-12 md:mb-16">
          <div className="flex animate-ticker items-center h-full gap-2.5 whitespace-nowrap">
            {[...logos, ...logos].map((product, idx) => (
              <div key={idx} className="flex-shrink-0 h-6 md:h-10 w-auto flex items-center px-[10px]">
                {product.product_logo && (
                  <img 
                    src={product.product_logo} 
                    alt={product.product_name} 
                    className="h-full w-auto object-contain"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 1: Why Work With Us */}
      <section className="px-4 md:px-56 pb-16 md:pb-[80px]">
        <div className="max-w-[1200px] mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <Badge 
              text="Why work with us" 
              icon="/icons/why work with us.svg"
            />
          </div>

          {/* Gradient Heading */}
          <h2 className="text-3xl md:text-[48px] font-bold font-dm-sans text-center mb-6 md:mb-10 text-gradient-blue max-w-[900px] mx-auto leading-tight">
            Centralise procurement with complete visibility
          </h2>

          {/* Subheading */}
          <p className="text-lg md:text-[20px] text-gray-600 font-dm-sans text-center mb-8 md:mb-12 max-w-[800px] mx-auto">
            Because the right tools aren't enough you need the right experts.
          </p>

          {/* Expandable Cards */}
          <div className="space-y-4 md:space-y-6">
            <ExpandableCard 
              number="1"
              title="Improve Implementation Success Assurance"
              description="Accelerate vendor evaluation by eliminating lengthy RFP cycles and manual comparisons. Gain immediate access to pre-qualified solutions matched to your operational needs."
              isExpanded={expandedCard === 0}
              onToggle={() => setExpandedCard(0)}
            />
            <ExpandableCard 
              number="2"
              title="Maximise Return on Technology Investments"
              description="Optimize your technology spend with expert guidance on vendor selection, contract negotiation, and implementation planning."
              isExpanded={expandedCard === 1}
              onToggle={() => setExpandedCard(1)}
            />
            <ExpandableCard 
              number="3"
              title="Strengthen Cost Control Measures"
              description="Implement robust cost control frameworks with real-time visibility into procurement spend and vendor performance metrics."
              isExpanded={expandedCard === 2}
              onToggle={() => setExpandedCard(2)}
            />
          </div>
        </div>
      </section>

      {/* Section 2: Explore by Category */}
      <section className="px-4 md:px-56 pb-16 md:pb-[80px]">
        <div className="max-w-[1200px] mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <Badge 
              text="Explore by Category" 
              icon="/icons/explore-category.svg"
            />
          </div>

          {/* Gradient Heading */}
          <h2 className="text-3xl md:text-[48px] font-bold font-dm-sans text-center mb-6 md:mb-10 text-gradient-blue leading-tight">
            Software Solutions by Industry
          </h2>

          {/* Subheading with mixed colors */}
          <p className="text-lg md:text-[20px] font-dm-sans text-center mb-10 md:mb-12 max-w-[900px] mx-auto">
            <span className="text-[#181D27]">Discover specialised tools tailored to your business needs across </span>
            <span className="text-[#0466E7] font-semibold">5+ major industries.</span>
          </p>

          {/* Category Grid - Dynamic from database */}
          <div className="relative">
            {/* Centered Gradient Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[600px] h-[300px] md:h-[600px] bg-blue-400 opacity-[0.08] blur-[100px] rounded-full -z-10 pointer-events-none" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 relative z-10">
              {categories
                .filter(c => c.name !== "E-Commerce Platforms")
                .slice(0, 9)
                .map((category: Category, idx: number) => (
                  <CategoryCard 
                    key={category.name}
                    name={category.name}
                    description={getCategoryDescription(category.name)}
                    icon={getCategoryIcon(category.name)}
                    slug={category.name.toLowerCase().replace(/\s+/g, '-')}
                    growthPercent={getGrowthPercent(category.name)}
                  />
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Our Methodology */}
      <section className="px-4 md:px-56 pb-16 md:pb-[80px]">
        <div className="max-w-[1200px] mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <Badge 
              text="Our Methodology" 
              icon="/icons/why work with us.svg"
            />
          </div>

          {/* Gradient Heading */}
          <h2 className="text-3xl md:text-[48px] font-bold font-dm-sans text-center mb-6 md:mb-24 text-gradient-blue leading-tight">
            How Proploy Works
          </h2>

          {/* Subheading 1 */}
          <p className="text-lg md:text-[20px] font-dm-sans text-center mb-4 md:mb-24 text-[#181D27] font-semibold leading-relaxed">
            Unlock smarter software decisions, guaranteed
          </p>

          {/* Subheading 2 */}
          <p className="text-base md:text-[20px] text-gray-600 font-dm-sans text-center mb-10 md:mb-12 max-w-[800px] mx-auto">
            Three simple steps to smarter software selection and accelerated deployment.
          </p>

          {/* Methodology Steps */}
          <div className="space-y-12 md:space-y-20">
            <MethodologyStep 
              icon="/icons/discover.svg"
              title="Discover"
              description="Proploy's AI analyses your unique business requirements and curates a marketplace of perfectly tailored software solutions."
              bulletPoints={[
                "Define needs using natural language input",
                "Validate choices with real-world performance data",
                "Access objective, unbiased recommendations"
              ]}
              imagePosition="right"
              imageSrc="/uploaded_media_2_1769860593263.png" //replace with something intutive with effective 
              hasCircleBorder={true}
            />
            <MethodologyStep 
              icon="/icons/discover.svg"
              title="Decide"
              description="Simplify your procurement process with pre-negotiated enterprise pricing, 100% transparency, and strategic vendor partnerships."
              bulletPoints={[
                "Benefit from pre-negotiated enterprise pricing",
                "Achieve full clarity with transparent, itemized costs",
                "Leverage exclusive strategic vendor partnerships"
              ]}
              imagePosition="left"
              imageSrc="/uploaded_media_2_1769860593263.png"
              hasCircleBorder={true}
            />
            <MethodologyStep 
              icon="/icons/deploy.svg"
              title="Deploy"
              description="Instantly match with vetted specialists and gain dedicated project management to ensure seamless execution and guaranteed success."
              bulletPoints={[
                "Filter, export, and drilldown on the data quickly",
                "Save, schedule, and automate reports to your inbox",
                "Connect the tools you already use with 100+ integrations"
              ]}
              imagePosition="right"
              imageSrc="/uploaded_media_2_1769860593263.png"
              hasCircleBorder={true}
            />
          </div>
        </div>
      </section>

      {/* Section 4: Our Services (Integrations) */}
      <section className="px-4 md:px-56 pb-16 md:pb-[80px]">
        <div className="max-w-[1200px] mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <Badge 
              text="Our Services" 
              icon="/icons/our services.svg"
            />
          </div>

          {/* Gradient Heading */}
          <h2 className="text-3xl md:text-[48px] font-bold font-dm-sans text-center mb-6 md:mb-10 text-gradient-blue leading-tight">
            Integrations
          </h2>

          {/* Subheading */}
          <p className="text-lg md:text-[20px] text-gray-600 font-dm-sans text-center mb-10 md:mb-12 max-w-[900px] mx-auto">
            Connect your tools, connect your teams. With over 30+ apps and micro-services already available in our directory, your team's favourite tools are just a click away.
          </p>

          {/* Logo Grid - Clickable logos */}
          <div className="max-w-[1216px] mx-auto mb-12 overflow-x-auto pb-4 md:overflow-visible">
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 min-w-fit px-4">
              {logos.slice(0, 16).map((product, idx) => (
                <Link 
                  key={idx} 
                  href={`/products/${product.product_id}`}
                  className="flex items-center justify-center w-[60px] h-[60px] md:w-[80px] md:h-[80px] hover:scale-110 transition-transform cursor-pointer"
                >
                  {product.product_logo && (
                    <img 
                      src={product.product_logo} 
                      alt={product.product_name} 
                      className="w-full h-full object-contain"
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* View All Button */}
          <div className="flex justify-center mt-8">
            <Link
              href="/products"
              className="px-8 py-4 bg-[#197CFF] hover:bg-[#0466E7] text-white font-bold rounded-full transition-all duration-300 shadow-lg text-[16px]"
            >
              View All Integrations
            </Link>
          </div>
        </div>
      </section>

      {/* Section 5: CTA Section - Transform Your Strategy */}
      <section className="px-4 md:px-56 pb-16 md:pb-[80px] pt-12 md:pt-[100px]">
        <div className="max-w-[1326px] mx-auto">
          <div 
            className="relative rounded-[24px] md:rounded-[32px] p-6 md:p-20 overflow-hidden w-full min-h-[400px] md:h-[516px] flex flex-col justify-center"
            style={{
              background: 'linear-gradient(135deg, #C9E0FF 0%, #89BCFF 100%)'
            }}
          >
            {/* Top-right buttons - Inline stack on mobile, absolute on desktop */}
            <div className="relative md:absolute md:top-8 md:right-8 flex flex-row md:flex-row gap-3 md:gap-4 mb-8 md:mb-0">
              <button className="flex-1 md:flex-none px-4 md:px-6 py-3 bg-white text-[#197CFF] font-semibold rounded-full text-[12px] md:text-[14px] hover:shadow-md transition-all">
                Learn more
              </button>
              <button className="flex-1 md:flex-none px-4 md:px-6 py-3 bg-[#197CFF] text-white font-semibold rounded-full text-[12px] md:text-[14px] hover:bg-[#0466E7] transition-all">
                Find Your Expert
              </button>
            </div>

            {/* Content */}
            <div className="max-w-[768px] mt-24 md:mt-0">
              {/* Heading */}
              <h2 className="text-3xl md:text-[48px] font-bold font-dm-sans text-[#011127] mb-6 md:mb-8 leading-tight">
                Transform Your Strategy
              </h2>

              {/* Subheading */}
              <p className="text-base md:text-[20px] text-[#011127]/80 font-inter mb-8 md:mb-12 leading-relaxed md:w-[735px]">
                Join leading enterprises that have modernised their procurement operations and achieved consistent, high-success implementation outcomes. Leverage proven methodologies to reduce project risk and enhance organisational performance.
              </p>

              {/* Email Input Container - Responsive width & mobile stacking */}
              <div className="relative w-full md:w-[724px] flex flex-col md:block">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="w-full h-[56px] md:h-[68px] pl-6 md:pl-8 pr-6 md:pr-[240px] rounded-2xl md:rounded-full bg-white text-[14px] md:text-[16px] font-inter placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all border border-blue-100"
                />
                <button className="mt-3 md:mt-0 md:absolute md:right-1.5 md:top-1/2 md:-translate-y-1/2 w-full md:w-[224px] h-[52px] md:h-[52px] bg-[#197CFF] hover:bg-[#0466E7] text-white font-bold rounded-2xl md:rounded-full transition-all duration-300 shadow-lg text-[14px] md:text-[16px]">
                  Write to Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          display: flex;
          width: fit-content;
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
