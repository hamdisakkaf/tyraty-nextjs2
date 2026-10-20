import Link from 'next/link'
import Image from 'next/image'

function getExcerpt(html, maxLength = 120) {
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

export default function BlogCard({ post, variant = 'default' }) {
  const buildUrl = (post) => {
    if (!post?.slug) return '/blog'
    const section = post.section_name || post.familyname || 'اطارات'
    return `/blog/${encodeURIComponent(section)}/${post.slug}`
  }

  const isCompact = variant === 'compact'
  const excerpt = getExcerpt(post.post_text, 120)
  const hasImage = post.postImage && post.postImage.startsWith('http')

  return (
    <article className={`group bg-[#0f0f0f] rounded-2xl overflow-hidden border border-white/5 hover:border-[#B85A45]/30 transition-all duration-300 hover:-translate-y-1 ${isCompact ? 'flex flex-row gap-4 p-4' : ''}`}>
      
      <div className={`relative overflow-hidden bg-[#1a1a1a] ${isCompact ? 'w-24 h-24 rounded-xl shrink-0' : 'h-48'}`}>
        {hasImage ? (
          <Image
            src={post.postImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
        
        {!isCompact && hasImage && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-[#B85A45]/90 rounded-full text-xs font-bold">
              {post.section_name || 'مقال'}
            </span>
          </div>
        )}
      </div>
      
      <div className={isCompact ? 'flex flex-col justify-center' : 'p-5'}>
        {!isCompact && (
          <p className="text-xs text-gray-500 mb-2">
            {post.created_at ? new Date(post.created_at).toLocaleDateString('ar-SA') : ''}
          </p>
        )}
        
        <h3 className={`font-bold text-white group-hover:text-[#B85A45] transition-colors ${isCompact ? 'text-sm line-clamp-2' : 'text-lg line-clamp-2 mb-3'}`}>
          {post.title}
        </h3>
        
        {!isCompact && (
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
            {excerpt}
          </p>
        )}
        
        <Link
          href={buildUrl(post)}
          className={`inline-flex items-center gap-1 text-[#B85A45] font-bold text-sm hover:gap-2 transition-all ${isCompact ? 'mt-1' : 'mt-auto'}`}
        >
          {isCompact ? 'اقرأ →' : 'اقرأ المقال ←'}
        </Link>
      </div>
    </article>
  )
}