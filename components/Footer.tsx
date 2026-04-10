import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="px-4 md:px-56 py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto">
          {/* Top Section - Logo, Tagline, and Social Icons */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between mb-12 text-center lg:text-left">
            {/* Left: Logo and Tagline */}
            <div className="max-w-[400px] mb-12 lg:mb-0">
              <Link href="/" className="inline-block mb-4">
                <Image 
                  src="/PROPLOY.svg" 
                  alt="Proploy" 
                  width={236} 
                  height={57}
                  className="h-[48px] md:h-[57px] w-auto object-contain mx-auto lg:mx-0"
                />
              </Link>
              <p className="text-[14px] md:text-[16px] text-[#6B7280] font-dm-sans leading-relaxed">
                Discover, compare, and connect with the best software solutions for your business.
              </p>
              {/* Social Icons */}
              <div className="flex justify-center lg:justify-start gap-4 mt-6">
                <a 
                  href="https://www.linkedin.com/company/proploy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#197CFF] flex items-center justify-center text-white hover:bg-[#0466E7] transition-all transform hover:scale-110 shadow-sm"
                  aria-label="LinkedIn"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Right: Footer Columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-24 text-left">
              {/* Product Column */}
              <div>
                <h3 className="text-[12px] md:text-[14px] font-bold text-text-primary font-dm-sans mb-4 uppercase tracking-wider">Product</h3>
                <ul className="space-y-3">
                  <li><span className="text-[13px] md:text-[14px] text-[#6B7280] font-inter cursor-not-allowed hover:text-text-primary transition-colors">Explore Categories</span></li>
                  <li><span className="text-[13px] md:text-[14px] text-[#6B7280] font-inter cursor-not-allowed hover:text-text-primary transition-colors">Vetted Experts</span></li>
                  <li><span className="text-[13px] md:text-[14px] text-[#6B7280] font-inter cursor-not-allowed hover:text-text-primary transition-colors">Create Listing</span></li>
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h3 className="text-[12px] md:text-[14px] font-bold text-text-primary font-dm-sans mb-4 uppercase tracking-wider">Company</h3>
                <ul className="space-y-3">
                  <li><span className="text-[13px] md:text-[14px] text-[#6B7280] font-inter cursor-not-allowed hover:text-text-primary transition-colors">About</span></li>
                  <li><span className="text-[13px] md:text-[14px] text-[#6B7280] font-inter cursor-not-allowed hover:text-text-primary transition-colors">Blog</span></li>
                  <li><span className="text-[13px] md:text-[14px] text-[#6B7280] font-inter cursor-not-allowed hover:text-text-primary transition-colors">FAQs</span></li>
                </ul>
              </div>

              {/* Legal Column */}
              <div className="col-span-2 md:col-span-1">
                <h3 className="text-[12px] md:text-[14px] font-bold text-text-primary font-dm-sans mb-4 uppercase tracking-wider">Legal</h3>
                <ul className="space-y-3">
                  <li><span className="text-[13px] md:text-[14px] text-[#6B7280] font-inter cursor-not-allowed hover:text-text-primary transition-colors">Privacy</span></li>
                  <li><span className="text-[13px] md:text-[14px] text-[#6B7280] font-inter cursor-not-allowed hover:text-text-primary transition-colors">Terms</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[12px] text-[#9CA3AF] font-inter order-2 md:order-1">
              © 2026 Proploy. All rights reserved.
            </div>
            <div className="flex gap-4 md:gap-8 order-1 md:order-2">
              <span className="text-[11px] md:text-[12px] text-[#9CA3AF] font-inter cursor-not-allowed">Privacy Policy</span>
              <span className="text-[11px] md:text-[12px] text-[#9CA3AF] font-inter cursor-not-allowed">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
