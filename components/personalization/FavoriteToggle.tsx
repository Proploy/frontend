'use client'

import { Heart, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { canUsePersonalization, useFavorite } from '@/features/users'
import type { FavoriteTargetType } from '@/features/users'

export default function FavoriteToggle({
  targetId,
  targetType = 'product',
  label,
  className = '',
}: {
  targetId: string
  targetType?: FavoriteTargetType
  label?: string
  className?: string
}) {
  const { user, isLoading: authLoading } = useAuth()
  const favorite = useFavorite(targetId, targetType)
  const productLabel = label ?? 'this item'
  const roleUnavailable = Boolean(user && !canUsePersonalization(user.role))
  const disabled = favorite.isPending || authLoading || roleUnavailable
  return (
    <button
      type="button"
      onClick={() => void favorite.toggle()}
      disabled={disabled}
      aria-pressed={favorite.isFavorite}
      aria-label={favorite.isFavorite ? `Remove ${productLabel} from saved items` : `Save ${productLabel}`}
      title={roleUnavailable ? 'Saving is available to user and expert accounts' : favorite.isFavorite ? 'Remove from saved items' : 'Save to profile'}
      className={`inline-flex h-[40px] items-center justify-center gap-[6px] rounded-[8px] border px-[11px] text-[14px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        favorite.isFavorite
          ? 'border-[#fda4af] bg-[#fff1f2] text-[#be123c] hover:bg-[#ffe4e6]'
          : 'border-[#d5d7da] bg-white text-[#414651] hover:bg-[#fafafa]'
      } ${className}`}
    >
      {favorite.isPending ? <Loader2 size={16} className="animate-spin" /> : <Heart size={16} fill={favorite.isFavorite ? 'currentColor' : 'none'} />}
      <span className="sr-only">{favorite.isFavorite ? 'Saved' : 'Save'}</span>
    </button>
  )
}
