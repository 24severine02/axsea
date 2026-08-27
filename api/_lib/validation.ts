const REF_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

export function generateOrderRef(): string {
  let ref = "AXSEA-"
  for (let i = 0; i < 6; i++) ref += REF_CHARS[Math.floor(Math.random() * REF_CHARS.length)]
  return ref
}

const ORDER_REF_PATTERN = /^AXSEA-[A-Z0-9]{6}$/

export function isValidOrderRefFormat(ref: string): boolean {
  return ORDER_REF_PATTERN.test(ref)
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email)
}
