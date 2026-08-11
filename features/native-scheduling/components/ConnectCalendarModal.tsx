'use client'

import { Modal } from '@/components/ui/Modal'
import { NativeGoogleCalendarSetup } from './NativeGoogleCalendarSetup'

type Props = {
  open: boolean
  onClose: () => void
  returnPath?: string
}

export function ConnectCalendarModal({
  open,
  onClose,
  returnPath = '/workspace/meetings',
}: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Connect Google Calendar"
      closeLabel="Close calendar connection dialog"
    >
      <div className="py-1">
        <NativeGoogleCalendarSetup returnPath={returnPath} />
      </div>
    </Modal>
  )
}
