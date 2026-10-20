// app/blog/page.js
import { Suspense } from 'react'
import BlogList from '../../components/blog/BlogList'

export const metadata = {
  title: 'مدونة إمباير تايراتي | أخبار السيارات والإطارات',
  description: 'اقرأ أحدث المقالات عن إطارات السيارات، الصيانة، وأخبار السيارات. دليلك الشامل لعالم السيارات في اليمن.',
  keywords: 'إطارات سيارات, صيانة سيارات, أخبار سيارات, مدونة سيارات, تايراتي, اليمن',
  openGraph: {
    title: 'مدونة إمباير تايراتي',
    description: 'أحدث المقالات عن السيارات والإطارات',
    url: 'https://tyraty.com/blog',
    siteName: 'إمباير تايراتي',
    locale: 'ar_SA',
    type: 'website',
    images: [{
      url: 'https://tyraty.com/apis/og/blog?title=مدونة إمباير تايراتي&category=مدونة',
      width: 1200,
      height: 630,
      alt: 'مدونة إمباير تايراتي',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مدونة إمباير تايراتي',
    description: 'أحدث المقالات عن السيارات والإطارات',
    images: ['https://tyraty.com/apis/og/blog?title=مدونة إمباير تايراتي'],
  },
  alternates: {
    canonical: 'https://tyraty.com/blog',
  },
}

export default function BlogPage() {
  return (
    <main className="bg-[#050505] min-h-screen text-white">
      <Suspense fallback={<BlogLoading />}>
        <BlogList />
      </Suspense>
    </main>
  )
}

function BlogLoading() {
  
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B85A45]"></div>
      <p className="mr-4 text-[#B85A45]">جاري تحميل المقالات...</p>
    </div>
  )
}