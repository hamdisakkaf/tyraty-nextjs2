'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaWhatsapp, FaInstagram, FaTwitter, FaFacebookF, FaArrowLeft } from 'react-icons/fa';

export default function CreativeFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] text-white pt-24 pb-8 relative overflow-hidden font-alexandria">
      
      {/* خلفية نصية ضخمة */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.02]">
        <span className="text-[20vw] font-black text-white leading-none whitespace-nowrap select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-sm">
          TYRATY EMPIRE
        </span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* القسم العلوي */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24 items-end">
          
          {/* هوية البراند */}
          <div className="lg:col-span-7 text-right space-y-8" dir="rtl">
            <Image 
              src="/لوجو تايراتي tyrate - Opject-09.svg" 
              width={80} 
              height={80} 
              className="object-contain brightness-125 opacity-80 inline-block" 
              alt="Logo" 
            />
            
            <div>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-l from-white via-white to-[#B85A45]/40 leading-[0.9]">
                تايراتي <br /> <span className="text-[#B85A45]">إمباير</span>
              </h2>
            </div>
            <p className="text-xl md:text-2xl font-light text-gray-400 tracking-widest uppercase">
              <span className="text-[#B85A45] font-bold">الْتِزَامٌ وَقِيَم</span> • Commitment & Values
            </p>
          </div>

          {/* صندوق الاشتراك */}
          <div className="lg:col-span-5 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#B85A45]/15 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden group hover:border-[#B85A45]/30 transition-all duration-500">
              <h3 className="text-2xl font-black mb-6 text-right text-white">
                انضم لنخبة <span className="text-[#B85A45]">تايراتي</span>
              </h3>
              <p className="text-gray-400 text-sm text-right mb-8 leading-relaxed">
                احصل على إمكانية الوصول المبكر للعروض الحصرية، ونصائح الخبراء، وتحديثات السوق مباشرة إلى بريدك الوارد.
              </p>

              <form className="flex items-center bg-[#0a0a0a] p-2 rounded-2xl border border-white/10 focus-within:border-[#B85A45] transition-all">
                <button type="submit" className="bg-[#B85A45] hover:bg-[#9C4836] text-white p-4 rounded-xl transition-all shrink-0 shadow-lg shadow-[#B85A45]/20 group-hover:scale-105 active:scale-95">
                  <FaArrowLeft className="text-lg" />
                </button>
                <input 
                  type="email" 
                  placeholder="أدخل بريدك الإلكتروني..." 
                  className="bg-transparent flex-grow outline-none px-4 text-right text-white placeholder-gray-500 font-medium h-full"
                  required
                />
              </form>
            </div>
          </div>
        </div>

        {/* روابط التنقل */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-16 mb-16" dir="rtl">
          
          {/* عن الشركة */}
          <div className="col-span-2 md:col-span-1 space-y-4 pr-4 border-r border-white/5">
            <h4 className="text-white font-black uppercase tracking-wider mb-6">عن الشركة</h4>
            <p className="text-gray-500 text-xs leading-loose font-medium">
              نحن نعيد تعريف تجربة شراء الإطارات في اليمن لأننا نلتزم بتوفير الجودة، الأمان، والخدمة الراقية التي تستحقها.
            </p>
          </div>

          {/* الاكتشاف */}
          <div>
            <h4 className="text-[#B85A45] font-black uppercase tracking-wider mb-6">الاكتشاف</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white text-sm font-bold flex items-center gap-2 group transition-all">
                  <span className="w-2 h-[2px] bg-[#B85A45] group-hover:w-4 transition-all duration-300"></span>
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/shop/salesPolicy" className="text-gray-400 hover:text-white text-sm font-bold flex items-center gap-2 group transition-all">
                  <span className="w-2 h-[2px] bg-[#B85A45] group-hover:w-4 transition-all duration-300"></span>
                  سياسة التوصيل
                </Link>
              </li>
              <li>
                <Link href="/shop/salesPolicy" className="text-gray-400 hover:text-white text-sm font-bold flex items-center gap-2 group transition-all">
                  <span className="w-2 h-[2px] bg-[#B85A45] group-hover:w-4 transition-all duration-300"></span>
                  وثيقة السياسات
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white text-sm font-bold flex items-center gap-2 group transition-all">
                  <span className="w-2 h-[2px] bg-[#B85A45] group-hover:w-4 transition-all duration-300"></span>
                  المدونة
                </Link>
              </li>
            </ul>
          </div>

          {/* الدعم */}
          <div>
            <h4 className="text-[#B85A45] font-black uppercase tracking-wider mb-6">الدعم والمساعدة</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/shop/salesPolicy" className="text-gray-400 hover:text-white text-sm font-bold flex items-center gap-2 group transition-all">
                  <span className="w-2 h-[2px] bg-gray-700 group-hover:bg-[#B85A45] group-hover:w-4 transition-all duration-300"></span>
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link href="/shop/salesPolicy" className="text-gray-400 hover:text-white text-sm font-bold flex items-center gap-2 group transition-all">
                  <span className="w-2 h-[2px] bg-gray-700 group-hover:bg-[#B85A45] group-hover:w-4 transition-all duration-300"></span>
                  سياسة الضمان
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white text-sm font-bold flex items-center gap-2 group transition-all">
                  <span className="w-2 h-[2px] bg-gray-700 group-hover:bg-[#B85A45] group-hover:w-4 transition-all duration-300"></span>
                  تواصل معنا
                </Link>
              </li>
              <li>
                <Link href="/salesPolicy" className="text-gray-400 hover:text-white text-sm font-bold flex items-center gap-2 group transition-all">
                  <span className="w-2 h-[2px] bg-gray-700 group-hover:bg-[#B85A45] group-hover:w-4 transition-all duration-300"></span>
                  تتبع طلبك
                </Link>
              </li>
            </ul>
          </div>

          {/* التواصل الاجتماعي */}
          <div>
            <h4 className="text-white font-black uppercase tracking-wider mb-6">تواصل معنا</h4>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: FaWhatsapp, link: 'https://wa.me/967775955150', color: '#25D366' },
                { icon: FaInstagram, link: '#', color: '#E1306C' },
                { icon: FaTwitter, link: '#', color: '#1DA1F2' },
                { icon: FaFacebookF, link: '#', color: '#4267B2' }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 transition-all duration-300 group hover:border-[#B85A45] hover:bg-[#B85A45]/10"
                >
                  <social.icon 
                    className="text-xl group-hover:scale-110 transition-transform" 
                    style={{ transition: 'color 0.3s' }} 
                    onMouseEnter={(e) => e.currentTarget.style.color = social.color} 
                    onMouseLeave={(e) => e.currentTarget.style.color = ''} 
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* الحقوق */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-600">
          <p dir="rtl">© {currentYear} تايراتي إمباير. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            <Link href="/shop/salesPolicy" className="hover:text-[#B85A45] transition-colors">Privacy Policy</Link>
            <span className="text-gray-800">|</span>
            <Link href="/shop/salesPolicy" className="hover:text-[#B85A45] transition-colors">Terms of Service</Link>
          </div>
 <p className="opacity-50 flex items-center gap-1">
  Designed by
  <a 
    href="mailto:designer@gmail.com"
    className="text-[#B85A45] hover:text-white transition-colors font-bold flex items-center gap-1"
  >
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
    مصمم النظام
  </a>
</p>
        </div>
      </div>
    </footer>
  );
}