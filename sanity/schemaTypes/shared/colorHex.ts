import { defineField } from 'sanity'

/**
 * Hex color, e.g. `#155eef`. Used as a CSS value (inline `style={{ color }}`)
 * for `teamSection` chips and `caseStudies` accents. We validate the format
 * instead of using `sanity` color picker because the values are decorative
 * tints and a typo should not silently render black.
 */
export const colorHex = defineField({
  name: 'color',
  title: 'Color',
  type: 'string',
  validation: (Rule) =>
    Rule.required().regex(/^#[0-9a-fA-F]{6}$/, {
      name: 'hex',
      invert: false,
    }),
})
