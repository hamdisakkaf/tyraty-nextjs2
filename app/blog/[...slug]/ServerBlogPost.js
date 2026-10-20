// app/blog/[...slug]/ServerBlogPost.js

const isLocalhostEnabled = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true'
const server = isLocalhostEnabled ? 'http://localhost:5000' : 'https://server.tyraty.com'

// ========== استخراج المعاملات من slug ==========
export function extractParams(slug) {
  console.log('extractParams input:', slug)
  let section = '', sectionName = '', postSlug = ''
  
  for (let i = 0; i < slug.length; i += 2) {
    const key = slug[i]
    const value = slug[i + 1]
    
    if (key === 'section') {
      section = value
      sectionName = decodeURIComponent(value || '')
    }
    if (key === 'slug') postSlug = decodeURIComponent(value || '')
  }
    console.log('Result:', { section, sectionName, postSlug })

  return { section, sectionName, postSlug }
}

// ========== SEO METADATA DYNAMIC ==========
export async function generateMetadata({ params }) {
  const { postSlug } = extractParams(params.slug || [])
  
  if (!postSlug) {
    return {
      title: 'مدونة إمباير تايراتي',
      description: 'اقرأ أحدث المقالات عن إطارات السيارات والصيانة',
    }
  }

  try {
    // ← جلب المقال بالـ slug
    const res = await fetch(`${server}/getPostBySlug/${postSlug}`, { 
      next: { revalidate: 3600 }
    })
    const post = await res.json()
    
    if (!post || !post.post_id) {
      return {
        title: 'المقال غير موجود | إمباير تايراتي',
        description: 'عذراً، المقال المطلوب غير متوفر حالياً.',
      }
    }

    const categoryName = post.section_name || 'مقال'

    // Build OG Image URL
    const ogUrl = new URL('/apis/og/blog', 'https://tyraty.com')
    ogUrl.searchParams.set('title', post.title || '')
    ogUrl.searchParams.set('excerpt', post.post_text ? post.post_text.replace(/<[^>]*>/g, '').substring(0, 200) : '')
    ogUrl.searchParams.set('image', post.postImage || '')
    ogUrl.searchParams.set('author', post.author || 'إمباير تايراتي')
    ogUrl.searchParams.set('date', post.created_at ? new Date(post.created_at).toLocaleDateString('ar-SA') : '')
    ogUrl.searchParams.set('category', categoryName)
    ogUrl.searchParams.set('section', categoryName)

    const ogImageUrl = ogUrl.toString()
    
    // ← الرابط النظيف بدون postId
    const pageUrl = `https://tyraty.com/blog/${encodeURIComponent(categoryName)}/${post.slug}`

    return {
      metadataBase: new URL('https://tyraty.com'),
      title: `${post.title} | مدونة إمباير تايراتي`,
      description: post.post_text ? post.post_text.replace(/<[^>]*>/g, '').substring(0, 160) : 'اقرأ أحدث المقالات عن إطارات السيارات',
      
      alternates: {
        canonical: pageUrl,
      },
      
      openGraph: {
        title: post.title,
        description: post.post_text ? post.post_text.replace(/<[^>]*>/g, '').substring(0, 160) : '',
        url: pageUrl,
        siteName: 'إمباير تايراتي',
        locale: 'ar_SA',
        type: 'article',
        publishedTime: post.created_at,
        modifiedTime: post.updated_at || post.created_at,
        authors: post.author ? [post.author] : ['إمباير تايراتي'],
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
            type: 'image/png',
          },
          {
            url: post.postImage || 'https://tyraty.com/assets/tyraty_logo.svg',
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ],
      },
      
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.post_text ? post.post_text.replace(/<[^>]*>/g, '').substring(0, 160) : '',
        images: [ogImageUrl],
        creator: '@tyraty',
        site: '@tyraty',
      },
      
      robots: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    }
    
  } catch (error) {
    console.error('Metadata generation error:', error)
    return {
      title: 'مدونة إمباير تايراتي',
      description: 'اقرأ أحدث المقالات عن إطارات السيارات',
    }
  }
}

export default function ServerBlogPost({ children }) {
  return children
}