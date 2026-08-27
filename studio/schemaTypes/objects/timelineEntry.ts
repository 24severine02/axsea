import {defineField, defineType} from 'sanity'

export const timelineEntry = defineType({
  name: 'timelineEntry',
  title: 'Timeline Entry',
  type: 'object',
  fields: [
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'event',
      title: 'Event',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'year', subtitle: 'event'},
  },
})
