import {defineField, defineType} from 'sanity'

export const shopSettings = defineType({
  name: 'shopSettings',
  title: 'Shop Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'paymentQrCode',
      title: 'Payment QR code',
      type: 'image',
      description: "Axel's MCB Juice payment QR code, shown at checkout",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paymentAppName',
      title: 'Payment app name',
      type: 'string',
      initialValue: 'MCB Juice',
    }),
    defineField({
      name: 'paymentInstructions',
      title: 'Payment instructions',
      type: 'text',
      rows: 2,
      description: 'e.g. Open MCB Juice → Scan to Pay → point at QR above.',
    }),
    defineField({
      name: 'orderHoldMinutes',
      title: 'Order held for (minutes)',
      type: 'number',
      initialValue: 15,
    }),
    defineField({
      name: 'deliveryFee',
      title: 'Delivery fee (MUR)',
      type: 'number',
      initialValue: 150,
    }),
  ],
})
