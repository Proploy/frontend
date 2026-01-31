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
import Navbar from '@/components/Navbar'
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

// Random growth percentage for display (simulated)
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
          setLogos(productsData.data.filter((p: Product) => p.product_logo))
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
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-[160px] pb-[100px] px-56 flex flex-col items-center text-center">
        <h1 className="text-[60px] font-bold text-text-primary font-dm-sans leading-[1.1] mb-48">
          Discover, Decide, Deploy, <span className="text-cta-button">Done.</span>
        </h1>
        <p className="text-[20px] text-gray-600 font-dm-sans max-w-[800px] mb-102 leading-[1.5]">
          AI-powered marketplace that matches businesses with the right software solutions and the vetted experts to implement them successfully.
        </p>

        {/* Search Bar */}
        <SearchBar className="mb-20" />

        {/* Ticker Section (80px height) */}
        <div className="w-full h-20 overflow-hidden relative grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all mb-100">
          <div className="flex animate-ticker items-center h-full gap-16 whitespace-nowrap">
            {[...logos, ...logos].map((product, idx) => (
              <div key={idx} className="flex-shrink-0 h-10 w-auto flex items-center">
                {product.product_logo && (
                  <img 
                    src={product.product_logo} 
                    alt={product.product_name} 
                    className="h-full w-auto object-contain"
                  />
                )}
              </div>
            ))}
            {/* Fallback logos if DB is empty */}
            {logos.length === 0 && (
              <div className="flex gap-16 items-center h-full">
                <span className="text-gray-400 font-bold text-xl uppercase tracking-widest">Slack</span>
                <span className="text-gray-400 font-bold text-xl uppercase tracking-widest">Dropbox</span>
                <span className="text-gray-400 font-bold text-xl uppercase tracking-widest">Figma</span>
                <span className="text-gray-400 font-bold text-xl uppercase tracking-widest">Google</span>
                <span className="text-gray-400 font-bold text-xl uppercase tracking-widest">Atlassian</span>
                <span className="text-gray-400 font-bold text-xl uppercase tracking-widest">Zoom</span>
                <span className="text-gray-400 font-bold text-xl uppercase tracking-widest">Shopify</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 1: Why Work With Us */}
      <section className="px-56 pb-[120px]">
        <div className="max-w-[1200px] mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-83">
            <Badge 
              text="Why work with us" 
              icon="/icons/why work with us.svg"
            />
          </div>

          {/* Gradient Heading (2 lines) */}
          <h2 className="text-[48px] font-bold font-dm-sans text-center mb-64 text-gradient-blue max-w-[900px] mx-auto">
            Centralise procurement with<br />complete visibility
          </h2>

          {/* Subheading */}
          <p className="text-[20px] text-gray-600 font-dm-sans text-center mb-64 max-w-[800px] mx-auto">
            Because the right tools aren't enough you need the right experts.
          </p>

          {/* Expandable Cards */}
          <div className="space-y-6">
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
      <section className="px-56 pb-[120px]">
        <div className="max-w-[1200px] mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-83">
            <Badge 
              text="Explore by Category" 
              icon="/icons/explore-category.svg"
            />
          </div>

          {/* Gradient Heading */}
          <h2 className="text-[48px] font-bold font-dm-sans text-center mb-64 text-gradient-blue">
            Software Solutions by Industry
          </h2>

          {/* Subheading with mixed colors */}
          <p className="text-[20px] font-dm-sans text-center mb-64 max-w-[900px] mx-auto">
            <span className="text-[#181D27]">Discover specialised tools tailored to your business needs across </span>
            <span className="text-[#0466E7] font-semibold">5+ major industries.</span>
          </p>

          {/* Category Grid - Dynamic from database */}
          <div className="grid grid-cols-3 gap-6">
            {categories.slice(0, 9).map((category: Category, idx: number) => (
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
      </section>

      {/* Section 3: Our Methodology */}
      <section className="px-56 pb-[120px]">
        <div className="max-w-[1200px] mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-83">
            <Badge 
              text="Our Methodology" 
              icon="/icons/why work with us.svg"
            />
          </div>

          {/* Gradient Heading */}
          <h2 className="text-[48px] font-bold font-dm-sans text-center mb-24 text-gradient-blue">
            How Proploy Works
          </h2>

          {/* Subheading 1 */}
          <p className="text-[20px] font-dm-sans text-center mb-24 text-[#181D27] font-semibold">
            Unlock smarter software decisions, guaranteed
          </p>

          {/* Subheading 2 */}
          <p className="text-[20px] text-gray-600 font-dm-sans text-center mb-64 max-w-[800px] mx-auto">
            Three simple steps to smarter software selection and accelerated deployment.
          </p>

          {/* Methodology Steps - ALL icons now have blue circle borders */}
          <div className="space-y-20">
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
              imageSrc="/uploaded_media_2_1769860593263.png"
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
      <section className="px-56 pb-[120px]">
        <div className="max-w-[1200px] mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-83">
            <Badge 
              text="Our Services" 
              icon="/icons/our services.svg"
            />
          </div>

          {/* Gradient Heading */}
          <h2 className="text-[48px] font-bold font-dm-sans text-center mb-64 text-gradient-blue">
            Integrations
          </h2>

          {/* Subheading */}
          <p className="text-[20px] text-gray-600 font-dm-sans text-center mb-64 max-w-[900px] mx-auto">
            Connect your tools, connect your teams. With over 30+ apps and micro-services already available in our directory, your team's favourite tools are just a click away.
          </p>

          {/* Logo Grid - 2 rows only, clickable logos */}
          <div className="max-w-[1216px] mx-auto mb-12">
            {/* Row 1: First 8 logos */}
            <div className="flex justify-center gap-8 mb-8 h-[80px]">
              {logos.slice(0, 8).map((product, idx) => (
                <Link 
                  key={idx} 
                  href={`/products/${product.product_id}`}
                  className="flex items-center justify-center w-[80px] h-[80px] hover:scale-110 transition-transform cursor-pointer"
                >
                  {product.product_logo && (
                    <img 
                      src={product.product_logo} 
                      alt={product.product_name} 
                      width={80}
                      height={80}
                      className="w-[80px] h-[80px] object-contain"
                    />
                  )}
                </Link>
              ))}
            </div>
            {/* Row 2: Next 8 logos */}
            <div className="flex justify-center gap-8 h-[80px]">
              {logos.slice(8, 16).map((product, idx) => (
                <Link 
                  key={idx} 
                  href={`/products/${product.product_id}`}
                  className="flex items-center justify-center w-[80px] h-[80px] hover:scale-110 transition-transform cursor-pointer"
                >
                  {product.product_logo && (
                    <img 
                      src={product.product_logo} 
                      alt={product.product_name} 
                      width={80}
                      height={80}
                      className="w-[80px] h-[80px] object-contain"
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* View All Button */}
          <div className="flex justify-center">
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
      <section className="px-56 pb-[120px] pt-[150px]">
        <div className="max-w-[1326px] mx-auto">
          <div 
            className="relative rounded-[32px] p-20 overflow-hidden w-[1326px] h-[516px] flex flex-col justify-center"
            style={{
              background: 'linear-gradient(135deg, #C9E0FF 0%, #89BCFF 100%)'
            }}
          >
            {/* Top-right buttons */}
            <div className="absolute top-8 right-8 flex gap-4">
              <button className="px-6 py-3 bg-white text-[#197CFF] font-semibold rounded-full text-[14px] hover:shadow-md transition-all">
                Learn more
              </button>
              <button className="px-6 py-3 bg-[#197CFF] text-white font-semibold rounded-full text-[14px] hover:bg-[#0466E7] transition-all">
                Find Your Expert
              </button>
            </div>

            {/* Content */}
            <div className="max-w-[768px]">
              {/* Heading */}
              <h2 className="text-[48px] font-bold font-dm-sans text-[#011127] mb-8 leading-tight">
                Transform Your Software<br />Procurement Strategy
              </h2>

              {/* Subheading - 735x120 */}
              <p className="text-[20px] text-[#011127]/80 font-inter mb-12 leading-relaxed w-[735px] h-[120px]">
                Join leading enterprises that have modernised their procurement operations and achieved consistent, high-success implementation outcomes. Leverage proven methodologies to reduce project risk and enhance organisational performance.
              </p>

              {/* Email Input Container - 724x68 with internal button */}
              <div className="relative w-[724px] h-[68px]">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="w-full h-full pl-8 pr-[240px] rounded-full bg-white text-[16px] font-inter placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-[224px] h-[52px] bg-[#197CFF] hover:bg-[#0466E7] text-white font-bold rounded-full transition-all duration-300 shadow-lg text-[16px]">
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
