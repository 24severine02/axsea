import {defineField, defineType} from 'sanity'

// Values stay as free-text strings rather than numbers on purpose: "248K" and
// "3,200+" are stylistic choices Axel makes, not a raw count we can reliably
// reformat with code (unlike price/views/weight elsewhere in the schema).
export const socialProof = defineType({
  name: 'socialProof',
  title: 'Social Proof Stats',
  type: 'document',
  fields: [
    defineField({name: 'youtubeCount', title: 'YouTube subscribers', type: 'string', description: 'e.g. 248K'}),
    defineField({name: 'instagramCount', title: 'Instagram followers', type: 'string', description: 'e.g. 183K'}),
    defineField({name: 'tiktokCount', title: 'TikTok followers', type: 'string', description: 'e.g. 512K'}),
    defineField({name: 'yearsFishing', title: 'Years fishing', type: 'string', description: 'e.g. 14+'}),
    defineField({name: 'studentsCount', title: 'Students', type: 'string', description: 'e.g. 3,200+'}),
    defineField({name: 'biggestCatch', title: 'Biggest catch', type: 'string', description: 'e.g. 248 lbs'}),
  ],
})
