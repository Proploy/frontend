import { defineField, defineType } from 'sanity'
import { colorHex } from '../shared/colorHex'

/**
 * teamSection — the team grid on for-experts (and any future team page).
 *
 * Models `TEAM` from `app/(site)/for-experts/page.tsx`. `color` is the
 * decorative chip background on each avatar tile; `photo` is optional so the
 * existing monogram fallback keeps working.
 */
export const teamSection = defineType({
  name: 'teamSection',
  title: 'Team',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'members',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'role', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'bio', type: 'text', rows: 3, validation: (R) => R.required() }),
            colorHex,
            defineField({ name: 'photo', type: 'image', options: { hotspot: true } }),
          ],
          preview: { select: { title: 'name', subtitle: 'role' } },
        },
      ],
      validation: (R) => R.min(1).max(24),
    }),
  ],
  preview: { select: { title: 'title' } },
})
