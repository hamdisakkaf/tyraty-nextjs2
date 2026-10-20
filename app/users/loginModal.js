    export function loginModal () {
        return (
             <div className="bg-[#0f0f0f] border border-[#B85A45]/20 rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col items-center text-center group">
    {/* خلفية فنية خفيفة */}
    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#B85A45]/10 rounded-full blur-3xl"></div>
    
    {/* أيقونة جذابة */}
    <div className="mb-6 bg-white/5 p-5 rounded-full border border-white/10 text-[#B85A45] shadow-xl group-hover:scale-110 transition-transform duration-500">
      <FaUserLock size={40} />
    </div>

    {/* نصوص الحث */}
    <h3 className="text-xl font-black text-white mb-2 alexandria-h2">أهلاً بك في إمباير تايراتي </h3>
    <p className="text-gray-400 text-sm mb-8 max-w-[300px] leading-relaxed">
      يرجى تسجيل الدخول لعرض بيانات التوصيل الخاصة بك، وسجل المشتريات، والفواتير وإتمام الطلب بأمان وسرعة.
    </p>

    {/* زر الإجراء */}
    <button 
      //onClick={() => window.location.href = '/customerLogin'} // أو افتح مودال تسجيل الدخول
      onClick={loginModal}
      className="bg-[#B85A45] hover:bg-[#a04d3a] text-white px-10 py-3 rounded-full font-bold transition-all shadow-[0_10px_20px_rgba(184,90,69,0.2)] active:scale-95"
    >
      تسجيل الدخول الآن
    </button>

    <p className="mt-4 text-[10px] text-gray-600 uppercase tracking-widest">
      ليس لديك حساب؟ <a href="/useregister" className="text-[#B85A45] underline">انضم إلينا</a>
    </p>
  </div>
    )
}
