import { Building2, Copy } from 'lucide-react';
import Badge from 'react-bootstrap/Badge';

    export const PaymentApps = () => {
    return (
   <div className="flex flex-wrap items-center gap-4 mb-8 bg-white/5 p-4 rounded-3xl border border-white/5 justify-center md:justify-start">
    {[
        { id: 1, img: '/assests/payments/Kuraimi/kuraimi_logo.webp', name: 'الكريمي' },
        { id: 2, img: '/assests/payments/OneCash/oneCash.webp', name: 'ون كاش' },
        { id: 3, img: '/assests/payments/Mobile_mony/mobilemony.webp', name: 'موبايل موني' },
        { id: 4, img: '/assests/payments/Jawali/Jawali.webp', name: 'جوالي' },
        { id: 5, img: '/assests/payments/Jaib/Jaib.webp', name: 'جيب' }
    ].map((app) => (
        <div key={app.id} className="group/icon flex flex-col items-center gap-2">
            <div className="relative p-1 bg-white rounded-xl shadow-lg transition-all duration-300 group-hover/icon:scale-110 group-hover/icon:rotate-3">
                <img 
                    src={app.img} 
                    alt={app.name}
                    /* تكبير الحجم إلى w-10 (40px) بدلاً من w-8 */
                    className="w-10 h-10 md:w-12 md:h-12 object-contain transition-all duration-300 group-hover/icon:grayscale-0 grayscale-[0.5]"
                />
            </div>
            {/* إضافة اسم التطبيق بخط صغير جداً ليظهر بشكل أنيق تحت الأيقونة */}
            <span className="text-[8px] md:text-[10px] text-gray-500 font-bold opacity-0 group-hover/icon:opacity-100 md:opacity-100 transition-opacity">
                {app.name}
            </span>
        </div>
    ))}
</div>
    )
}

