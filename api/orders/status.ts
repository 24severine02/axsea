import type { VercelRequest, VercelResponse } from "@vercel/node"
import { sanityWriteClient } from "../_lib/sanityWriteClient"
import { isValidOrderRefFormat } from "../_lib/validation"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  const ref = typeof req.query.ref === "string" ? req.query.ref.trim().toUpperCase() : ""

  if (!isValidOrderRefFormat(ref)) {
    res.status(400).json({ error: "Invalid order reference." })
    return
  }

  const order = await sanityWriteClient.fetch(
    `*[_type == "order" && orderRef == $ref][0]{
      orderRef,
      status,
      items[]{ productName, price, quantity, size, color },
      subtotal,
      deliveryFee,
      total,
      deliveryMethod,
      "placedAt": _createdAt
    }`,
    { ref },
  )

  if (!order) {
    res.status(404).json({ error: "No order found for that reference." })
    return
  }

  res.status(200).json(order)
}
