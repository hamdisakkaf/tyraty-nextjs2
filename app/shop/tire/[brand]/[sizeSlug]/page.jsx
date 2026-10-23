// app/tire/[brand]/[sizeSlug]/page.js
"use client"

import TirePageClient from './TirePageClient';

 const isLocalhost = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';
const localhost = 'http://localhost:5000';
const remoteserver = process.env.NEXT_PUBLIC_API_URL;
const server = isLocalhost ? localhost : remoteserver;

// ⬅️ generateStaticParams في Server Component


// ⬅️ generateMetadata أيضاً هنا


// ⬅️ الصفحة الرئيسية
export default function TirePage({ params }) {
  return <TirePageClient params={params} />;
}