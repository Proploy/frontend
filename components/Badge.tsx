import Image from 'next/image'

interface BadgeProps {
  text: string
  icon?: string
  className?: string
}

export default function Badge({ text, icon, className = '' }: BadgeProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#BEDAFF] ${className}`}>
      {icon && (
        <Image 
          src={icon} 
          alt="" 
          width={20} 
          height={23}
          className="w-5 h-auto"
        />
      )}
      <span className="text-[#0466E7] font-semibold text-sm font-inter uppercase tracking-wide">
        {text}
      </span>
    </div>
  )
}
