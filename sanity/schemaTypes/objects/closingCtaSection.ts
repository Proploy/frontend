import { defineField, defineType } from 'sanity'

/**
 * closingCtaSection — the dark email-capture card at the bottom of the home
 * page.
 *
 * Models `components/site/ClosingCTA.tsx`. The form state (`useState`,
 * `sent` flag) stays in the React component; this section supplies the
 * surrounding copy. The two helper strings (`helperText` shown initially,
 * `successMessage` shown after submit) are stored explicitly so they don't
 * have to live in code.
 */
export const closingCtaSection = defineType({
  name: 'closingCtaSection',
  title: 'Closing CTA',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'title', type: 'text', rows: 2, validation: (R) => R.required() }),
    defineField({ name: 'subtitle', type: 'text', rows: 3, validation: (R) => R.required() }),
    defineField({ name: 'buttonLabel', title: 'Submit button label', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'submittedLabel', title: 'Submitted button label', type: 'string' }),
    defineField({
      name: 'placeholder',
      title: 'Email placeholder',
      type: 'string',
      description: 'e.g. "you@company.com"',
    }),
    defineField({ name: 'helperText', type: 'text', rows: 2 }),
    defineField({ name: 'successMessage', type: 'text', rows: 2 }),
  ],
  preview: { select: { title: 'title' } },
})
