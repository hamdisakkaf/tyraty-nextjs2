// app/components/OrderConfirmationLink.jsx
"use client"

import Link from "next/link"

/**
 * OrderConfirmationLink
 * 
 * URL Pattern: /shop/orderconfirmation/type-FastGuestPaid-orderId-123-producid-456-tireSize-175%2F70R14
 */
export default function OrderConfirmationLink({ 
  type = 'FastGuestPaid',
  orderId,
  producid,
  productName,
  tireSize,
  quantity,
  producpriceSR,
  KSAxchangerial,
  total,
  totalAmountYE,
  brandId,
  tireSpecId,
  TransactionRef,
  children,
  className 
}) {
  
  const buildSlug = () => {
    const parts = []
    
    // Required
    if (type) parts.push(`type-${type}`)
    if (orderId) parts.push(`orderId-${orderId}`)
    
    // Optional
    if (producid) parts.push(`producid-${producid}`)
    if (productName) parts.push(`productName-${encodeURIComponent(productName)}`)
    if (tireSize) parts.push(`tireSize-${encodeURIComponent(tireSize)}`)
    if (quantity) parts.push(`quantity-${quantity}`)
    if (producpriceSR) parts.push(`producpriceSR-${producpriceSR}`)
    if (KSAxchangerial) parts.push(`KSAxchangerial-${KSAxchangerial}`)
    if (total) parts.push(`total-${total}`)
    if (totalAmountYE) parts.push(`totalAmountYE-${totalAmountYE}`)
    if (brandId) parts.push(`brandId-${brandId}`)
    if (tireSpecId) parts.push(`tireSpecId-${tireSpecId}`)
    if (TransactionRef) parts.push(`TransactionRef-${TransactionRef}`)
    
    return parts.join('-')
  }

  const href = `/shop/orderconfirmation/${buildSlug()}`

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}