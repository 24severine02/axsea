import type { VercelRequest, VercelResponse } from "@vercel/node"
import { sanityWriteClient } from "../_lib/sanityWriteClient"
import { computeOrderTotals, type CartLine } from "../_lib/pricing"
import { generateOrderRef, isValidEmail } from "../_lib/validation"

type RequestBody = {
  items?: CartLine[]
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  deliveryMethod?: "pickup" | "delivery"
  deliveryAddress?: string
  paymentReference?: string
}

const MAX_ORDER_REF_ATTEMPTS = 5

async function uniqueOrderRef(): Promise<string> {
  for (let attempt = 0; attempt < MAX_ORDER_REF_ATTEMPTS; attempt++) {
    const ref = generateOrderRef()
    const existing = await sanityWriteClient.fetch<string | null>(
      `*[_type == "order" && orderRef == $ref][0]._id`,
      { ref },
    )
    if (!existing) return ref
  }
  throw new Error("Could not generate a unique order reference")
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  const body = req.body as RequestBody

  const items = Array.isArray(body.items) ? body.items : []
  if (items.length === 0) {
    res.status(400).json({ error: "Your cart is empty.", field: "items" })
    return
  }
  for (const item of items) {
    if (typeof item.productId !== "string" || !item.productId) {
      res.status(400).json({ error: "Invalid cart item.", field: "items" })
      return
    }
  }

  const customerName = body.customerName?.trim()
  if (!customerName) {
    res.status(400).json({ error: "Please enter your name.", field: "customerName" })
    return
  }

  const customerEmail = body.customerEmail?.trim()
  if (!customerEmail || !isValidEmail(customerEmail)) {
    res.status(400).json({ error: "Please enter a valid email.", field: "customerEmail" })
    return
  }

  const customerPhone = body.customerPhone?.trim() || undefined

  const deliveryMethod = body.deliveryMethod
  if (deliveryMethod !== "pickup" && deliveryMethod !== "delivery") {
    res.status(400).json({ error: "Invalid delivery method.", field: "deliveryMethod" })
    return
  }

  const deliveryAddress = body.deliveryAddress?.trim()
  if (deliveryMethod === "delivery" && !deliveryAddress) {
    res.status(400).json({ error: "Please enter a delivery address.", field: "deliveryAddress" })
    return
  }

  const paymentReference = body.paymentReference?.trim()
  if (!paymentReference || paymentReference.length < 3 || paymentReference.length > 60) {
    res.status(400).json({ error: "Please enter your payment reference.", field: "paymentReference" })
    return
  }

  const { orderItems, subtotal, deliveryFee, total, errors } = await computeOrderTotals({
    items,
    deliveryMethod,
  })

  if (errors.length > 0) {
    res.status(400).json({ error: "Some items in your cart changed.", details: errors })
    return
  }

  try {
    const orderRef = await uniqueOrderRef()

    const created = await sanityWriteClient.create({
      _type: "order",
      orderRef,
      items: orderItems,
      customerName,
      customerPhone,
      customerEmail,
      deliveryMethod,
      deliveryAddress: deliveryMethod === "delivery" ? deliveryAddress : undefined,
      subtotal,
      deliveryFee,
      total,
      paymentReference,
      status: "pending",
    })

    res.status(200).json({ orderRef, orderId: created._id })
  } catch (err) {
    console.error("Failed to create order:", err)
    res.status(500).json({ error: "Couldn't save your order — please try again." })
  }
}
