import { defineField } from 'sanity'

/**
 * Constrained list of lucide-react icon names used across the marketing surface.
 *
 * Why constrained rather than free text: today's icon rendering uses the actual
 * lucide components (`<MessageSquareMore />`, `<Zap />`, …). A typo in Sanity
 * becomes a blank icon in production. The renderer at
 * `sanity/lib/iconRegistry.tsx` maps each accepted key to a lucide component;
 * adding a new icon here must ship alongside the registry entry.
 *
 * If you need an icon not on this list, add it to BOTH the options array below
 * AND the `iconRegistry.tsx` map.
 */
const OPTIONS = [
  { title: 'AlertTriangle', value: 'AlertTriangle' },
  { title: 'ArrowLeft', value: 'ArrowLeft' },
  { title: 'ArrowRight', value: 'ArrowRight' },
  { title: 'ArrowUpRight', value: 'ArrowUpRight' },
  { title: 'BarChart3', value: 'BarChart3' },
  { title: 'Building2', value: 'Building2' },
  { title: 'Camera', value: 'Camera' },
  { title: 'Check', value: 'Check' },
  { title: 'CheckCircle2', value: 'CheckCircle2' },
  { title: 'Clock3', value: 'Clock3' },
  { title: 'ClipboardCheck', value: 'ClipboardCheck' },
  { title: 'Command', value: 'Command' },
  { title: 'CreditCard', value: 'CreditCard' },
  { title: 'Download', value: 'Download' },
  { title: 'Eye', value: 'Eye' },
  { title: 'FileCheck2', value: 'FileCheck2' },
  { title: 'FileSignature', value: 'FileSignature' },
  { title: 'FileText', value: 'FileText' },
  { title: 'Gauge', value: 'Gauge' },
  { title: 'GitCompareArrows', value: 'GitCompareArrows' },
  { title: 'Globe', value: 'Globe' },
  { title: 'Heart', value: 'Heart' },
  { title: 'Home', value: 'Home' },
  { title: 'Inbox', value: 'Inbox' },
  { title: 'Loader2', value: 'Loader2' },
  { title: 'LockKeyhole', value: 'LockKeyhole' },
  { title: 'Mail', value: 'Mail' },
  { title: 'MapPin', value: 'MapPin' },
  { title: 'MessageCircle', value: 'MessageCircle' },
  { title: 'MessageSquareMore', value: 'MessageSquareMore' },
  { title: 'Package2', value: 'Package2' },
  { title: 'PenLine', value: 'PenLine' },
  { title: 'Plug', value: 'Plug' },
  { title: 'Plus', value: 'Plus' },
  { title: 'Receipt', value: 'Receipt' },
  { title: 'RefreshCw', value: 'RefreshCw' },
  { title: 'RotateCcw', value: 'RotateCcw' },
  { title: 'Save', value: 'Save' },
  { title: 'Scale', value: 'Scale' },
  { title: 'ScrollText', value: 'ScrollText' },
  { title: 'Send', value: 'Send' },
  { title: 'ShieldCheck', value: 'ShieldCheck' },
  { title: 'Sparkles', value: 'Sparkles' },
  { title: 'Star', value: 'Star' },
  { title: 'Trash2', value: 'Trash2' },
  { title: 'TrendingUp', value: 'TrendingUp' },
  { title: 'UserRound', value: 'UserRound' },
  { title: 'Wallet', value: 'Wallet' },
  { title: 'X', value: 'X' },
  { title: 'XCircle', value: 'XCircle' },
  { title: 'Zap', value: 'Zap' },
] as const

export const iconKey = defineField({
  name: 'iconKey',
  title: 'Icon',
  type: 'string',
  options: { list: [...OPTIONS], layout: 'dropdown' },
  validation: (Rule) => Rule.required(),
})
