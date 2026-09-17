'use client'

import { BadgeCheck } from 'lucide-react'
import { Avatar, type AvatarSize } from '@/components/ui/Avatar'

/**
 * A chat participant's avatar: the app-wide `Avatar` plus the presence dot and
 * verified badge this surface needs. Kept next to the chat primitives so both
 * inboxes mark presence the same way.
 */
export function ChatAvatar({
  name,
  size = 'md',
  online,
  verified,
}: {
  name: string
  size?: AvatarSize
  online?: boolean
  verified?: boolean
}) {
  return (
    <span className="relative inline-flex shrink-0">
      <Avatar name={name} size={size} />
      {verified && (
        <BadgeCheck
          size={16}
          className="absolute -bottom-[1px] -right-[1px] fill-cobalt text-cobalt [&>path]:stroke-white"
        />
      )}
      {online && !verified && (
        <span className="absolute bottom-0 right-0 size-[10px] rounded-full border-[1.5px] border-white bg-ok" />
      )}
    </span>
  )
}
