import { defineField, defineType } from 'sanity'

/**
 * proseBlock — standalone portable-text body.
 *
 * Use between sections to write narrative copy that doesn't fit any of the
 * structured layouts above. Renderer: <PortableText value={section.body} />.
 */
export const proseBlock = defineType({
  name: 'proseBlock',
  title: 'Prose',
  type: 'object',
  fields: [
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }], validation: (R) => R.required() }),
    defineField({
      name: 'width',
      title: 'Container width',
      type: 'string',
      options: {
        list: [
          { title: 'Narrow (~640px)', value: 'narrow' },
          { title: 'Default (~720px)', value: 'default' },
          { title: 'Wide (~960px)', value: 'wide' },
        ],
        layout: 'radio',
      },
      initialValue: 'default',
    }),
  ],
  preview: {
    select: { blocks: 'body' },
    prepare: ({ blocks }) => {
      const first = (blocks ?? []).find((b: { _type?: string; children?: { text?: string }[] }) => b._type === 'block')
      const text = first?.children?.map((c: { text?: string }) => c.text ?? '').join('') ?? ''
      return { title: text.slice(0, 60) || 'Prose' }
    },
  },
})
