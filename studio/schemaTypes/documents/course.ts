import {defineField, defineType} from 'sanity'

export const course = defineType({
  name: 'course',
  title: 'Session',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'tagline', title: 'Tagline', type: 'string', description: 'Short one-liner under the name'}),
    defineField({
      name: 'price',
      title: 'Price (MUR)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'skillLevel',
      title: 'Skill level',
      type: 'string',
      description: 'Free text, e.g. "Beginner", "Beginner–Intermediate", "Complete beginner — no prior experience needed"',
    }),
    defineField({name: 'emoji', title: 'Emoji', type: 'string', description: 'A single emoji, e.g. 🎯'}),
    defineField({name: 'popular', title: 'Mark as "Most Popular"', type: 'boolean', initialValue: false}),
    defineField({
      name: 'accentColor',
      title: 'Accent colour (hex)',
      type: 'string',
      description: 'e.g. #5DDBD3',
      validation: (Rule) => Rule.regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {name: 'hex color'}),
    }),
    defineField({
      name: 'details',
      title: 'Details',
      description:
        'Any label/value rows relevant to this session — Format, Duration, Covers, What to bring, Location, Group size, Minors policy, Weather policy, Cancellation policy, Delivery, Access, etc. Add or remove rows freely.',
      type: 'array',
      of: [{type: 'courseDetail'}],
    }),
    defineField({name: 'order', title: 'Display order', type: 'number'}),
  ],
  orderings: [{title: 'Display order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', subtitle: 'skillLevel', emoji: 'emoji'},
    prepare({title, subtitle, emoji}) {
      return {title: [emoji, title].filter(Boolean).join(' '), subtitle}
    },
  },
})
