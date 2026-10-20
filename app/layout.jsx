import { Montserrat } from 'next/font/google';
import localFont from 'next/font/local';

import ClientLayout from "./ClientLayout";
// استدعاء ملف الـ CSS الموحد الجديد فقط واحذف السطور القديمة لـ App.css
import "../styles/globals.css";
import '../styles/blog-content.css'
// Montserrat للغة الإنجليزية
// 1. تحسين الخطوط للأداء: Montserrat للغة الإنجليزية والأرقام
const montserrat = Montserrat({ 
  subsets: ['latin'], 
  variable: '--font-montserrat',
  display: 'swap', // يمنع حجب النص أثناء تحميل الخط
});
// الجزيرة للغة العربية (محلياً من مجلد public/fonts)
const alJazeera = localFont({
  src: '../public/fonts/Al-Jazeera-Arabic-Regular.woff2',
  variable: '--font-aljazeera',
  display: 'swap',
});

// 2. تحسين البيانات الميتا (SEO) لمتجر تايراتي إمباير
export const metadata = {
  metadataBase: new URL('https://tyraty.com'), // ← ضروري للروابط النسبية
  title: "إمباير تايراتي | السوق الأول لتجارة إطارات السيارات في اليمن",
  description: "اكتشف الجيل الجديد من خدمات الإطارات مع إمباير تايراتي. جودة عالمية، أسعار شفافة بالريال اليمني، وأمان مطلق لرحلتك دون الحاجة لزيارة المعارض.",
  alternates: {
    canonical: 'https://tyraty.com', // يمنع تكرار الروابط في جوجل
  },
  // إضافة علامات Open Graph لضمان ظهور احترافي عند مشاركة الرابط في وسائل التواصل أو الشات الذكي
  openGraph: {
    title: "إمباير تايراتي | لتجارة إطارات السيارات",
    description: "منصة إلكترونية يمنية متكاملة لبيع وتوريد إطارات السيارات بأعلى معايير الجودة والأمان.",
    url: 'https://tyraty.com',
    siteName: 'إمباير تايراتي',
    locale: 'ar_YE',
    type: 'website',
     // الصورة الافتراضية للموقع ككل
    images: [{
      url: '/api/og/tire', // ← الصورة الافتراضية
      width: 1200,
      height: 630,
      alt: 'إمباير تايراتي',
    }],
  },

   twitter: {
    card: 'summary_large_image',
    images: ['/apis/og/tire'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={`${montserrat.variable} ${alJazeera.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "AutoPartsStore",
                "@id": "https://tyraty.com/#organization",
                "name": "إمباير تايراتي لتجارة إطارات السيارات",
                "image": "https://tyraty.com/assets/tyraty_logo.svg",
                "description": "سوق ومنصة إلكترونية يمنية متكاملة لبيع وتوريد إطارات السيارات بأعلى معايير الجودة والأمان والالتزام .",
                "url": "https://tyraty.com",
                "telephone": "+967784584000",
                "priceRange": "YER",
                "currenciesAccepted": "YER, SAR",
                "paymentAccepted": "Cash, Mobile Payment, الدفع عبر تطبيقات الدفع المحلية",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "شارع تعز",
                  "addressLocality": "صنعاء / عدن",
                  "addressCountry": "YE"
                },
                "openingHoursSpecification": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  "opens": "08:00",
                  "closes": "22:00"
                },
                "areaServed": [
                  {"@type": "AdministrativeArea", "name": "صنعاء"},
                  {"@type": "AdministrativeArea", "name": "عدن"},
                ]
              },
              {
                // إضافة مخطط الموقع (WebSite) لتفعيل صندوق البحث الخاص بمتجرك مباشرة داخل نتائج بحث Google (Sitelinks Searchbox)
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": "https://tyraty.com/tyratyfinder",
                "url": "https://tyraty.com",
                "name": "إمباير تايراتي",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://tyraty.com/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              }
            ])
          }}
        />
   
      </head>
      <body className="font-sans antialiased  bg-[#0a0a0a] text-white selection:bg-[#9C4836]">
      
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}