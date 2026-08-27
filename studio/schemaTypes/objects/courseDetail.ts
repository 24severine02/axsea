import {defineField, defineType} from 'sanity'

// A free-form label/value row (e.g. "Format" / "In-person, 1-on-1 or small
// group") so Axel can add, edit, or remove any detail per session without a
// schema change — different sessions need different fields (an online course
// has no "location", an in-person one has no "delivery").
export const courseDetail = defineType({
  name: 'courseDetail',
  title: 'Detail',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'value', title: 'Value', type: 'string', validation: (Rule) => Rule.required()}),
  ],
  preview: {
    select: {title: 'label', subtitle: 'value'},
  },
})
