'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingBag, Calendar, Package, CheckCircle2, Info, 
  ArrowLeft, ArrowRight, CreditCard, Truck, Clock 
} from 'lucide-react';

// مكون Badge مخصص بدل React Bootstrap
const Badge = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-white/5 text-gray-400 border-white/5',
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    primary: 'bg-[#B85A45]/10 text-[#B85A45] border-[#B85A45]/20'
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-[10px] font-bold ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};

// مكون Card مخصص
const Card = ({ children, className = '' }) => (
  <div className={`bg-[#121212] border border-white/5 rounded-[2rem] overflow-hidden shadow-xl transition-all duration-500 ${className}`}>
    {children}
  </div>
);

export default function ShoppingCartPage() {
  const router = useRouter();
  const params = useParams();
  
  // بدل Redux - يمكن استبدالها لاحقاً بـ Zustand أو Context API
  const [customerInfo, setCustomerInfo] = useState({
    SignIn: true,
    SCustID: '12345',
    CustomerToken: 'token_here',
    phoneNumber: '967775955150',
    CustomerName: 'عميل تايراتي'
  });
  
  const [paymentState, setPaymentState] = useState({
    paymentState: 'success',
    cashpayMESSAGEDESC: 'سيتم التواصل معك خلال 24 ساعة لتأكيد موقع التوصيل'
  });
  
  const [lastOrderDetails] = useState(null);
  const priceSAR = params?.priceSAR || '0';

  const [Mypurchases, setMypurchases] = useState([]);
  const [loading, setLoading] = useState(true);

   const isLocalhost = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';
const localhost = 'http://localhost:5000';
const remoteserver = process.env.NEXT_PUBLIC_API_URL;
const server = isLocalhost ? localhost : remoteserver;

  useEffect(() => {
    if (customerInfo.SCustID) {
      getMyPurchases();
    }
  }, [customerInfo.SCustID]);

  const getMyPurchases = async () => {
    const headers = { 'Authorization': `Bearer ${customerInfo.CustomerToken}` };
    try {
      setLoading(true);
      const res = await axios.post(`${server}/fitchMyPurchases`, { 
        SCustID: customerInfo.SCustID 
      }, { headers });
      setMypurchases(res.data || []);
    } catch (error) {
      console.error('fitchMyPurchases error', error);
      setMypurchases([]);
    } finally {
      setLoading(false);
    }
  };

  // بيانات تجريبية للعرض
  const demoPurchases = [
    {
      productName: 'إطار ميشلان بريمير 205/55 R16',
      tiresize: '205/55 R16',
      invoiceDate: '2024-06-10',
      quantity: 4,
      AMOUNT: '2,400',
      status: 'قيد التجهيز',
      statusColor: 'warning',
      image: '/assets/tires/michelin-premier.jpg'
    },
    {
      productName: 'إطار بريجستون تورانزا 225/45 R17',
      tiresize: '225/45 R17',
      invoiceDate: '2024-05-28',
      quantity: 2,
      AMOUNT: '1,800',
      status: 'تم التوصيل',
      statusColor: 'success',
      image: '/assets/tires/bridgestone-turanza.jpg'
    }
  ];

  const displayPurchases = Mypurchases.length > 0 ? Mypurchases : demoPurchases;

  return (
    <main className="min-h-screen bg-[#0a0a0a] py-8 px-4 sm:px-6" dir="rtl">
      <div className="max-w-[800px] mx-auto">
        
        {/* زر العودة */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-sm group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          العودة للرئيسية
        </Link>

        {/* رسالة نجاح العملية */}
        <div className="mb-8 animate-fade-in">
          <div className="relative bg-gradient-to-b from-[#B85A45]/10 to-[#B85A45]/5 border border-[#B85A45]/20 rounded-[2.5rem] p-8 text-center shadow-[0_20px_60px_rgba(184,90,69,0.15)] overflow-hidden">
            {/* تأثير خلفية */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#B85A45]/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex p-4 bg-gradient-to-br from-[#B85A45] to-[#9C4836] rounded-full text-white mb-6 shadow-xl shadow-[#B85A45]/30 animate-bounce-slow">
                <CheckCircle2 size={36} strokeWidth={2.5} />
              </div>
              
              <h2 className="text-white font-black text-2xl md:text-4xl mb-3">
                تمت عملية الشراء بنجاح!
              </h2>
              
              <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                شكراً لثقتك بـ <span className="text-[#B85A45] font-bold">إمباير تايراتي</span>. 
                تم تسجيل طلبك وسيتواصل معك مندوبنا قريباً.
              </p>

              {/* تفاصيل الطلب السريعة */}
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-xl border border-white/5">
                  <CreditCard size={14} className="text-[#B85A45]" />
                  <span className="text-xs text-gray-300">{priceSAR} ر.س</span>
                </div>
                <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-xl border border-white/5">
                  <Clock size={14} className="text-[#B85A45]" />
                  <span className="text-xs text-gray-300">رقم الطلب: #ORD-{Math.floor(Math.random() * 10000)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ملاحظات التوصيل */}
          <div className="mt-4 flex items-start gap-3 bg-white/[0.03] p-5 rounded-2xl border border-white/[0.06] backdrop-blur-sm">
            <div className="p-2 bg-[#B85A45]/10 rounded-xl shrink-0">
              <Info size={18} className="text-[#B85A45]" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs mb-1">تعليمات التوصيل</h4>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                {paymentState.cashpayMESSAGEDESC || "تفاصيل التوصيل موجودة في التعليمات أدناه، يرجى إبقاء هاتفك متاحاً لتأكيد الموقع."}
              </p>
            </div>
          </div>
        </div>

        <hr className="border-white/5 my-10" />

        {/* سجل المشتريات */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="text-right">
              <h3 className="text-white font-black text-xl md:text-2xl flex items-center gap-3">
                <div className="p-2 bg-[#B85A45]/10 rounded-xl">
                  <ShoppingBag className="text-[#B85A45]" size={24} />
                </div>
                سجل مشترياتي
              </h3>
              <p className="text-gray-500 text-xs mt-2">تتبع وإدارة جميع طلباتك السابقة</p>
            </div>
            
            {!customerInfo.SignIn && (
              <Badge variant="warning" className="text-[10px]">
                سجل الزوار (محدود)
              </Badge>
            )}
          </div>

          {loading ? (
            // حالة التحميل
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-[#121212] border border-white/5 rounded-[2rem] p-6 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-white/5 rounded w-1/2" />
                      <div className="h-3 bg-white/5 rounded w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayPurchases.length > 0 ? (
            <div className="space-y-6">
              {displayPurchases.map((val, i) => (
                <Card key={i} className="group hover:border-[#B85A45]/20 hover:shadow-2xl hover:shadow-[#B85A45]/5">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      
                      {/* تفاصيل المنتج */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="relative w-16 h-16 bg-white/5 rounded-2xl overflow-hidden border border-white/5 shrink-0">
                            <Image
                              src={val.image || '/assets/tires/placeholder.jpg'}
                              alt={val.productName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-white font-black text-base md:text-lg mb-1 leading-tight">
                              {val.productName}
                            </h4>
                            <span className="text-[11px] text-gray-500 font-mono tracking-widest bg-white/5 px-2 py-1 rounded-lg">
                              {val.tiresize}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-4">
                          <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-2 rounded-xl border border-white/[0.05]">
                            <Calendar size={14} className="text-gray-600" />
                            <span className="text-gray-400 text-[11px]">{val.invoiceDate}</span>
                          </div>
                          
                          <Badge variant="default">
                            الكمية: {val.quantity}
                          </Badge>
                          
                          <Badge variant={val.statusColor || 'default'}>
                            {val.status || 'قيد المعالجة'}
                          </Badge>
                        </div>
                      </div>

                      {/* السعر والحالة */}
                      <div className="flex flex-col items-end justify-between md:border-r border-white/5 md:pr-8 pt-4 md:pt-0">
                        <div className="text-right mb-4">
                          <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest block mb-2">
                            إجمالي المبلغ
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-white tracking-tight">{val.AMOUNT}</span>
                            <span className="text-sm text-[#B85A45] font-bold">ر.س</span>
                          </div>
                        </div>
                        
                        <button className="flex items-center gap-2 text-[11px] text-gray-500 hover:text-white transition-all duration-300 group/btn">
                          <span className="group-hover/btn:text-[#B85A45] transition-colors">عرض التفاصيل الكاملة</span>
                          <ArrowRight size={14} className="group-hover/btn:translate-x-[-4px] group-hover/btn:text-[#B85A45] transition-all" />
                        </button>
                      </div>

                    </div>
                  </div>
                  
                  {/* شريط التقدم التفاعلي */}
                  <div className="px-6 pb-6">
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            val.status === 'تم التوصيل' 
                              ? 'bg-green-500 w-full' 
                              : val.status === 'قيد التجهيز' 
                                ? 'bg-[#B85A45] w-1/3' 
                                : 'bg-[#d4a843] w-2/3'
                          }`}
                        />
                      </div>
                      <Truck size={14} className="text-gray-600" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* حالة عدم وجود مشتريات */
            <div className="text-center py-20 bg-gradient-to-b from-white/[0.03] to-transparent rounded-[3rem] border border-dashed border-white/10">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={32} className="text-gray-600" />
              </div>
              <h5 className="text-gray-400 font-bold text-lg mb-2">لا يوجد سجل مشتريات حالياً</h5>
              <p className="text-gray-600 text-xs max-w-xs mx-auto mb-6">
                سجل دخولك أو ابدأ بالتسوق الآن لتظهر طلباتك هنا
              </p>
              <Link 
                href="/products"
                className="inline-flex items-center gap-2 bg-[#B85A45] hover:bg-[#9C4836] text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg shadow-[#B85A45]/20"
              >
                تصفح المنتجات
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>

        {/* الفوتر الصغير */}
        <footer className="mt-16 text-center border-t border-white/5 pt-8">
          <p className="text-[10px] text-gray-600">
            © {new Date().getFullYear()} إمباير تايراتي - جميع الحقوق محفوظة
          </p>
        </footer>
      </div>
    </main>
  );
}