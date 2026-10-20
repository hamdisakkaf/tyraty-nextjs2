// app/components/TireLink.jsx
"use client"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

/**
 * بناء رابط الإطار بالهيكل الاحترافي
 * 
 * @param {Object} props
 * @param {string} props.tireSize - مقاس الإطار (مثال: "165/65R14" أو "155R12")
 * @param {number|string} props.tireid - معرف الإطار
 * @param {number|string} props.payPointId - معرف نقطة البيع
 * @param {string} props.brandName - اسم الماركة (مثال: "GT Radial")
 * @param {string} props.productName - اسم المنتج (مثال: "Maxmiler Pro")
 * @param {string} props.className - classes إضافية
 * @param {ReactNode} props.children - المحتوى الداخلي
 */

/**
 * TireLink - رابط موحد للإطارات والـ Checkout
 */

// ✅ دالة بناء الـ slug (للروابط)
// دالة بناء الـ slug
// ═══════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════

/**
 * تفكيك sizeSlug إلى مقاس الإطار الأصلي
 * مثال: "165-65R14" → "165/65R14"
 */
export function parseSizeSlug(sizeSlug) {
  if (!sizeSlug) return null
  
  // نستبدل آخر شرطة قبل R بالـ slash
  // 165-65R14 → نبحث عن النمط: أرقام-أرقامRأرقام
  const match = sizeSlug.match(/^(\d+)-(\d+R\d+)$/)
  
  if (match) {
    return `${match[1]}/${match[2]}`  // "165/65R14"
  }
  
  // fallback: نستبدل كل الشرطات (للحالات الخاصة)
  return sizeSlug.replace(/-/g, '/')
}

/**
 * بناء sizeSlug من المقاس الأصلي
 * مثال: "165/65R14" → "165-65R14"
 */
export function buildSizeSlug(tireSize) {
  if (!tireSize) return ''
  
  return tireSize
    .replace(/\//g, '-')   // استبدال / بـ -
    .toLowerCase()
}

/**
 * بناء الـ URL الكامل للإطار
 */
export function buildTireUrl(tire) {
  const brandSlug = tire.brandname
    ?.toLowerCase()
    ?.replace(/[^a-z0-9]/g, '-')
    ?.replace(/-+/g, '-')
    ?.replace(/^-|-$/g, '') || 'unknown-brand'
  
  const sizeSlug = buildSizeSlug(tire.tiresize)
  const productSlug = tire.productname
    ?.toLowerCase()
    ?.replace(/[^a-z0-9\s]/g, '')
    ?.replace(/\s+/g, '-') || 'tire'
  
  // الـ URL النظيف للـ SEO
  return `shop/tire/${brandSlug}/${sizeSlug}-${productSlug}?tid=${tire.product_id}&pp=${tire.payPointId || '0'}`
}


export default function TireDetailLink({ 
  tireSize, 
  tireid, 
  payPointId, 
  brandName, 
  productName,
  className = '',
  children 
}) {
  
  // ✅ تنظيف اسم الماركة للـ URL
  const brandSlug = brandName
    ?.toLowerCase()
    ?.replace(/[^a-z0-9\s-]/g, '')  // إزالة الرموز الخاصة
    ?.replace(/\s+/g, '-')           // استبدال المسافات بـ -
    ?.replace(/-+/g, '-')             // إزالة الشرطات المكررة
    ?.replace(/^-|-$/g, '') || 'unknown-brand'  // إزالة الشرطات من البداية والنهاية

  // ✅ تنظيف اسم المنتج للـ URL
  const productSlug = productName
    ?.toLowerCase()
    ?.replace(/[^a-z0-9\s-]/g, '')
    ?.replace(/\s+/g, '-')
    ?.replace(/-+/g, '-')
    ?.replace(/^-|-$/g, '') || 'tire'

  // ✅ تنظيف المقاس: استبدال / و المسافات بـ -
  const sizeSlug = tireSize
    ?.replace(/[\s/]+/g, '-')         // استبدال / والمسافات بـ -
    ?.replace(/-+/g, '-')
    ?.toLowerCase()

  // ✅ بناء الـ URL النظيف
  const href = `shop/tire/${brandSlug}/${sizeSlug}-${productSlug}?tid=${tireid}&pp=${payPointId || '0'}`

  return (
      
    <Link href={href} className={className}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#B85A45]"></div>
              <span className="text-[14px] font-bold text-gray-300 group-hover/link:text-white transition-colors">
                عرض المواصفات التقنية كاملة
              </span>
            <ChevronLeft size={16} className="text-gray-600 group-hover/link:text-[#B85A45] transition-all" />

      {
     // children
    // productName
      }
    </Link>

  )
}

export function CheckoutLink({ ppid, producid, tireSize, tireid, pricesid, children, className }) {
  const buildSlug = () => {
    const parts = []
    if (ppid) parts.push(`ppid-${ppid}`)
    if (producid) parts.push(`producid-${producid}`)
    if (tireSize) parts.push(`tireSize-${encodeURIComponent(tireSize)}`)
    if (tireid) parts.push(`tireid-${tireid}`)
    if (pricesid) parts.push(`pricesid-${pricesid}`)
    return parts.join('-')
  }

  return (
  
    <Link href={`/shop/checkout/${buildSlug()}`} className={className}
   
    >
      {children}
    </Link>
  )
}