export const PaymentAppAccounts = ({ id, totaly }) => {
  return (
        /* قسم حسابات الدفع عبر التطبيقات - يظهر فقط إذا كان الدفع عبر التطبيقات */
    <div className="mt-8 pt-8 border-t border-white/5 print:border-gray-100">
      <div className="mb-8">
    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3 alexandria-h2 print:text-black">
        <Building2 className="w-6 h-6 text-[#B85A45]" />
        خطوات الدفع عبر التطبيقات
    </h3>

    {/* عبارة التوجيه الجديدة بتصميم احترافي */}
      <div className="mt-6 p-4 bg-white/5 border border-[#B85A45]/20 rounded-2xl flex items-center justify-between group print:border-gray-200">
    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
     <div className="flex items-start gap-3 ">
                 <div className="bg-[#B85A45] p-2 rounded-xl shadow-lg shadow-[#B85A45]/20">
                    <i className="bi bi-whatsapp text-white text-lg"></i>
                </div>
                <p className='font-bold'> 1 : الخطوة الأولى</p>
                <p className="text-gray-200 text-sm leading-relaxed ">
                    
                 إيداع المبلغ 
                 <Badge><b>{totaly}</b></Badge>
                     على أحد حساباتنا الموضحة في الأسفل 
                   .

                </p>
                   

            </div>
        </div>
        </div>
</div>
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {/* بنك الكريمي */}
          <div className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-[#B85A45]/40 transition-all duration-300 print:bg-gray-50 print:border-gray-200">
    {/* التغيير هنا: flex-col للجوال و flex-row للشاشات المتوسطة وما فوق */}
    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
        
        {/* قسم البيانات النصية */}
        <div className="flex-1 w-full">
            <div className="bg-white w-fit p-2 rounded-xl mb-4 mx-auto md:mx-0">
                <img src="/assests/payments/Kuraimi/kuraimi_logo.webp" className="h-6 object-contain" alt="الكريمي" />
            </div>
            
            <div className="text-center md:text-right">
                <p className="text-[10px] text-gray-500 uppercase mb-1">المستفيد</p>
                        <p className="font-bold text-white text-sm mb-4 print:text-black leading-tight">شركة امباير تايراتي لخدمات تسويق الاطارات </p>
            </div>
          
            <div className="bg-black/40 p-3 rounded-2xl border border-white/5 print:bg-white print:border-gray-200">
                <p className="text-[9px] text-gray-500 mb-1">رقم الحساب المميز</p>
                <div className="flex items-center justify-between">
                    <span className="font-black text-xl text-[#B85A45] tracking-widest">944681</span>
                    <button onClick={() => navigator.clipboard.writeText('944681')} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 print:hidden">
                        <Copy size={14} />
                    </button>
                </div>
            </div>
        </div>

        {/* قسم الـ QR Code - سينزل للأسفل في الجوال ويصبح في المنتصف */}
  
            <div className="flex flex-col items-center gap-2">
                        <div className="bg-white p-2 rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                            <img 
                                 src="/assests/payments/Tyraty.comQRpay/tyraty.comkirimiQRpay.jpeg"
                                className="w-20 h-20" 
                                alt="QR Code" 
                            />
                        </div>
                        <span className="text-[9px] text-gray-500 font-bold">امسح للدفع</span>
                    </div>
    </div>
</div>
    
            {/* ون كاش  */}
    <div className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-[#B85A45]/40 transition-all duration-300 print:bg-gray-50 print:border-gray-200">
    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
                    <div className="flex-1">
                        <div className="bg-white w-fit p-2 rounded-xl mb-4">
                            <img src="/assests/payments/OneCash/OneCash.webp" className="h-6 object-contain" alt="التضامن" />
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase mb-1">المستفيد</p>
                        <p className="font-bold text-white text-sm mb-4 print:text-black leading-tight">شركة إمباير لخدمات الإطارات</p>
                        
                        <div className="bg-black/40 p-3 rounded-2xl border border-white/5 print:bg-white print:border-gray-200">
                            <p className="text-[9px] text-gray-500 mb-1">رقم الحساب</p>
                            <div className="flex items-center justify-between">
                                <span className="font-black text-xl text-[#B85A45] tracking-widest">163710694</span>
                                <button onClick={() => navigator.clipboard.writeText('163710694')} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 print:hidden">
                                    <Copy size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
    
                    {/* QR Code الحساب */}
                 
                <div className="flex flex-col items-center gap-2">
                        <div className="bg-white p-2 rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                            <img 
                                src="/assests/payments/Tyraty.comQRpay/tyraty.comOneCashQRpay.jpeg"
                                className="w-20 h-20" 
                                alt="QR Code" 
                            />
                        </div>
                        <span className="text-[9px] text-gray-500 font-bold">امسح للدفع</span>
                    </div>

                </div>
            </div>
              {/* موبايلي   */}
            <div className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-[#B85A45]/40 transition-all duration-300 print:bg-gray-50 print:border-gray-200">
             <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
                    <div className="flex-1">
                        <div className="bg-white w-fit p-2 rounded-xl mb-4">
                            <img src="/assests/payments/Mobile_mony/mobilemony.webp" className="h-6 object-contain" alt="الكريمي" />
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase mb-1">المستفيد</p>
                        <p className="font-bold text-white text-sm mb-4 print:text-black leading-tight">شركة إمباير لخدمات الإطارات</p>
                        
                        <div className="bg-black/40 p-3 rounded-2xl border border-white/5 print:bg-white print:border-gray-200">
                            <p className="text-[9px] text-gray-500 mb-1">رقم النقطة </p>
                            <div className="flex items-center justify-between">
                                <span className="font-black text-xl text-[#B85A45] tracking-widest">944681</span>
                                <button onClick={() => navigator.clipboard.writeText('944681')} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 print:hidden">
                                    <Copy size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
    
                    {/* QR Code الحساب */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-white p-2 rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                            {/* يمكنك استبدال الرابط بـ QR Code حقيقي */}
                            <img 
                                src={`/assests/payments/Tyraty.comQRpay/Mobile_mony.jpeg`} 
                                className="w-20 h-20" 
                                alt="QR Code" 
                            />
                        </div>
                        <span className="text-[9px] text-gray-500 font-bold">امسح للدفع</span>
                    </div>
                </div>
            </div>
    
            {/* ون كاش  */}
            <div className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-[#B85A45]/40 transition-all duration-300 print:bg-gray-50 print:border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
                    <div className="flex-1">
                        <div className="bg-white w-fit p-2 rounded-xl mb-4">
                            <img src="/assests/payments/Jaib/Jaib.webp" className="h-6 object-contain" alt="التضامن" />
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase mb-1">المستفيد</p>
                        <p className="font-bold text-white text-sm mb-4 print:text-black leading-tight">شركة إمباير لخدمات الإطارات</p>
                        
                        <div className="bg-black/40 p-3 rounded-2xl border border-white/5 print:bg-white print:border-gray-200">
                            <p className="text-[9px] text-gray-500 mb-1">رقم الحساب</p>
                            <div className="flex items-center justify-between">
                                <span className="font-black text-xl text-[#B85A45] tracking-widest">8285585</span>
                                <button onClick={() => navigator.clipboard.writeText('8285585')} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 print:hidden">
                                    <Copy size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
    
                    {/* QR Code الحساب */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="bg-white p-2 rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                            <img 
                                src="/assests/payments/Tyraty.comQRpay/Jaib.jpeg" 
                                className="w-20 h-20" 
                                alt="QR Code" 
                            />
                        </div>
                        <span className="text-[9px] text-gray-500 font-bold">امسح للدفع</span>
                    </div>
                </div>
            </div>
        </div>
    
        <div className="mt-6 p-4 bg-white/5 border border-[#B85A45]/20 rounded-2xl flex items-center justify-between group print:border-gray-200">
    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
     <div className="flex items-start gap-3 ">
                 <div className="bg-[#B85A45] p-2 rounded-xl shadow-lg shadow-[#B85A45]/20">
                    <i className="bi bi-whatsapp text-white text-lg"></i>
                </div>
                <p className='font-bold'> 2 : الخطوة الثانية</p>
                <p className="text-gray-200 text-sm leading-relaxed ">
                   قم بإرسال "صورة إشعار الإيداع" عبر الواتساب لتأكيد طلبك.
                </p>
                      {/* زر واتساب السريع */}
            <a 
                href={`https://wa.me/967784584000?text=تحية طيبة، مرفق لكم إشعار تحويل للطلب رقم: ${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-[#25D366]/10"
            >
                <i className="bi bi-whatsapp"></i>
                إرسال الإشعار الآن
            </a>
            </div>
        </div>
        </div>

    </div>
  )
}

