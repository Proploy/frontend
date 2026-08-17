import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

interface ExpertsCalloutProps {
  className?: string
}

export default function ExpertsCallout({ className = '' }: ExpertsCalloutProps) {
  return (
    <div className={`bg-white rounded-[32px] p-8 shadow-md border border-gray-100 overflow-hidden relative group ${className}`}>
      {/* Background Decorative Element */}
      <div className="absolute -top-24 -right-24 size-48 bg-[#197CFF] opacity-[0.03] rounded-full group-hover:scale-110 transition-transform duration-700" />
      
      <h3 className="text-[18px] font-extrabold text-[#011127] mb-6 relative">Find Vetted Experts</h3>
      
      <p className="text-[14px] text-gray-600 mb-8 leading-relaxed">
        Get matched with certified specialists to ensure your software implementation is a success.
      </p>
      
      <ul className="space-y-4 mb-8">
        {[
          'Certified Professionals',
          'Industry Specific Experts',
          'Guaranteed Implementation'
        ].map((item, idx) => (
          <li key={item} className="flex items-center gap-3 text-[13px] font-medium text-[#181D27]">
            <CheckCircle2 className="size-5 text-[#12B76A]" />
            {item}
          </li>
        ))}
      </ul>
      
      <Link 
        href="/experts"
        className="block w-full py-4 bg-[#197CFF] hover:bg-[#0466E7] text-white rounded-full font-bold text-[14px] text-center transition-all duration-300 shadow-lg shadow-blue-200"
      >
        Find Your Expert
      </Link>
    </div>
  )
}
