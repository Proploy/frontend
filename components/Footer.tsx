import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="px-56 py-16">
        <div className="max-w-[1200px] mx-auto">
          {/* Top Section - Logo, Tagline, and Social Icons */}
          <div className="flex items-start justify-between mb-12">
            {/* Left: Logo and Tagline */}
            <div className="max-w-[400px]">
              <Link href="/" className="inline-block mb-4">
                <Image 
                  src="/PROPLOY.svg" 
                  alt="Proploy" 
                  width={236} 
                  height={57}
                  className="h-[57px] w-auto object-contain"
                />
              </Link>
              <p className="text-[16px] text-[#6B7280] font-dm-sans leading-relaxed">
                Discover, compare, and connect with the best software solutions for your business.
              </p>
              {/* Social Icons Placeholder */}
              <div className="flex gap-4 mt-6">
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              </div>
            </div>

            {/* Right: Footer Columns */}
            <div className="flex gap-24">
              {/* Product Column */}
              <div>
                <h3 className="text-[14px] font-bold text-text-primary font-dm-sans mb-4 uppercase tracking-wider">Product</h3>
                <ul className="space-y-3">
                  <li><span className="text-[14px] text-[#6B7280] font-inter cursor-not-allowed hover:text-text-primary transition-colors">Explore by Category</span></li>
                  <li><span className="text-[14px] text-[#6B7280] font-inter cursor-not-allowed hover:text-text-primary transition-colors">Explore by Industry</span></li>
                  <li><span className="text-[14px] text-[#6B7280] font-inter cursor-not-allowed hover:text-text-primary transition-colors">Explore Vetted Experts</span></li>
                  <li><span className="text-[14px] text-[#6B7280] font-inter cursor-not-allowed hover:text-text-primary transition-colors">Create a Listing</span></li>
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h3 className="text-[14px] font-bold text-text-primary font-dm-sans mb-4 uppercase tracking-wider">Company</h3>
                <ul className="space-y-3">
                  <li><span className="text-[14px] text-[#6B7280] font-inter cursor-not-allowed hover:text-text-primary transition-colors">About</span></li>
                  <li><span className="text-[14px] text-[#6B7280] font-inter cursor-not-allowed hover:text-text-primary transition-colors">Blog</span></li>
                  <li><span className="text-[14px] text-[#6B7280] font-inter cursor-not-allowed hover:text-text-primary transition-colors">Become an Expert</span></li>
                  <li><span className="text-[14px] text-[#6B7280] font-inter cursor-not-allowed hover:text-text-primary transition-colors">FAQs</span></li>
                </ul>
              </div>

              {/* Legal Column */}
              <div>
                <h3 className="text-[14px] font-bold text-text-primary font-dm-sans mb-4 uppercase tracking-wider">Legal</h3>
                <ul className="space-y-3">
                  <li><span className="text-[14px] text-[#6B7280] font-inter cursor-not-allowed hover:text-text-primary transition-colors">Privacy</span></li>
                  <li><span className="text-[14px] text-[#6B7280] font-inter cursor-not-allowed hover:text-text-primary transition-colors">Terms</span></li>
                  <li><span className="text-[14px] text-[#6B7280] font-inter cursor-not-allowed hover:text-text-primary transition-colors">Cookie Policy</span></li>
                  <li><span className="text-[14px] text-[#6B7280] font-inter cursor-not-allowed hover:text-text-primary transition-colors">Licenses</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="pt-6 border-t border-gray-200 flex justify-between items-center">
            <div className="text-[12px] text-[#9CA3AF] font-inter">
              © 2026 Proploy. All rights reserved.
            </div>
            <div className="flex gap-8">
              <span className="text-[12px] text-[#9CA3AF] font-inter cursor-not-allowed hover:text-text-primary transition-colors">Privacy Policy</span>
              <span className="text-[12px] text-[#9CA3AF] font-inter cursor-not-allowed hover:text-text-primary transition-colors">Terms of Service</span>
              <span className="text-[12px] text-[#9CA3AF] font-inter cursor-not-allowed hover:text-text-primary transition-colors">Cookie Settings</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
