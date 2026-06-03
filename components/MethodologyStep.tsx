import Image from 'next/image'

interface MethodologyStepProps {
  icon: string
  title: string
  description: string
  bulletPoints?: string[]
  imagePosition: 'left' | 'right'
  imageSrc: string
  hasCircleBorder?: boolean
  className?: string
}

export default function MethodologyStep({ 
  icon, 
  title, 
  description, 
  bulletPoints = [],
  imagePosition,
  imageSrc,
  hasCircleBorder = false,
  className = '' 
}: MethodologyStepProps) {
  const content = (
    <div className="flex-1">
      {/* Icon with optional circle border */}
      <div className="mb-6">
        {hasCircleBorder ? (
          <div className="size-20 rounded-full border-[3px] border-[#197CFF] flex items-center justify-center bg-white shadow-sm">
            <Image 
              src={icon} 
              alt={title} 
              width={64} 
              height={64}
              className="size-12 h-12"
            />
          </div>
        ) : (
          <Image 
            src={icon} 
            alt={title} 
            width={64} 
            height={64}
            className="size-16 h-16"
          />
        )}
      </div>

      {/* Title */}
      <h3 className="text-[28px] font-bold text-text-primary font-dm-sans mb-4">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[18px] text-gray-600 font-inter leading-relaxed mb-6">
        {description}
      </p>

      {/* Bullet Points */}
      {bulletPoints.length > 0 && (
        <ul className="space-y-3">
          {bulletPoints.map((point, idx) => (
            <li key={idx} className="text-[16px] text-gray-600 font-inter flex items-start gap-3">
              <span className="text-[#197CFF] mt-1">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  const image = (
    <div className="flex-1">
      <div className="rounded-[24px] overflow-hidden shadow-lg border-4 border-[#197CFF]">
        <Image 
          src={imageSrc} 
          alt={title} 
          width={600} 
          height={400}
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  )

  return (
    <div className={`flex items-center gap-12 ${className}`}>
      {imagePosition === 'left' ? (
        <>
          {image}
          {content}
        </>
      ) : (
        <>
          {content}
          {image}
        </>
      )}
    </div>
  )
}
