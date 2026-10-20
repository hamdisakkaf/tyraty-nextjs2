import React from 'react';
import Link from 'next/link'
import Image from 'next/image';
import { FaArrowLeft, FaBookOpen } from 'react-icons/fa';

const SuggestedArticles = ({ suggestedPosts }) => {
  return (
    // تغيير الخلفية إلى الأسود العميق المعتمد في الموقع
    <section className="py-20 bg-[#050505] relative overflow-hidden">
      
      {/* إضافة وميض خلفي خفيف (Subtle Glow) لتعزيز الثيم الفاخر */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#B85A45]/5 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* العنوان الرئيسي بالثيم الداكن */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-1.5 h-10 bg-[#B85A45] rounded-full shadow-[0_0_15px_rgba(184,90,69,0.4)]"></div>
          <h3 className="text-3xl md:text-4xl font-black text-white font-alexandria tracking-tight">
            مقالات <span className="text-[#B85A45]">تهمك</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {suggestedPosts.map((sPost) => (
            <div key={sPost.post_id} className="group">
              <Link 
                href={`BlogPostPage/postDetails/section/${sPost.familyid}/title/${sPost.title}/postId/${sPost.post_id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="block h-full bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-[#B85A45]/40 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
              >
                {/* الجزء العلوي: الصورة */}
                <div className="relative h-60 overflow-hidden">
                  <Image 
                    src={sPost.postImage} 
                    alt={sPost.title}
                     fill
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* تظليل متدرج ذكي ليبرز النص */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent"></div>
                  
                  {/* وسم المدونة */}
                  <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                    <span className="text-[10px] text-[#B85A45] font-black uppercase tracking-[0.2em]">Tyrate Blog</span>
                  </div>
                </div>

                {/* الجزء السفلي: المحتوى */}
                <div className="p-8">
                  <h4 className="text-xl font-bold text-white mb-6 line-clamp-2 leading-tight group-hover:text-[#B85A45] transition-colors duration-300">
                    {sPost.title}
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#B85A45] font-black text-sm group-hover:gap-4 transition-all">
                      <span>اقرأ الآن</span>
                      <FaArrowLeft className="text-xs" />
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                      <FaBookOpen className="text-gray-500 text-sm" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* زر "استكشف المدونة" بالثيم النحاسي الداكن */}
        <div className="mt-20 flex justify-center">
          <a 
            href="/blog" 
            className="group relative inline-flex items-center gap-4 px-14 py-5 rounded-full bg-white/5 border border-white/10 text-white overflow-hidden transition-all hover:border-[#B85A45] hover:shadow-[0_0_30px_rgba(184,90,69,0.2)]"
          >
            <span className="absolute inset-0 w-0 bg-gradient-to-r from-[#B85A45] to-[#8f402e] transition-all duration-500 group-hover:w-full"></span>
            <span className="relative z-10 font-black text-sm uppercase tracking-widest">عرض كافة المقالات</span>
            <FaArrowLeft className="relative z-10 text-xs transition-transform group-hover:-translate-x-2" />
          </a>
        </div>

      </div>
    </section>
  );
};

export default SuggestedArticles;