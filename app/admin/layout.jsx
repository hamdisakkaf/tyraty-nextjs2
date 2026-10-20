"use client"

import { useSelector, useDispatch } from 'react-redux'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Home, Boxes, Settings2, CircleDollarSign, LogOut, ChevronDown } from 'lucide-react'
import { AdminLogOut } from '../redux/slices/adminSlice'

export default function AdminLayout({ children }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname()
  
  // حمايات لإغلاق القوائم عند النقر الخارجي
  const [activeDropdown, setActiveDropdown] = useState(null)
  const dropdownRef1 = useRef(null)
  const dropdownRef2 = useRef(null)

  const { SignInAdmin } = useSelector((state) => state.AdminAccount || {})

  useEffect(() => {
    if (!SignInAdmin && !pathname?.includes('/adminLogin')) {
      router.push('/auth/adminLogin')
    }
  }, [SignInAdmin, pathname, router])

  // إغلاق القوائم تلقائياً عند النقر في أي مكان خارجها لمنع التداخل مع صفحات الطلبات
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        (dropdownRef1.current && !dropdownRef1.current.contains(event.target)) &&
        (dropdownRef2.current && !dropdownRef2.current.contains(event.target))
      ) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // إغلاق القوائم المنسدلة عند تغيير المسار (الانتقال لصفحة أخرى)
  useEffect(() => {
    setActiveDropdown(null)
  }, [pathname])

  const handleAdminLogout = () => {
    dispatch(AdminLogOut())
    router.push('/auth/adminLogin')
  }

  const toggleDropdown = (name) => {
    if (activeDropdown === name) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(name)
    }
  }

  if (!SignInAdmin) {
    return <div className="bg-[#1a1a1a] min-h-screen" />
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] bg-gradient-to-tr from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d] text-[#e0d5c1] font-sans antialiased" dir="rtl">
      
      {/* شريط الملاحة العلوي المطور - تم تأمين z-50 لضمان الظهور فوق الطلبات */}
      <nav className="sticky top-0 z-50 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border-b-2 border-[#9C4836] shadow-[0_4px_20px_rgba(212,168,67,0.15)] py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-8">
            {/* الشعار ورابط لوحة التحكم الرئيسي */}
            <Link href="/AdminPage" className="text-[#9C4836] font-black text-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Boxes size={22} />
              <span>لوحة التحكم</span>
            </Link>

            {/* الروابط والقوائم المنسدلة */}
            <div className="hidden xl:flex items-center gap-5 relative">
              <Link href="/" className="text-[#e0d5c1] hover:text-[#9C4836] text-sm font-bold flex items-center gap-1.5 transition-colors">
                <Home size={18} />
                الرئيسية
              </Link>

              {/* القائمة المنسدلة الأولى: إعدادات الإطارات والنظام */}
              <div className="relative" ref={dropdownRef1}>
                <button 
                  onClick={() => toggleDropdown('control')}
                  className="text-[#e0d5c1] hover:text-[#9C4836] text-sm font-bold flex items-center gap-1.5 transition-colors focus:outline-none"
                >
                  <Settings2 size={18} />
                  إدارة المتجر
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'control' ? 'rotate-180' : ''}`} />
                </button>

                {/* صندوق القائمة - معزز بـ z-50 المطلق ومحمي ضد الـ Overflow */}
                {activeDropdown === 'control' && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#111111] border border-[#9C4836]/30 rounded-xl shadow-2xl py-2 z-[100] max-h-[80vh] overflow-y-auto divide-y divide-white/5 custom-scrollbar">
                    <div className="py-1">
                      <Link href="/admin/AdminPage" className="block px-4 py-2 text-xs text-gray-300 hover:bg-[#9C4836] hover:text-white transition-colors">لوحة التحكم العامة</Link>
                      <Link href="/admin/addproduct" className="block px-4 py-2 text-xs text-gray-300 hover:bg-[#9C4836] hover:text-white transition-colors">إضافة منتج</Link>
                      <Link href="/admin/CreateTire" className="block px-4 py-2 text-xs text-gray-300 hover:bg-[#9C4836] hover:text-white transition-colors">إضافة إطار جديد</Link>
                    </div>
                    <div className="py-1">
                      <Link href="/admin/AddNewPrice" className="block px-4 py-2 text-xs text-gray-300 hover:bg-[#9C4836] hover:text-white transition-colors">إضافة سعر جديد</Link>
                      <Link href="/admin/PricingSettings" className="block px-4 py-2 text-xs text-gray-300 hover:bg-[#9C4836] hover:text-white transition-colors">تحديث السعر النهائي</Link>
                      <Link href="/admin/Agentpriceupdate" className="block px-4 py-2 text-xs text-gray-300 hover:bg-[#9C4836] hover:text-white transition-colors">تحديث أسعار الوكيل</Link>
                    </div>
                    <div className="py-1">
                      <Link href="/admin/AddSpecialPropertie" className="block px-4 py-2 text-xs text-gray-300 hover:bg-[#9C4836] hover:text-white transition-colors">إضافة ميزة خاصة</Link>
                      <Link href="/admin/exchangerates" className="block px-4 py-2 text-xs text-gray-300 hover:bg-[#9C4836] hover:text-white transition-colors">تعديل سعر العملة</Link>
                      <Link href="/admin/LocalAgent" className="block px-4 py-2 text-xs text-gray-300 hover:bg-[#9C4836] hover:text-white transition-colors">إضافة وكيل محلي</Link>
                      <Link href="/admin/AddPayPoint" className="block px-4 py-2 text-xs text-gray-300 hover:bg-[#9C4836] hover:text-white transition-colors">إضافة نقطة بيع</Link>
                      <Link href="/admin/addBrand">اضافة براند</Link>
                    </div>
                    <div className="py-1">
                      <Link href="/admin/createpost" className="block px-4 py-2 text-xs text-gray-300 hover:bg-[#9C4836] hover:text-white transition-colors">إنشاء منشور جديد</Link>
                      <Link href="/auth/customeregister" className="block px-4 py-2 text-xs text-gray-300 hover:bg-[#9C4836] hover:text-white transition-colors">تسجيل عميل جديد</Link>
                      <Link href="/admin/addAdminUsers" className="block px-4 py-2 text-xs text-gray-300 hover:bg-[#9C4836] hover:text-white transition-colors">إضافة مستخدم نظام جديد</Link>
                    </div>
                    <div className="pt-1">
                      <button onClick={handleAdminLogout} className="w-full text-right block px-4 py-2 text-xs text-red-400 hover:bg-red-950/40 transition-colors font-bold">
                        تسجيل الخروج المباشر
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* القائمة المنسدلة الثانية: العملات */}
              <div className="relative" ref={dropdownRef2}>
                <button 
                  onClick={() => toggleDropdown('currency')}
                  className="text-[#e0d5c1] hover:text-[#9C4836] text-sm font-bold flex items-center gap-1.5 transition-colors focus:outline-none"
                >
                  <CircleDollarSign size={18} />
                  العملة والصرف
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'currency' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'currency' && (
                  <div className="absolute right-0 mt-3 w-48 bg-[#111111] border border-[#9C4836]/30 rounded-xl shadow-2xl py-2 z-[100]">
                    <Link href="/admin/exchangerates" className="block px-4 py-2 text-xs text-gray-300 hover:bg-[#9C4836] hover:text-white transition-colors">
                      سعر الصرف اليومي (YER)
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* زر تسجيل الخروج الجانبي */}
          <button 
            onClick={handleAdminLogout} 
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#9C4836] border border-[#9C4836] hover:bg-[#9C4836] hover:text-white transition-all shadow-md active:scale-95"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">تسجيل الخروج</span>
          </button>
        </div>
      </nav>

      {/* حاوية المحتوى الرئيسي المحمية لتجنب تداخل العناصر */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {children}
      </main>
    </div>
  )
}