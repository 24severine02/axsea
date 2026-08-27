import {defineField, defineType} from 'sanity'

export const ctaButton = defineType({
  name: 'ctaButton',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'A section anchor like #courses, or a full URL',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
