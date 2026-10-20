import React from 'react';
import { ShieldCheck } from 'lucide-react';

const ElectronicSeal = ({ date }) => {
    const displayDate = date || new Date().toLocaleDateString('en-GB');
    return (
        <div className="absolute top-[15%] left-10 z-50 pointer-events-none select-none print:opacity-40">
            {/* حاوية الحركة - تأثير الختم (Scale + Rotate) */}
            <div className="animate-seal-drop transform -rotate-12">
                <div className="w-32 h-32 md:w-40 md:h-40 border-4 border-double border-[#B85A45] rounded-full flex flex-col items-center justify-center text-center p-2 relative bg-[#B85A45]/5 backdrop-blur-[1px]">
                    
                    {/* الدائرة الداخلية */}
                    <div className="absolute inset-1 border border-[#B85A45] rounded-full"></div>
                    
                    <span className="text-[#B85A45] font-black text-[10px] md:text-[12px] uppercase tracking-tighter mb-1 alexandria-h2">
                        Empire Tiraty
                    </span>
                    
                    <div className="bg-[#B85A45] text-white px-2 py-0.5 rounded text-[8px] md:text-[10px] font-bold mb-1 shadow-sm">
                        ORIGINAL PRODUCT
                    </div>
                    
                    <span className="text-[#B85A45] font-bold text-[8px] md:text-[10px] alexandria-h2">
                        مستند معتمد
                    </span>
                    
                    <span className="text-[#B85A45] text-[7px] md:text-[9px] mt-1 font-mono font-bold">
                        {displayDate}
                    </span>

                    {/* أيقونة التحقق */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <ShieldCheck size={60} className="text-[#B85A45]" />
                    </div>
                </div>
            </div>

            {/* تعريف الحركة في CSS (يمكنك وضعه في ملف الـ CSS الخاص بك أو استخدام التاج أدناه) */}
            <style jsx>{`
                @keyframes sealDrop {
                    0% {
                        transform: scale(3) rotate(0deg);
                        opacity: 0;
                        filter: blur(10px);
                    }
                    70% {
                        transform: scale(0.9) rotate(-15deg);
                        opacity: 1;
                        filter: blur(0px);
                    }
                    100% {
                        transform: scale(1) rotate(-12deg);
                        opacity: 0.25; /* الشفافية النهائية على المتصفح */
                    }
                }
                .animate-seal-drop {
                    animation: sealDrop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    animation-delay: 0.5s; /* تأخير بسيط ليبدأ بعد تحميل الصفحة */
                }
                @media print {
                    .animate-seal-drop {
                        animation: none !important;
                        opacity: 0.5 !important;
                        transform: rotate(-12deg) scale(1) !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ElectronicSeal;