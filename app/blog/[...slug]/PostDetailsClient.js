"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import ShareButtons from '../../../components/blog/ShareButtons'

// دالة تنظيف HTML
function cleanHtml(html) {
  if (!html || typeof html !== 'string') return ''
  
  let cleaned = html
  cleaned = cleaned.replace(/\s+data-[\w-]+="[^"]*"/g, '')
  cleaned = cleaned.replace(/\s+data-[\w-]+='[^']*'/g, '')
  cleaned = cleaned.replace(/\s+style="[^"]*"/g, '')
  cleaned = cleaned.replace(/\s+style='[^']*'/g, '')
  cleaned = cleaned.replace(/\s+contenteditable="[^"]*"/gi, '')
  cleaned = cleaned.replace(/\s+dir="ltr"/gi, '')
  cleaned = cleaned.replace(/\s+(orphans|widows|text-indent|text-transform|word-spacing|letter-spacing|white-space|text-decoration-thickness|text-decoration-style|text-decoration-color|font-style|font-variant-ligatures|font-variant-caps|font-size|color|margin-top|margin-bottom|padding-left|line-height|box-sizing|-webkit-text-stroke-width)="[^"]*"/g, '')
  cleaned = cleaned.replace(/\s+/g, ' ')
  cleaned = cleaned.replace(/>\s+</g, '><')
  cleaned = cleaned.trim()
  
  return cleaned
}

// دالة استخراج نص فقط (للمقتطفات)
function stripHtml(html, maxLength = null) {
  if (!html || typeof html !== 'string') return ''
  
  let text = html.replace(/<<[^>]+>/g, ' ')
  text = text.replace(/&nbsp;/g, ' ')
  text = text.replace(/&amp;/g, '&')
  text = text.replace(/\s+/g, ' ').trim()
  
  if (maxLength && text.length > maxLength) {
    const lastSpace = text.lastIndexOf(' ', maxLength)
    return text.substring(0, lastSpace > 0 ? lastSpace : maxLength) + '...'
  }
  
  return text
}

// دالة التحقق إذا كان الحقل يحتوي على بيانات
function hasContent(value) {
  if (!value) return false
  if (typeof value !== 'string') return false
  return value.trim().length > 0 && value !== 'null' && value !== 'undefined'
}

// مكون عرض صورة + نص
function ContentBlock({ image, text, index }) {
  if (!hasContent(image) && !hasContent(text)) return null

  return (
    <div className="my-12 group">
      {/* صورة */}
      {hasContent(image) && (
        <div className="relative overflow-hidden rounded-2xl border border-white/5 mb-6 shadow-xl">
          <Image
            src={image}
            alt={`صورة ${index}`}
             fill
            className="w-full h-auto max-h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/30 to-transparent"></div>
        </div>
      )}
      
      {/* نص */}
      {hasContent(text) && (
        <div 
          className="text-gray-300 text-lg leading-[2.2] border-r-4 border-[#B85A45] pr-6 py-2"
          dangerouslySetInnerHTML={{ __html: cleanHtml(text) }}
        />
      )}
    </div>
  )
}

