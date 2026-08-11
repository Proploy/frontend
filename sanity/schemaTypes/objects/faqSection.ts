import { defineField, defineType } from 'sanity'

/**
 * faqSection — the accordion FAQ block on for-experts.
 *
 * Models `FAQS` from `app/(site)/for-experts/page.tsx`. The answer is
 * portable text (the current renderer pipes it through
 * `dangerouslySetInnerHTML`; switching to @portabletext/react preserves the
 * accordion behaviour and lets editors add inline emphasis without HTML).
 */
export const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'title', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'faqs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'q', title: 'Question', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'a', title: 'Answer', type: 'array', of: [{ type: 'block' }], validation: (R) => R.required() }),
          ],
          preview: { select: { title: 'q' } },
        },
      ],
      validation: (R) => R.min(1).max(40),
    }),
  ],
  preview: { select: { title: 'title' } },
})
