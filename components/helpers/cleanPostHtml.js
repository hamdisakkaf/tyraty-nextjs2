// utils/cleanHtml.js

/**
 * تنظيف HTML من السمات الزائدة والتنسيقات المُضمنة
 */
export function cleanHtml(html) {
  if (!html || typeof html !== 'string') return ''
  
  let cleaned = html
  
  // إزالة سمات data-* (مع قيمها)
  cleaned = cleaned.replace(/\s+data-[\w-]+="[^"]*"/g, '')
  cleaned = cleaned.replace(/\s+data-[\w-]+='[^']*'/g, '')
  
  // إزالة سمات style المُضمنة
  cleaned = cleaned.replace(/\s+style="[^"]*"/g, '')
  cleaned = cleaned.replace(/\s+style='[^']*'/g, '')
  
  // إزالة سمات contentEditable
  cleaned = cleaned.replace(/\s+contenteditable="[^"]*"/gi, '')
  cleaned = cleaned.replace(/\s+contenteditable='[^']*'/gi, '')
  
  // إزالة سمات dir="ltr"
  cleaned = cleaned.replace(/\s+dir="ltr"/gi, '')
  cleaned = cleaned.replace(/\s+dir='ltr'/gi, '')
  
  // إزالة سمات orphans, widows, text-indent, etc.
  cleaned = cleaned.replace(/\s+(orphans|widows|text-indent|text-transform|word-spacing|letter-spacing|white-space|text-decoration-thickness|text-decoration-style|text-decoration-color|font-style|font-variant-ligatures|font-variant-caps|font-size|color|margin-top|margin-bottom|padding-left|line-height|box-sizing|-webkit-text-stroke-width)="[^"]*"/g, '')
  
  // إزالة تعليقات HTML
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '')
  
  // تطبيع الفراغات
  cleaned = cleaned.replace(/\s+/g, ' ')
  cleaned = cleaned.replace(/>\s+</g, '><')
  cleaned = cleaned.trim()
  
  return cleaned
}

/**
 * استخراج نص فقط بدون أي علامات HTML — للمقتطفات
 */
export function stripHtml(html, maxLength = null) {
  if (!html || typeof html !== 'string') return ''
  
  // أولاً: تنظيف السمات
  let text = cleanHtml(html)
  
  // ثانياً: إزالة جميع العلامات HTML
  // استبدال العلامات بفراغات لضمان عدم التصاق النص
  text = text.replace(/<[^>]+>/g, ' ')
  
  // إزالة الكيانات HTML
  text = text.replace(/&nbsp;/g, ' ')
  text = text.replace(/&amp;/g, '&')
  text = text.replace(/&lt;/g, '<')
  text = text.replace(/&gt;/g, '>')
  text = text.replace(/&quot;/g, '"')
  text = text.replace(/&apos;/g, "'")
  text = text.replace(/&ldquo;/g, '"')
  text = text.replace(/&rdquo;/g, '"')
  text = text.replace(/&lsquo;/g, "'")
  text = text.replace(/&rsquo;/g, "'")
  text = text.replace(/&mdash;/g, '—')
  text = text.replace(/&ndash;/g, '–')
  text = text.replace(/&hellip;/g, '...')
  text = text.replace(/&bull;/g, '•')
  text = text.replace(/&#\d+;/g, ' ')  // أي كيان رقمي
  
  // تطبيع الفراغات
  text = text.replace(/\s+/g, ' ').trim()
  
  // تقطيع إذا تجاوز الطول
  if (maxLength && text.length > maxLength) {
    const lastSpace = text.lastIndexOf(' ', maxLength)
    if (lastSpace > maxLength * 0.8) {
      text = text.substring(0, lastSpace) + '...'
    } else {
      text = text.substring(0, maxLength).trim() + '...'
    }
  }
  
  return text
}