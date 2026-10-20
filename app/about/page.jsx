'use client';

import React from 'react';
import Image from 'next/image'; // تأكد أنك تستخدم هذا المكون لجميع الصور
import { ShieldCheck, Target, Award, Mail, Phone, MapPin, Briefcase, Users2 } from 'lucide-react';

export default function AboutPage() {
  const trustFeatures = [
    { icon: ShieldCheck, title: "ضمان الجودة", desc: "ننتقي إطار سيارتك من كبرى العلامات التجارية العالمية وفحص المواصفات لضمان أمانك الكامل والحصول على أفضل منتج." },
    { icon: Target, title: "رؤيتنا المستدامة", desc: "أن نكون الوجهة الرقمية الموثوقة الأولى لكل سائق يبحث عن الثقة، الأمان، توفير الوقت، المنتج الأفضل، والسعر العادل ." },
    { icon: Award, title: "التزام وقيم", desc: "نلتزم في امباير تايراتي بالقيم المجتمعية في كافة المعاملات، وتفاصيل خدماتنا." }
  ];

  const teamMembers = [
    {
      name: "م. حمدي أبوبكر",
      role: "  الدعم الفني والإطارات",
      bio: "خبرة تتجاوز 6 سنوات في تقييم جودة الإطارات وملاءمتها للمناخ وتضاريس الطرق اليمنية.",
      img: "/assets/team-1.jpg"  // 🛠️ تم تصحيح الإملاء من assests إلى assets
    },
    {
      name: "أ. ماجد اليعبري",
      role: "مسؤول إدارة طلبات العملاء ",
      bio: "مسؤول عن متابعة طلباتكم وضمان تقديم تجربة سريعة وموثوقة تليق بعملاء تايراتي.",
      img: "/assets/team-2.jpg"   // 🛠️ تم تصحيح الإملاء
    },
    {
      name: "أ. أسامة حيدر",
      role: "مندوب التوصيل",
      bio: "يتأكد من مطابقة شروط التخزين وتاريخ الإنتاج والمواصفات  لكل إطار قبل خروجه من المخازن، وفقاً لبطاقة المواصفات المستخرجة من سوق امباير تايراتي.",
      img: "/assets/team-3.jpg"   // 🛠️ تم تصحيح الإملاء
    }
  ];

  const consultantsMembers = [
    {
      name: "م. حمدي أبوبكر",
      role: "خبير تسويق تقني",
      bio: "خبرة تتجاوز 6 سنوات في السوق الإلكتروني والمبيعات وانظمة المتاجر الإلكترونية .",
      img: "/assets/team-1.jpg"  // 🛠️ تم تصحيح الإملاء من assests إلى assets
    },
    {
      name: "أ. عبيد مشهور ",
      role: "مستشار تسويق",
      bio: "مستشار تسويق بخبرة 15 سنة في ...",
      img: "/assets/team-2.jpg"   // 🛠️ تم تصحيح الإملاء
    },
    {
      name: "أ. محمد عدوان",
      role: "مستشار تسويق ومبيعات ",
      bio: "مستشار تسويق ومبيعات بخبرة 12 سنة في عدة شركات",
      img: "/assets/team-3.jpg"   // 🛠️ تم تصحيح الإملاء
    }
  ];
  return (
    <main className="bg-[#141414] text-[#F4F1EA] min-h-screen py-16 px-4 sm:px-6 font-sans relative overflow-hidden" dir="rtl">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#9C4836]/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-[#d4a843]/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <header className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-[#d4a843] bg-[#d4a843]/10 px-3 py-1.5 rounded-full uppercase">إمباير تايراتي</span>
          <h1 className="text-4xl md:text-5xl font-black mt-4 mb-4 text-[#F4F1EA]">
            قصة <span className="text-[#9C4836]">تايراتي</span> وتطلعاتنا
          </h1>
          <div className="w-16 h-1 bg-[#9C4836] mx-auto rounded-full" />
        </header>

        {/* Trust Grid */}
        <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-24">
          {trustFeatures.map((item, i) => (
            <div key={i} className="bg-[#1e1e1e] border border-white/5 p-8 rounded-2xl hover:border-[#9C4836]/40 transition-all duration-300 shadow-xl group">
              <div className="w-12 h-12 rounded-xl bg-[#9C4836]/10 flex items-center justify-center mb-6 group-hover:bg-[#9C4836]/20 transition-colors">
                <item.icon className="text-[#d4a843]" size={28} />
              </div>
              <h3 className="text-lg font-bold mb-3 text-[#F4F1EA] group-hover:text-[#d4a843] transition-colors">{item.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>
{/* المستشارين */}
<section className="mb-24">
  <div className="text-center mb-16">
    <span className="text-xs font-bold tracking-widest text-[#d4a843] bg-[#d4a843]/10 px-3 py-1.5 rounded-full uppercase mb-4 inline-block">
      نخبة الخبراء
    </span>
    <h2 className="text-3xl md:text-4xl font-black text-center text-[#F4F1EA] mb-4">
      مستشارو <span className="text-[#9C4836]">تايراتي</span>
    </h2>
    <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
      فريق من الخبراء المتخصصين جاهزون لتقديم الاستشارات المهنية ومساعدتك في اختيار الإطار المثالي لسيارتك
    </p>
  </div>

  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {consultantsMembers.map((member, index) => (
      <div 
        key={index} 
        className="group relative bg-gradient-to-b from-[#1c1c1c] to-[#141414] border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center shadow-xl hover:shadow-2xl hover:shadow-[#9C4836]/5 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
      >
        {/* تأثير خلفية عند التمرير */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#9C4836]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* صورة مع إطار مميز */}
        <div className="relative mb-6">
          <div className="absolute -inset-1 bg-gradient-to-br from-[#9C4836] to-[#d4a843] rounded-full opacity-20 group-hover:opacity-40 blur-sm transition-opacity duration-500" />
          <div className="relative w-32 h-32 rounded-full border-[3px] border-[#9C4836]/30 overflow-hidden bg-[#141414] group-hover:border-[#9C4836]/60 transition-colors duration-500">
            <Image
              src={member.img}
              alt={member.name}
              fill
              sizes="128px"
              className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
            />
          </div>
          {/* شارة التوفر */}
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-[3px] border-[#1c1c1c] rounded-full" title="متاح للاستشارة" />
        </div>

        {/* المحتوى */}
        <div className="relative z-10">
          <h3 className="text-lg font-black text-[#F4F1EA] mb-1 group-hover:text-[#d4a843] transition-colors duration-300">
            {member.name}
          </h3>
          
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <Briefcase size={12} className="text-[#9C4836]" />
            <span className="text-xs font-bold text-[#d4a843] bg-[#9C4836]/10 border border-[#9C4836]/20 px-3 py-1 rounded-full">
              {member.role}
            </span>
          </div>

          <p className="text-gray-400 text-xs leading-relaxed font-medium mb-6 px-2">
            {member.bio}
          </p>

          {/* أزرار التواصل */}
          <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            <a 
              href={`https://wa.me/967784584000`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300"
              title="تواصل عبر واتساب"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <a 
              href={`mailto:${member.email || 'support@tyraty.com'}`}
              className="w-10 h-10 rounded-xl bg-[#d4a843]/10 border border-[#d4a843]/20 flex items-center justify-center text-[#d4a843] hover:bg-[#d4a843] hover:text-white transition-all duration-300"
              title="إرسال بريد إلكتروني"
            >
              <Mail size={16} />
            </a>
            <button 
              className="w-10 h-10 rounded-xl bg-[#9C4836]/10 border border-[#9C4836]/20 flex items-center justify-center text-[#9C4836] hover:bg-[#9C4836] hover:text-white transition-all duration-300 cursor-pointer"
              title="طلب استشارة"
            >
              <Phone size={16} />
            </button>
          </div>
        </div>

        {/* رقم الترتيب */}
        <div className="absolute top-4 left-4 text-[4rem] font-black text-white/[0.03] leading-none select-none">
          0{index + 1}
        </div>
      </div>
    ))}
  </div>
</section>
        {/* Leadership */}
        <section className="bg-gradient-to-br from-[#1c1c1c] to-[#121212] border border-[#9C4836]/20 rounded-3xl p-6 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-24 shadow-2xl">
          {/* 🛠️ تم استبدال img بـ Image الخاصة بـ Next.js وإصلاح المسار */}
   <div className="w-44 h-44 md:w-56 md:h-56 rounded-full border-4 border-[#9C4836]/40 overflow-hidden flex-shrink-0">
  <Image 
    src="/assests/employees/hamdi/" 
    alt="حمدي السقاف"
    width={224}  
    height={224}  
    className="object-cover w-full h-full"
    priority
  />
</div>
          <div className="text-center md:text-right">
            <h2 className="text-2xl md:text-3xl font-black mb-1.5 text-[#d4a843]">حمدي ابوبكر عبدالله السقاف</h2>
            <p className="text-sm text-[#9C4836] font-bold mb-4 tracking-wide">المدير التنفيذي لـ تايراتي</p>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base bg-black/10 p-4 rounded-xl border border-white/5 font-medium">
              "نفهم واقعنا وأرضنا وسوقنا، لذلك التزمنا بتوفير حل وفر لعملاء امباير تايراتي الوقت، المال وحصلوا على المنتج الأفضل والسعر العادل وتجربة شراء ملهمة ومميزة..."
            </p>
          </div>
        </section>

        {/* Team */}
        <section className="mb-24">
          <div className="flex items-center gap-3 justify-center mb-12">
            <Users2 size={24} className="text-[#9C4836]" />
            <h2 className="text-2xl md:text-3xl font-black text-center text-[#F4F1EA]">فريق الدعم خلف إطاراتك</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-5 flex flex-col items-center text-center shadow-lg hover:translate-y-[-4px] transition-transform duration-300">
                <div className="relative w-28 h-28 rounded-full border-2 border-[#d4a843]/30 overflow-hidden mb-4 bg-[#141414]">
                  <Image
                    src={member.img}
                    alt={member.name}
                    fill
                    sizes="112px"
                    className="object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h3 className="text-base font-bold text-[#F4F1EA] mb-1">{member.name}</h3>
                <span className="text-[11px] font-bold bg-[#9C4836]/10 text-[#d4a843] border border-[#9C4836]/20 px-2.5 py-1 rounded-full mb-3 flex items-center gap-1">
                  <Briefcase size={12} /> {member.role}
                </span>
                <p className="text-gray-400 text-xs leading-relaxed font-medium px-2">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#1e1e1e] p-8 md:p-10 rounded-2xl border border-white/5 text-center shadow-xl">
          <h3 className="text-xl md:text-2xl font-black mb-6 text-[#F4F1EA]">تواصل مباشر مع فريق الدعم والإدارة</h3>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-xs font-bold text-gray-300">
            <a href="mailto:support@tyraty.com" className="flex items-center gap-2 hover:text-[#9C4836] transition-colors bg-black/20 px-4 py-2 rounded-xl border border-white/5">
              <Mail size={16} className="text-[#d4a843]" /> support@tyraty.com
            </a>
            <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl border border-white/5">
              <Phone size={16} className="text-[#d4a843]" /> +967 784584000
            </div>
            <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl border border-white/5">
              <MapPin size={16} className="text-[#d4a843]" /> صنعاء، الجمهورية اليمنية
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}