export default function PostDetailsClient({ sectionName, postSlug }) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState([])

  const server = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true' 
    ? 'http://localhost:5000' 
    : 'https://server.tyraty.com'

  useEffect(() => {
    if (!postSlug) {
      setLoading(false)
      return
    }
    
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${server}/getPostBySlug/${postSlug}`)
        
        if (res.data) {
          setPost(res.data)
          
          // جلب مقالات ذات صلة
          if (res.data?.sectionsfamely_family_id || res.data?.section_id || res.data?.familyid) {
            const familyId = res.data.sectionsfamely_family_id || res.data.section_id || res.data.familyid
            try {
              const relatedRes = await axios.get(`${server}/getpostsByFamily/${familyId}`)
              const filtered = (relatedRes.data || [])
                .filter(p => p.post_id !== res.data.post_id)
                .slice(0, 3)
              setRelated(filtered)
            } catch (err) {
              console.log('No related posts:', err)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching post:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPost()
    window.scrollTo(0, 0)
  }, [postSlug, server])

  if (loading) return <PostSkeleton />
  if (!post) return <PostNotFound />

  const buildUrl = (p) => {
    if (!p?.slug) return '/blog'
    const section = p.section_name || p.familyname || 'مقال'
    return `/blog/${encodeURIComponent(section)}/${p.slug}`
  }

  // استخراج تاريخ الإنشاء
  const createdDate = post.create_time 
    ? new Date(post.create_time).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : post.created_at 
      ? new Date(post.created_at).toLocaleDateString('ar-SA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : ''

  // استخراج تاريخ التحديث
  const updatedDate = post.update_time 
    ? new Date(post.update_time).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : ''

  // بناء مصفوفة الصور والنصوص الإضافية
  const contentBlocks = []
  for (let i = 2; i <= 10; i++) {
    const imageKey = `image${i}`
    const textKey = `post_text_image${i}`
    
    if (hasContent(post[imageKey]) || hasContent(post[textKey])) {
      contentBlocks.push({
        index: i,
        image: post[imageKey],
        text: post[textKey]
      })
    }
  }

  return (
    <article className="bg-[#050505] min-h-screen text-white">
      {/* Breadcrumb */}
      <nav className="border-b border-white/5 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <ol className="flex items-center gap-2 text-sm flex-wrap">
            <li>
              <Link href="/" className="text-gray-400 hover:text-[#B85A45] transition-colors">
                الرئيسية
              </Link>
            </li>
            <li className="text-gray-600">/</li>
            <li>
              <Link href="/blog" className="text-gray-400 hover:text-[#B85A45] transition-colors">
                المدونة
              </Link>
            </li>
            <li className="text-gray-600">/</li>
            <li className="text-[#B85A45]">
              {sectionName || post.section_name || 'مقال'}
            </li>
            <li className="text-gray-600">/</li>
            <li className="text-white truncate max-w-[200px]">{post.title}</li>
          </ol>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-10">
          <span className="inline-block px-4 py-1 bg-[#B85A45]/20 text-[#B85A45] rounded-full text-sm font-bold mb-4">
            {post.section_name || 'مقال'}
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="w-20 h-1 bg-[#B85A45] mx-auto rounded-full"></div>
          
          {/* Meta info */}
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500 flex-wrap">
            {createdDate && (
              <span>نُشر: {createdDate}</span>
            )}
            {updatedDate && updatedDate !== createdDate && (
              <>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span>تحديث: {updatedDate}</span>
              </>
            )}
            {post.author && (
              <>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span className="text-[#B85A45]">{post.author}</span>
              </>
            )}
            {post.readmore && (
              <>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span>{post.readmore}</span>
              </>
            )}
          </div>
        </header>

        {/* Featured Image (postImage) */}
        {hasContent(post.postImage) && (
          <div className="relative rounded-3xl overflow-hidden mb-10">
            <Image
              src={post.postImage}
              alt={post.title}
              className="w-full h-[300px] md:h-[500px] object-cover"
              loading="eager"
               fill
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 to-transparent"></div>
          </div>
        )}

        {/* Main Content (post_text) */}
        {hasContent(post.post_text) && (
          <div 
            className="blog-content text-gray-300 text-lg leading-[2.2] mb-12"
            dangerouslySetInnerHTML={{ 
              __html: cleanHtml(post.post_text) 
            }}
          />
        )}

        {/* Additional Content Blocks (image2-10 + post_text_image2-10) */}
        {contentBlocks.map(block => (
          <ContentBlock 
            key={block.index}
            image={block.image}
            text={block.text}
            index={block.index}
          />
        ))}

        {/* SEO Description (if exists and different from post_text) */}
        {hasContent(post.seo_description) && post.seo_description !== post.post_text && (
          <div className="mt-12 p-6 bg-[#0f0f0f] rounded-2xl border border-white/5">
            <h3 className="text-lg font-bold mb-3 text-[#B85A45]">ملخص</h3>
            <p className="text-gray-400 leading-relaxed">
              {post.seo_description}
            </p>
          </div>
        )}

        {/* Share */}
        <div className="mt-12 mb-12">
          <ShareButtons 
            url={typeof window !== 'undefined' ? window.location.href : ''}
            title={post.title}
          />
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-[#B85A45] rounded-full"></div>
              مقالات ذات صلة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(r => (
                <Link
                  key={r.post_id}
                  href={buildUrl(r)}
                  className="group bg-[#0f0f0f] rounded-2xl overflow-hidden border border-white/5 hover:border-[#B85A45]/30 transition-all hover:-translate-y-1"
                >
                  <div className="h-40 overflow-hidden bg-[#1a1a1a]">
                    {hasContent(r.postImage) ? (
                      <Image 
                        src={r.postImage} 
                        alt={r.title} 
                        className="w-full fill h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                         fill
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm line-clamp-2 group-hover:text-[#B85A45] transition-colors">
                      {r.title}
                    </h3>
                    {r.section_name && (
                      <span className="text-xs text-[#B85A45] mt-2 block">
                        {r.section_name}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}

function PostSkeleton() {
  return (
    <div className="bg-[#050505] min-h-screen">
      <div className="border-b border-white/5 bg-white/5">
        <div className="container mx-auto px-4 py-4">
          <div className="h-4 bg-white/10 rounded w-1/3"></div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 max-w-4xl animate-pulse">
        <div className="h-12 bg-white/10 rounded-lg w-3/4 mx-auto mb-8"></div>
        <div className="h-96 bg-white/5 rounded-3xl mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-white/10 rounded w-full"></div>
          <div className="h-4 bg-white/10 rounded w-5/6"></div>
          <div className="h-4 bg-white/10 rounded w-4/6"></div>
          <div className="h-4 bg-white/10 rounded w-full"></div>
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  )
}

function PostNotFound() {
  return (
    <div className="bg-[#050505] min-h-screen flex items-center justify-center">
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold mb-4">المقال غير موجود</h1>
        <p className="text-gray-400 mb-6">عذراً، المقال الذي تبحث عنه غير متوفر أو تم حذفه</p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/blog" 
            className="px-6 py-3 bg-[#B85A45] rounded-xl font-bold hover:bg-[#9C4836] transition-colors"
          >
            العودة للمدونة
          </Link>
          <Link 
            href="/" 
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-colors"
          >
            الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}