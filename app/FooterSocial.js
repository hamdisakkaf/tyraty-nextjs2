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
    href="https://wa.me/967784584000"
    target="_blank"
    rel="noopener noreferrer"
    className="text-[#25D366] hover:text-white transition-colors font-bold flex items-center gap-1"
  >
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
    مصمم النظام
  </a>
</p>
        </div>
      </div>
    </footer>
  );
}