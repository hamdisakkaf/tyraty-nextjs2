// app/tire/[brand]/[sizeSlug]/page.js
"use client"

import TirePageClient from './TirePageClient';

const server = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true' 
  ? 'http://localhost:5001' 
  : 'https://tyraty-server.onrender.com';

// ⬅️ generateStaticParams في Server Component


// ⬅️ generateMetadata أيضاً هنا


// ⬅️ الصفحة الرئيسية
export default function TirePage({ params }) {
  return <TirePageClient params={params} />;
}