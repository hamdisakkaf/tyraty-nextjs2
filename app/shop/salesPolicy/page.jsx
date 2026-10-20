'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, ShoppingCart, Award, Truck, 
  Lock, Gavel, FileText, ChevronDown, CheckCircle2 
} from 'lucide-react';

export default function SalesPolicyPage() {
  const [activeTab, setActiveTab] = useState(0);

  const toggleTab = (index) => {
    setActiveTab(activeTab === index ? null : index);
  };

  const sections = [
    {
      title: "سياسة الجودة",
      icon: ShieldCheck,
      description: "معايير صارمة لضمان أفضل منتج",
      content: [
        "يحصل العميل على المعلومات والبيانات الصحيحة والوافية عن السلعة أو الخدمة التي يشتريها.",
        "الحفاظ على صحة العميل وسلامته عند استعماله للسلعة وفقاً لقائمة البيانات المرفقة.",
        "الحصول على ضمان الجودة الموضح عند إبرام أي صفقة عبر موقع تايراتي إمباير.",
        "تقدم الحمدي لتجارة الإطارات المعلومات والبيانات الصحيحة والوافية عن خدماتها.",
        "للعميل الحق في الحصول على سلع مطابقة للمواصفات القياسية والتأكد من جودتها."
      ]
    },
    {
      title: "سياسة البيع والشراء",
      icon: ShoppingCart,
      description: "إجراءات آمنة وشفافة",
      content: {
        intro: "نلتزم في شركة إمباير تايراتي لتجارة الإطارات بإجراءات بيع واضحة وآمنة تضمن حقوقكم:",
        features: [
          "نماذج تسجيل دخول آمنة ومشفرة تماماً",
          "منتجات تجاوزت اختبارات المقاييس اليمنية",
          "ماركات عالمية بوكلاء معتمدين في اليمن",
          "معلومات موثقة للمقارنة قبل الشراء"
        ],
        invoice: {
          title: "بيانات الفاتورة الممنوحة للعميل:",
          items: [
            "اسم المحل", "تاريخ التعاقد", "السعر النهائي",
            "وصف السلعة", "حالة المنتج", "ميعاد التسليم",
            "السعر يشمل كافة الرسوم والضرائب الإضافية"
          ]
        }
      }
    },
    {
      title: "سياسة الضمان",
      icon: Award,
      description: "حماية شاملة لمدة سنة كاملة",
      content: [
        "ضمان جميع المنتجات لمدة سنة كاملة من أي خلل فني أو مصنعي.",
        "الضمان يتم عبر الوكيل المعتمد في الجمهورية اليمنية.",
        "تلتزم المؤسسة بمساعدة العميل في التحقق من صلاحية الضمان بالتنسيق مع الوكيل."
      ]
    },
    {
      title: "التوصيل والخدمات اللوجستية",
      icon: Truck,
      description: "توصيل سريع وآمن لجميع المناطق",
      content: [
        "التوصيل على حساب العميل ضمن نطاق عمل الشركة بعد إتمام الدفع الإلكتروني.",
        "المناطق خارج النطاق يتم التنسيق لشحنها بتكاليف إضافية عبر طرف ثالث.",
        "نلتزم بتوضيح اسم الناقل ووقت التوصيل المتوقع بدقة."
      ]
    },
    {
      title: "سياسة خصوصية وأمان البيانات",
      icon: Lock,
      description: "حماية قصوى لمعلوماتك",
      content: [
        "كلمات المرور مشفرة بالكامل ولا تطلع عليها حتى إدارة المؤسسة.",
        "لا يتم حفظ أي بيانات متعلقة ببطاقات الدفع البنكية نهائياً.",
        "حفظ البيانات (الاسم، العنوان، الهاتف) غرضه تحسين جودة التوصيل فقط.",
        "تطبيق أعلى المعايير الفنية لمنع أي وصول غير قانوني لقواعد البيانات."
      ]
    },
    {
      title: "النزاعات والشكاوى",
      icon: Gavel,
      description: "آلية فعالة لحل المشاكل",
      content: [
        "توفير نافذة شكاوى مباشرة عبر الموقع أو تطبيق واتساب.",
        "إطار زمني محدد وسريع للرد على كافة الاستفسارات والمعالجات.",
        "في حال رفض الوكيل للضمان، يتم اللجوء لجهة فحص طرف ثالث متخصصة.",
        "سياسة الاستبدال أو التعويض تخضع لسياسة الوكيل المحلي الموضحة في الموقع."
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans py-16 px-4 sm:px-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        {/* الرأس */}
        <header className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-[#B85A45]/5 blur-[100px] rounded-full pointer-events-none" />
          
          <Link href="/" className="inline-block mb-8 group">
            <div className="relative w-20 h-20 mx-auto opacity-80 group-hover:opacity-100 transition-opacity">
              <Image 
                src="/لوجو تايراتي tyrate - Opject-09.svg" 
                alt="لوجو تايراتي إمباير"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          
          <span className="inline-block text-xs font-bold tracking-widest text-[#B85A45] bg-[#B85A45]/10 px-4 py-1.5 rounded-full mb-4 uppercase">
            الوثيقة القانونية
          </span>
          
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            وثيقة <span className="text-[#B85A45]">الشروط والأحكام</span>
          </h1>
          
          <p className="text-gray-400 text-lg font-light">بِسْمِ اللّٰهِ الرَّحمن الرَّحيم</p>
          <div className="w-24 h-1 bg-gradient-to-l from-[#B85A45] to-[#d4a843] mx-auto mt-6 rounded-full" />
        </header>

        {/* المحتوى - Accordion */}
        <div className="space-y-3">
          {sections.map((section, index) => {
            const isActive = activeTab === index;
            const Icon = section.icon;
            
            return (
              <div 
                key={index}
                className={`group overflow-hidden transition-all duration-500 rounded-3xl border ${
                  isActive 
                    ? 'bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] border-[#B85A45]/40 shadow-2xl shadow-[#B85A45]/5' 
                    : 'bg-[#0a0a0a]/80 border-white/[0.04] hover:border-white/10 hover:bg-[#0f0f0f]'
                }`}
              >
                <button 
                  onClick={() => toggleTab(index)}
                  className="w-full p-6 flex items-center justify-between text-right gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#B85A45] text-white shadow-lg shadow-[#B85A45]/25' 
                        : 'bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-gray-300'
                    }`}>
                      <Icon size={22} strokeWidth={2} />
                    </div>
                    <div className="text-right">
                      <span className={`block text-lg font-bold transition-colors ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                      }`}>
                        {section.title}
                      </span>
                      <span className={`text-xs mt-1 transition-colors ${
                        isActive ? 'text-[#B85A45]' : 'text-gray-600'
                      }`}>
                        {section.description}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive ? 'bg-[#B85A45]/20' : 'bg-white/5'
                  }`}>
                    <ChevronDown 
                      size={18} 
                      className={`transition-transform duration-300 ${isActive ? 'rotate-180 text-[#B85A45]' : 'text-gray-600'}`} 
                    />
                  </div>
                </button>

                <div 
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isActive ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 pt-2 border-t border-white/[0.04]">
                    {Array.isArray(section.content) ? (
                      <ul className="space-y-3 mt-4">
                        {section.content.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-300 leading-relaxed">
                            <CheckCircle2 size={16} className="text-[#B85A45] mt-1 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="mt-4 space-y-6">
                        {/* المقدمة */}
                        <p className="text-gray-300 italic border-r-2 border-[#B85A45] pr-4 text-sm leading-relaxed">
                          {section.content.intro}
                        </p>
                        
                        {/* المميزات */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {section.content.features.map((feature, i) => (
                            <div 
                              key={i} 
                              className="flex items-center gap-2 bg-white/[0.03] p-3 rounded-xl border border-white/[0.05] text-sm text-gray-300"
                            >
                              <CheckCircle2 size={14} className="text-[#B85A45] flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                        </div>

                        {/* بيانات الفاتورة */}
                        <div className="bg-gradient-to-br from-black/40 to-[#0a0a0a] p-5 rounded-2xl border border-[#B85A45]/20">
                          <h4 className="flex items-center gap-2 mb-4 text-white font-bold text-sm">
                            <FileText size={16} className="text-[#B85A45]" />
                            {section.content.invoice.title}
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                            {section.content.invoice.items.map((item, i) => (
                              <span 
                                key={i} 
                                className={`flex items-center gap-1.5 ${
                                  i === section.content.invoice.items.length - 1 
                                    ? 'col-span-full text-[#B85A45] font-bold' 
                                    : 'text-gray-400'
                                }`}
                              >
                                <span className="w-1 h-1 rounded-full bg-[#B85A45]/60" />
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* التذييل */}
        <footer className="mt-12 text-center">
          <div className="bg-gradient-to-b from-white/[0.05] to-transparent p-8 rounded-3xl border border-white/[0.05] backdrop-blur-sm">
            <p className="text-sm text-gray-500 leading-relaxed max-w-lg mx-auto">
              تعتبر هذه الوثيقة عقداً ملزماً بين مؤسسة 
              <span className="text-[#B85A45] font-bold mx-1">إمباير تايراتي</span>
              وبين العميل بمجرد إتمام عملية الشراء من الموقع.
            </p>
            <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-gray-600">
              <span>© {new Date().getFullYear()} تايراتي إمباير</span>
              <span className="hidden sm:inline text-gray-800">|</span>
              <Link href="/" className="hover:text-[#B85A45] transition-colors">
                العودة للرئيسية
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}