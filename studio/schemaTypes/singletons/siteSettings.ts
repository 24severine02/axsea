import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'footerBio',
      title: 'Footer bio text',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'copyrightLine',
      title: 'Copyright line',
      type: 'string',
      description: 'e.g. © 2026 Axsea · Axel Béchard. All rights reserved.',
    }),
    defineField({
      name: 'footerTagline',
      title: 'Footer tagline',
      type: 'string',
      description: 'e.g. Built with salt, Wi-Fi, and too much coffee.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({name: 'instagram', title: 'Instagram URL', type: 'url'}),
        defineField({name: 'youtube', title: 'YouTube URL', type: 'url'}),
        defineField({name: 'tiktok', title: 'TikTok URL', type: 'url'}),
        defineField({
          name: 'whatsapp',
          title: 'WhatsApp link',
          type: 'url',
          description: 'e.g. https://wa.me/230XXXXXXXX',
        }),
      ],
    }),
  ],
})
