'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, LogIn, UserPlus, ShieldAlert } from 'lucide-react';
import Image from 'next/image';

const HeaderCollapsible = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/blog', label: 'المدونة' },
    { href: '/about', label: 'من نحن' }
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 z-[60] w-full bg-[#2B2B2B] shadow-xl border-b border-[#F4F1EA]/10 font-sans" dir="rtl">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* زر الهامبرغر - يظهر على الشاشات الأصغر من xl */}
          <div className="xl:hidden flex items-center">
            <button 
              onClick={toggleMenu} 
              className="p-2 text-[#F4F1EA] hover:bg-[#9C4836]/10 rounded-xl transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* اللوقو الرسمي - ثابت ومنظم بـ Flex */}
        {/* اللوقو الرسمي - باستخدام صورة */}
<div className="flex items-center">
  <Link 
    href="/" 
    className="flex items-center gap-3 group select-none"
    onClick={() => setIsOpen(false)}
  >
    {/* صورة اللوجو */}
    <Image 
      src="/assests/tyraty_logo.svg" // تأكد من وضع ملف اللوجو في هذا المسار داخل مجلد public
      alt="شعار إمباير تايراتي"
      width={140} // اضبط العرض المناسب لشعارك
      height={45}  // اضبط الارتفاع المناسب لشعارك
      className="object-contain"
      priority // ميزة حاسمة للأداء تمنع تأخر ظهور اللوجو عند تحميل الصفحة
    />
  </Link>
</div>

          {/* روابط الشاشات الكبيرة (xl فما فوق) */}
          <div className="hidden xl:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className={`relative transition-all duration-300 font-medium py-2 text-base ${
                  isActive(link.href) 
                    ? 'text-[#9C4836] font-bold' 
                    : 'text-[#F4F1EA] hover:text-[#9C4836]'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 right-0 h-0.5 bg-[#9C4836] transition-all duration-300 ${
                  isActive(link.href) ? 'w-full' : 'w-0 hover:w-full'
                }`}></span>
              </Link>
            ))}
          </div>

          {/* أزرار الحساب وبوابة الدخول للشاشات الكبيرة */}
       {/* Dropdown - القائمة المنسدلة المطورة بدون فجوة */}
<div className="relative group py-2"> {/* أضفنا py-2 هنا ليكون جسر تواصل للماوس */}
  <button className="bg-[#9C4836] text-[#F4F1EA] px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#7a382a] active:scale-95 transition-all font-bold text-sm shadow-md">
    حسابي <ChevronDown size={16} />
  </button>
  
  {/* القائمة المنسدلة: قمنا بتغيير mt-2 إلى pt-2 وتصفير الـ top ليلتصق الجسر تماماً */}
  <div className="absolute left-0 top-full hidden w-52 pt-2 group-hover:block animate-fadeIn">
    <div className="bg-[#2B2B2B] border border-[#F4F1EA]/10 rounded-2xl shadow-2xl overflow-hidden">
      <Link 
        href="/auth/customeregister"
        className="block px-5 py-3.5 text-[#F4F1EA] hover:bg-[#9C4836]/20 transition-all flex items-center gap-3 text-sm"
      >
        <UserPlus size={16} className="text-[#9C4836]" />
        إصدار حساب جديد
      </Link>
      <Link 
        href="/auth/customerLogin"
        className="block px-5 py-3.5 text-[#F4F1EA] hover:bg-[#9C4836]/20 transition-all flex items-center gap-3 text-sm"
      >
        <LogIn size={16} className="text-[#9C4836]" />
        دخول العملاء
      </Link>
      <div className="border-t border-[#F4F1EA]/5"></div>
      <Link 
        href="/auth/adminLogin"
        className="block px-5 py-3.5 text-[#F4F1EA]/70 hover:text-[#F4F1EA] hover:bg-[#9C4836]/10 transition-all flex items-center gap-3 text-xs"
      >
        <ShieldAlert size={14} />
        منصة الإدارة والموظفين
      </Link>
    </div>
  </div>
</div>

          {/* مساحة موازنة فارغة للموبايل لضبط توسيط العناصر */}
          <div className="xl:hidden w-10"></div>
        </div>
      </div>

      {/* القائمة الجانبية للموبايل (Mobile Drawer) */}
      <div className={`fixed inset-0 z-50 flex justify-start transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        {/* الخلفية المظلمة الشفافة */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={toggleMenu}></div>
        
        {/* لوحة القائمة المستوحاة من حركة التطبيقات السريعة */}
        <div className={`relative w-[290px] h-full bg-[#2B2B2B] p-6 shadow-2xl transition-transform duration-300 border-l border-[#F4F1EA]/10 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex justify-between items-center mb-10">
            <span className="text-[#F4F1EA] text-lg font-bold">
              إمباير <span className="text-[#9C4836]">تايراتي</span>
            </span>
            <button onClick={toggleMenu} className="p-2 text-[#F4F1EA] bg-[#9C4836]/10 rounded-full hover:bg-[#9C4836]/20">
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col space-y-3">
            <p className="text-[#F4F1EA]/40 text-xs font-bold tracking-wider px-2">تصفح المنصة</p>
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                onClick={toggleMenu}
                className={`py-3.5 px-4 rounded-xl transition-all font-medium text-base flex items-center ${
                  isActive(link.href) 
                    ? 'bg-[#9C4836]/20 text-[#9C4836] font-bold' 
                    : 'text-[#F4F1EA] hover:bg-[#F4F1EA]/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="pt-6 border-t border-[#F4F1EA]/5 mt-4">
              <p className="text-[#F4F1EA]/40 text-xs font-bold tracking-wider px-2 mb-3">بوابات الدفع والحساب</p>
              <Link 
                href="/auth/register" 
                onClick={toggleMenu} 
                className="flex items-center justify-center gap-2 w-full bg-[#9C4836] text-[#F4F1EA] py-3.5 rounded-xl font-bold mb-3 hover:bg-[#7a382a] active:scale-[0.98] transition-all text-sm shadow-md"
              >
                <UserPlus size={16} />
                إنشاء حساب جديد
              </Link>
              <Link 
                href="/auth/customerLogin" 
                onClick={toggleMenu} 
                className="flex items-center justify-center gap-2 w-full bg-transparent text-[#F4F1EA] py-3.5 rounded-xl border border-[#F4F1EA]/20 hover:border-[#9C4836] transition-all text-sm"
              >
                <LogIn size={16} className="text-[#9C4836]" />
                دخول العملاء
              </Link>
            </div>
            
            <div className="pt-4">
              <Link 
                href="/auth/adminLogin"
                onClick={toggleMenu}
                className="flex items-center justify-center gap-2 w-full py-2 text-[#F4F1EA]/50 hover:text-[#F4F1EA] text-xs transition-colors"
              >
                <ShieldAlert size={14} />
                بوابة الموظفين والإدارة
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HeaderCollapsible;