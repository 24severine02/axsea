import {defineField, defineType} from 'sanity'

export const productColor = defineType({
  name: 'productColor',
  title: 'Colour',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hex',
      title: 'Swatch colour (hex)',
      type: 'string',
      description: 'e.g. #0D0D0D',
      validation: (Rule) =>
        Rule.required().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {name: 'hex color'}),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'hex'},
  },
})
