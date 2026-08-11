import { defineField, defineType } from 'sanity'
import { iconKey } from '../shared/iconKey'

/**
 * valuesSection — the six-card value grid on for-experts.
 *
 * Models `VALUES` from `app/(site)/for-experts/page.tsx`. `body` is portable
 * text because the existing component renders it through
 * `dangerouslySetInnerHTML`; once we move the renderer over to
 * @portabletext/react, the same content can carry inline emphasis or links
 * without a schema change.
 */
export const valuesSection = defineType({
  name: 'valuesSection',
  title: 'Values',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'values',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            iconKey,
            defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'body', type: 'array', of: [{ type: 'block' }], validation: (R) => R.required() }),
          ],
          preview: { select: { title: 'title', subtitle: 'iconKey' } },
        },
      ],
      validation: (R) => R.min(2).max(8),
    }),
  ],
  preview: { select: { title: 'title' } },
})
