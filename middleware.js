// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  const url = request.nextUrl
  const pathname = url.pathname
  
  console.log('=== MIDDLEWARE ===')
  console.log('pathname:', pathname)

  const blogMatch = pathname.match(/^\/blog\/([^/]+)\/(.+)$/)
  
  if (blogMatch) {
    const [, sectionName, slug] = blogMatch
    console.log('Match found!')
    console.log('sectionName:', sectionName)
    console.log('slug:', slug)
    
    const newUrl = new URL(
      `/blog/section/${encodeURIComponent(sectionName)}/slug/${encodeURIComponent(slug)}`,
      url
    )
    console.log('Rewriting to:', newUrl.pathname)
    
    return NextResponse.rewrite(newUrl)
  }

  console.log('No match for blog pattern')
  return NextResponse.next()
}

export const config = {
  matcher: ['/blog/:path*'],
}