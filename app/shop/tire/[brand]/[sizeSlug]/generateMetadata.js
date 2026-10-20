
// app/tire/[brand]/[sizeSlug]/generateMetadata.js

/**
 * ═══════════════════════════════════════════════════════════
 * Tire Product Page - SEO & Social Sharing Metadata
 * ═══════════════════════════════════════════════════════════
 * 
 * Generates rich Open Graph, Twitter Cards, and structured
 * data for professional social media sharing.
 */

const SITE_URL = 'https://tyraty.com'
const SITE_NAME = 'امباير تايراتي'
const SITE_NAME_EN = 'Tyraty.com'
const DEFAULT_OG_IMAGE = `${SITE_URL}/assests/tyraty_logo.svg`


/**
 * Fetch tire data from API
 */
async function fetchTireData(tireid) {
  try {
    const apiUrl = `https://server.tyraty.com/api/getFromTireId?producid=${tireid}`
    const response = await fetch(apiUrl, { 
      next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
    })
    
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error('Metadata fetch error:', error)
    return null
  }
}

/**
 * Format sizeSlug for display
 * 165-65R14 → 165/65R14
 */
function formatTireSize(sizeSlug) {
  if (!sizeSlug) return ''
  return sizeSlug
    .replace(/-(\d+R\d+)$/, '/$1')
    .replace(/-/g, ' ')
}

/**
 * Format sizeSlug for OG image
 * 165-65R14 → 165-65R14 (keep URL-safe)
 */
function formatSizeForOg(sizeSlug) {
  if (!sizeSlug) return ''
  return sizeSlug.replace(/-/g, '_')

}

/**
 * Generate SEO metadata for tire product page
 */
export async function generateMetadata({ params, searchParams }) {
  const { brand, sizeSlug } = params
  const tireid = searchParams?.tid
  
  // Fetch tire data
  const tire = await fetchTireData(tireid)
  
  const tireSize = formatTireSize(sizeSlug)
  const tireSizeOg = formatSizeForOg(sizeSlug)
  
  // Build product identifiers
  const tire_slug = tire?.tire_slug || 'إطار'
  const brandName = tire?.brandNameAr || tire?.brandNameEN
  const tireSizeValue = tire?.tiresize || tireSize
  const productImage = tire?.imageURL || DEFAULT_OG_IMAGE
  const price = tire?.priceSAR || ''
  
  // Canonical URL
  const canonicalUrl = tireid 
    ? `${SITE_URL}/tire/${brand}/${sizeSlug}?tid=${tireid}`
    : `${SITE_URL}/tire/${brand}/${sizeSlug}`
  
  // OG Image URL (dynamic generation with product overlay)
  const ogImageUrl = tireid
    ? `${SITE_URL}/apis/og/tire?brand=${encodeURIComponent(brandName)}&size=${encodeURIComponent(tireSizeValue)}&product=${encodeURIComponent(tire_slug)}&image=${encodeURIComponent(productImage)}&price=${encodeURIComponent(price)}`
    : `${SITE_URL}/og-tire-default.jpg`

  // Structured title & description
  const title = `${tire_slug} ${tireSizeValue} | ${SITE_NAME}`
  const description = `اشترِ ${tire_slug} مقاس ${tireSizeValue} من ${brandName} بأفضل سعر${price ? ` ${price} ر.س` : ''}. توصيل سريع وضمان أصلي. شحن لجميع المناطق.`
  
  // Keywords for search engines
  const keywords = [
    tireSizeValue,
    tire_slug,
    brandName,
    `إطار ${brandName}`,
    `كفرات ${brandName}`,
    `تواير ${tireSizeValue}`,
    `إطارات ${brandName} ${tireSizeValue}`,
    'tyres online',
    'buy tires',
    'tyraty',
    'تايراتي',
    'إطارات سيارات',
    'كفرات اونلاين',
    'بيع اطارات في صنعاء '
    
  ].filter(Boolean)

  return {
    // Basic
    title,
    description,
    keywords: keywords.join(', '),
    
    // Canonical
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'ar-SA': canonicalUrl,
        'en': `${SITE_URL}/en/tire/${brand}/${sizeSlug}${tireid ? `?tid=${tireid}` : ''}`
      }
    },
    
    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      }
    },
    
    // Open Graph (Facebook, WhatsApp, LinkedIn, etc.)
    openGraph: {
      type: 'product',
      locale: 'ar_SA',
      url: canonicalUrl,
      siteName: SITE_NAME_EN,
      title: `${tire_slug} — ${brandName} ${tireSizeValue}`,
      description: `إطار ${brandName} أصلي — ${tireSizeValue}${price ? ` | السعر: ${price} ر.س` : ''}. ضمان originality — توصيل سريع`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${tire_slug} ${tireSizeValue} — ${SITE_NAME}`,
          type: 'image/png',
        }
      ],
      product: {
        brand: brandName,
        category: 'إطارات سيارات',
        price: {
          amount: price?.toString() || '0',
          currency: 'SAR',
        },
        availability: 'in stock',
        condition: 'new',
      }
    },
    
    // Twitter Cards
    twitter: {
      card: 'summary_large_image',
      site: '@tyraty',
      creator: '@tyraty',
      title: `${tire_slug} — ${brandName} ${tireSizeValue}`,
      description: `إطار ${brandName} أصلي — ${tireSizeValue}${price ? ` | ${price} ر.س` : ''}`,
      images: [ogImageUrl],
    },
    
    // Additional metadata
    other: {
      // WhatsApp specific
      'og:image:secure_url': ogImageUrl,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:updated_time': new Date().toISOString(),
      
      // App links
      'al:web:url': canonicalUrl,
      
      // Pinterest
      'pinterest:description': description,
      'pinterest:image': ogImageUrl,
      
      // General
      'format-detection': 'telephone=no',
    },
    
    // Verification (if you have them)
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },
  }
}
