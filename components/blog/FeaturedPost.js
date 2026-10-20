import Link from 'next/link'
import Image from 'next/image'
function getExcerpt(html, maxLength = 200) {
  if (!html) return ''
  
  if (typeof document !== 'undefined') {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    let text = tmp.textContent || tmp.innerText || ''
    text = text.replace(/\s+/g, ' ').trim()
    
    if (text.length > maxLength) {
      const lastSpace = text.lastIndexOf(' ', maxLength)
      return text.substring(0, lastSpace > 0 ? lastSpace : maxLength) + '...'
    }
    return text
  }
  
  return html.replace(/<<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, maxLength) + '...'
}

export default function FeaturedPost({ post }) {
  const buildUrl = (post) => {
    if (!post?.slug) return '/blog'
    const section = post.section_name || post.familyname || 'مقال'
    return `/blog/${encodeURIComponent(section)}/${post.slug}`
  }

  const excerpt = getExcerpt(post.post_text, 200)
  const hasImage = post.postImage && post.postImage.startsWith('http')

  return (
    <article className="relative rounded-3xl overflow-hidden group">
      <div className="relative h-[400px] md:h-[500px] bg-[#1a1a1a]">
        {hasImage ? (
          <Image
            src={post.postImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
            fill
            sizes="(max-width: 768px) 100vw, 672px"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <span className="inline-block px-4 py-1.5 bg-[#B85A45] rounded-full text-sm font-bold mb-4">
            {post.section_name || 'مميز'}
          </span>
          
          <h2 className="text-2xl md:text-4xl font-black mb-4 leading-tight max-w-3xl">
            {post.title}
          </h2>
          
          <p className="text-gray-300 mb-6 line-clamp-2 max-w-2xl text-base md:text-lg">
            {excerpt}
          </p>
          
          <Link
            href={buildUrl(post)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#B85A45] rounded-xl font-bold hover:bg-[#9C4836] transition-all hover:gap-3"
          >
            اقرأ المقال
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}