import {defineField, defineType} from 'sanity'

export const fishingSpot = defineType({
  name: 'fishingSpot',
  title: 'Fishing Spot',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'x',
      title: 'Horizontal position (%)',
      type: 'number',
      description:
        'Position of the pin on the map image, 0 = left edge, 100 = right edge. Tied to the current map image — repositioning the map picture may require re-checking pins.',
      validation: (Rule) => Rule.required().min(0).max(100),
    }),
    defineField({
      name: 'y',
      title: 'Vertical position (%)',
      type: 'number',
      description: 'Position of the pin on the map image, 0 = top edge, 100 = bottom edge',
      validation: (Rule) => Rule.required().min(0).max(100),
    }),
    defineField({name: 'species', title: 'Species found here', type: 'string'}),
    defineField({name: 'bestSeason', title: 'Best season', type: 'string', description: 'e.g. Mar – Oct'}),
    defineField({name: 'note', title: 'Note', type: 'text', rows: 3}),
  ],
  preview: {
    select: {title: 'name', subtitle: 'bestSeason'},
  },
})
