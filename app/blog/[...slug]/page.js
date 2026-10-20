// app/blog/[...slug]/page.js
import PostDetailsClient from './PostDetailsClient'

const server = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true' 
  ? 'http://localhost:5000' 
  : 'https://server.tyraty.com'

// ⬅️ تعديل: يتوقع ['نصائح', 'كيف-تختار']
function extractParams(slug) {
  console.log('Extracting from:', slug);
  
  if (slug.length >= 2) {
    return {
      section: slug[0],
      sectionName: decodeURIComponent(slug[0] || ''),
      postSlug: decodeURIComponent(slug[1] || '')
    };
  }
  
  if (slug.length === 1) {
    return {
      section: '',
      sectionName: '',
      postSlug: decodeURIComponent(slug[0] || '')
    };
  }
  
  return { section: '', sectionName: '', postSlug: '' };
}

export async function generateMetadata({ params }) {
  console.log('=== PAGE.JS ===');
  console.log('Raw params:', params);
  console.log('Params.slug:', params?.slug);
  
  const { postSlug } = extractParams(params?.slug || []);
  console.log('Extracted postSlug:', postSlug);

  if (!postSlug) {
    return {
      title: 'مدونة إمباير تايراتي',
      description: 'اقرأ أحدث المقالات عن إطارات السيارات',
    };
  }

  try {
    const res = await fetch(`${server}/getPostBySlug/${postSlug}`, { 
      next: { revalidate: 3600 }
    });
    const post = await res.json();
    
    if (!post?.post_id) {
      return {
        title: 'المقال غير موجود | إمباير تايراتي',
        description: 'عذراً، المقال المطلوب غير متوفر',
      };
    }

    const ogUrl = new URL('/apis/og/blog', 'https://tyraty.com');
    ogUrl.searchParams.set('title', post.title || '');
    ogUrl.searchParams.set('excerpt', (post.post_text || '').replace(/<<[^>]*>/g, '').substring(0, 200));
    ogUrl.searchParams.set('image', post.postImage || '');
    ogUrl.searchParams.set('category', post.section_name || 'مقال');

    const pageUrl = `https://tyraty.com/blog/${encodeURIComponent(post.section_name || 'مقال')}/${post.slug}`;

    return {
      metadataBase: new URL('https://tyraty.com'),
      title: `${post.title} | مدونة إمباير تايراتي`,
      description: (post.post_text || '').replace(/<<[^>]*>/g, '').substring(0, 160),
      alternates: { canonical: pageUrl },
      openGraph: {
        title: post.title,
        description: (post.post_text || '').replace(/<<[^>]*>/g, '').substring(0, 160),
        url: pageUrl,
        siteName: 'إمباير تايراتي',
        locale: 'ar_SA',
        type: 'article',
        images: [{ url: ogUrl.toString(), width: 1200, height: 630, alt: post.title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        images: [ogUrl.toString()],
      },
    };
  } catch (error) {
    return {
      title: 'مدونة إمباير تايراتي',
      description: 'اقرأ أحدث المقالات عن إطارات السيارات',
    };
  }
}

export default function BlogPostPage({ params }) {
  console.log('=== PAGE COMPONENT ===');
  console.log('Params:', params);
  
  const { sectionName, postSlug } = extractParams(params?.slug || []);
  console.log('sectionName:', sectionName, 'postSlug:', postSlug);

  return (
    <PostDetailsClient 
      sectionName={sectionName}
      postSlug={postSlug}
    />
  );
}