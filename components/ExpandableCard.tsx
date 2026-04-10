'use client'

interface ExpandableCardProps {
  number: string
  title: string
  description: string
  isExpanded: boolean
  onToggle: () => void
  className?: string
}

export default function ExpandableCard({ 
  number, 
  title, 
  description, 
  isExpanded,
  onToggle,
  className = '' 
}: ExpandableCardProps) {
  return (
    <div 
      className={`relative rounded-[24px] p-8 transition-all duration-300 cursor-pointer ${
        isExpanded ? 'bg-[#C9E0FF]' : 'bg-white'
      } ${className}`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-6">
        {/* Number */}
        <div className={`text-[80px] font-bold font-dm-sans leading-none transition-colors ${
          isExpanded ? 'text-[#0466E7]' : 'text-gray-200'
        }`}>
          {number}
        </div>

        {/* Content */}
        <div className="flex-1 pt-2">
          <h3 className="text-[24px] font-bold text-text-primary font-dm-sans mb-4">
            {title}
          </h3>
          
          {isExpanded && (
            <p className="text-[16px] text-gray-600 font-inter leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
