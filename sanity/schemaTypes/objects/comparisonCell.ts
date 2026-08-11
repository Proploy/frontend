import { defineField, defineType } from 'sanity'

/**
 * comparisonCell — discriminated union covering the three render shapes used
 * in the for-businesses comparison table:
 *
 *   `check` — renders as ✓ or blank (truthy/falsy toggle)
 *   `text`  — renders the literal string ("Limited", "Email", "White-glove")
 *   `dash`  — renders an em-dash placeholder
 *
 * Why not just `boolean | string`? Serializing a union of two primitives is
 * ambiguous on the wire: `null` from a deleted cell, `false`, and an empty
 * string are all hard to distinguish. The renderer used to branch on
 * `typeof v === 'boolean'` and that broke the moment someone stored
 * `"false"` as text.
 *
 * Registered as a top-level type because `of: [{ type }]` requires named
 * types in the schema registry, even when used from a single parent.
 */
export const comparisonCell = defineType({
  name: 'comparisonCell',
  title: 'Comparison cell',
  type: 'object',
  fields: [
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: {
        list: [
          { title: 'Check (✓ / blank)', value: 'check' },
          { title: 'Text', value: 'text' },
          { title: 'Dash (—)', value: 'dash' },
        ],
        layout: 'radio',
      },
      initialValue: 'text',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'checked',
      title: 'Checked?',
      type: 'boolean',
      hidden: ({ parent }) => parent?.kind !== 'check',
      initialValue: false,
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      hidden: ({ parent }) => parent?.kind !== 'text',
    }),
  ],
  preview: {
    select: { kind: 'kind', checked: 'checked', text: 'text' },
    prepare: ({ kind, checked, text }) => {
      if (kind === 'check') return { title: checked ? '✓' : '(blank)' }
      if (kind === 'dash') return { title: '—' }
      return { title: text ?? '(empty)' }
    },
  },
})
