// app/shop/orderconfirmation/page.jsx
"use client"

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { 
  FaBoxOpen, FaUserCircle, FaMapMarkedAlt, FaUserLock,
  FaCreditCard, FaCheckCircle, FaExclamationTriangle, 
  FaArrowRight, FaBlog, FaWhatsapp, FaPrint, FaDownload, 
  FaAward, FaRoad, FaMountain 
} from 'react-icons/fa'
import { toPng } from 'html-to-image'
import html2canvas from 'html2canvas'
import { 
  Home, CheckCircle, MessageCircle, Globe, Clock, Sparkles,
  Fuel, VolumeX, Award, Hash, ExternalLink, TrendingUp, Shield,
  Package, MapPin, Gauge, Thermometer, Wind, Droplets, Activity,
  Layers, Calendar, Info, Weight, Construction, ArrowRight, X,
  Printer, CreditCard, User, Phone, Zap, Grid3X3, Truck, ShieldCheck,
  Building2, Copy
} from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import Swal from 'sweetalert2'
import { resetPaymentStatus, resetPaymentState } from '../../redux/slices/payementSlice'
import { sendOrderToWhatsApp } from '../../services/WhatsApp'
import TyratyLogo from '../../../components/assets/TyratyLogo'
import PaymentSection from '../../pay/PaymentSection'
import InstallationChoice from '../../pay/InstallationChoice'
import Invoice from '../../pay/Invoice'
import Link from 'next/link'
import Image from 'next/image'

// ═══════════════════════════════════════════════════════════
// Main Content Component
// ═══════════════════════════════════════════════════════════
function OrderConfirmationContent() {
  const router = useRouter()
  const dispatch = useDispatch()
  const searchParams = useSearchParams()

  // ✅ جلب البيانات من Query Params (للزوار)
  const queryType = searchParams.get('type')
  const queryOrderId = searchParams.get('orderId')
  const queryFullName = searchParams.get('fullName')
  const queryPhoneNumber = searchParams.get('phoneNumber')
  const queryGuestCity = searchParams.get('Guest_city')
  const queryTireSize = searchParams.get('tireSize')
  const queryProductName = searchParams.get('productName')
  const queryTotal = searchParams.get('total')

  // ✅ جلب كل البيانات من Redux
  const getCustomerInfo = useSelector((state) => state.CustomerAccount)
  const { 
    SignIn, SCustID, CustomerId, CustomerToken, 
    statusLogin, errorLogin, CustomerEmail, 
    phoneNumber, CustomerName, AddressStreet, AddressCity 
  } = getCustomerInfo


  const { localagents, orderBasketlist, lastOrderDetails, product_id,amount } = useSelector((state) => state.basket)
  const currentOrderId = useSelector((state) => state.PaymentPaySlice.currentOrderId)

  const getPaymentState = useSelector((state) => state.PaymentPaySlice)
  const { 
    isSuccess, paymentData, error, paymentSuccess,
    cashpayMESSAGEDESC, OperationStatusCashPayment 
  } = getPaymentState

  // Refs
  const invoiceRef = useRef()
  const cardRef = useRef()

  // State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showSpecs, setShowSpecs] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Reset payment state on mount
  useEffect(() => {
    dispatch(resetPaymentState())
  }, [dispatch])

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // ✅ تحديد مصدر البيانات: Redux أولاً، ثم Query Params للزوار
  const isGuestCheckout = queryType === 'GuestOnDelevery' || (!SignIn && queryOrderId)
  
  // ✅ استخدام البيانات من Redux أو Query Params
  const orderData = {
    id: currentOrderId || queryOrderId || Date.now().toString(),
    type: queryType || lastOrderDetails?.paymentMethod || 'GuestOnDelevery',
    fullName: CustomerName || queryFullName || lastOrderDetails?.customer?.name || 'زائر',
    phoneNumber: phoneNumber || queryPhoneNumber || lastOrderDetails?.customer?.phone || '',
    city: AddressCity || queryGuestCity || lastOrderDetails?.customer?.city || '',
    street: AddressStreet || lastOrderDetails?.customer?.street || '',
    tireSize: queryTireSize || lastOrderDetails?.tiresize || '',
    productName: queryProductName || lastOrderDetails?.items?.[0]?.productName || '',
    total: Number(queryTotal) || lastOrderDetails?.totalPrice || 0,
    amount: lastOrderDetails?.finalPrice || Number(queryTotal) || 0,
    quantity: lastOrderDetails?.quantity || 1,
    paymentMethod: lastOrderDetails?.paymentMethod || 'دفع عند الاستلام',
    items: lastOrderDetails?.items || [],
    brand: lastOrderDetails?.brand?.[0] || null,
    tireSpec: lastOrderDetails?.tireSpec || null
  }

  // ✅ حماية الصفحة: إذا لم يوجد طلب
  if (!lastOrderDetails && !queryOrderId) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white" dir="rtl">
        <div className="text-center">
          <p className="text-gray-400 mb-4">لا يوجد طلبات حالية</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-[#B85A45] text-white px-6 py-3 rounded-xl font-bold"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    )
  }

  // Print handler
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `فاتورة-${orderData.id}`,
    onAfterPrint: () => Swal.fire('تمت الطباعة!', '', 'success')
  })

  const Print = () => setIsModalOpen(true)

  // ✅ Order details للفاتورة
  const orderDetails = {
    id: orderData.id,
    date: Date.now(),
    status: "قيد التجهيز",
    amount: orderData.amount,
    total: orderData.total,
    totalAmountYE: orderData.total,
    paymentMethod: orderData.paymentMethod,
    customer: {
      name: orderData.fullName,
      email: CustomerEmail || lastOrderDetails?.customer?.email || '',
      address: `${orderData.city}، ${orderData.street}`,
      phone: orderData.phoneNumber
    },
    items: [
      {
        id: orderData.items[0]?.product_id,
        name: `${orderData.productName} ${orderData.tireSize}`,
        quantity: orderData.quantity,
        price: orderData.amount,
        total: orderData.total,
      },
    ],
    brand: orderData.brand,
    tireSpec: orderData.tireSpec
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return new Date().toLocaleDateString('ar-SA', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    }
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  // Download image handler
  const handleDownloadImage = async () => {
    const element = cardRef.current
    if (!element) return

    try {
      await document.fonts.ready
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#0f0f0f",
        scale: 2,
        logging: false,
        onclone: (clonedDoc) => {
          const actionButtons = clonedDoc.querySelector('.flex.gap-4.no-print')
          if (actionButtons) actionButtons.style.display = 'none'

          const compressedTexts = clonedDoc.querySelectorAll('.tracking-tighter, .tracking-wide, .tracking-widest')
          compressedTexts.forEach(textElement => {
            textElement.classList.remove('tracking-tighter')
            textElement.style.letterSpacing = 'normal'
          })

          const texts = clonedDoc.querySelectorAll('#printable-invoice *')
          texts.forEach(text => {
            text.style.color = 'white'
            text.style.fontFamily = "'Alexandria', sans-serif"
          })
        }
      })

      const dataUrl = canvas.toDataURL("image/png", 1.0)
      const link = document.createElement('a')
      link.download = `Tyraty-Specs-${orderDetails.brand?.brandName || 'tire'}.png`
      link.href = dataUrl
      link.click()

    } catch (err) {
      console.error('Error with html2canvas:', err)
      Swal.fire('خطأ', 'حدث خطأ أثناء حفظ الصورة', 'error')
    }
  }

  // Tread type helper
  const getTreadType = (specifics) => {
    if (!specifics) return null
    if (specifics.asymmetrical) {
      return {
        name: "نقشة غير متماثلة",
        en: "Asymmetrical",
        icon: <Layers className="w-5 h-5 text-purple-400" />,
        desc: "أداء فائق في المنعطفات وتشتيت المياه"
      }
    }
    if (specifics.directional) {
      return {
        name: "نقشة اتجاهية",
        en: "Directional",
        icon: <Wind className="w-5 h-5 text-blue-400" />,
        desc: "ثبات ممتاز في السرعات العالية والأجواء الماطرة"
      }
    }
    if (specifics.symmetrical) {
      return {
        name: "نقشة متماثلة",
        en: "Symmetrical",
        icon: <Grid3X3 className="w-5 h-5 text-gray-400" />,
        desc: "هدوء عالي وعمر افتراضي أطول للإطار"
      }
    }
    return null
  }

  // Badge component
  const Badge = ({ icon, label, value, color }) => {
    const colors = {
      blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      red: "bg-red-500/10 text-red-400 border-red-500/20",
      gray: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    }

    return (
      <div className={`px-2 py-1 ${colors[color]} border rounded-lg text-[10px] font-bold flex items-center gap-1.5`}>
        {icon}
        <span>{label}: {value}</span>
      </div>
    )
  }

  // BrandSpecificationCard component
  const BrandSpecificationCard = ({ brand, specifics }) => {
    const [isHovered, setIsHovered] = useState(false)
    const tread = getTreadType(specifics)

    if (!brand || !specifics) {
      return (
        <div className="p-12 text-center bg-[#0f0f0f] rounded-[2rem] border-2 border-dashed border-white/10">
          <Shield className="w-16 h-16 mx-auto mb-4 text-white/20" />
          <p className="text-gray-400">عذراً، تفاصيل المواصفات غير مكتملة</p>
        </div>
      )
    }

    const isQuiet = specifics.noiseClass && parseInt(specifics.noiseClass) <= 71
    const hasHighStability = 
      (specifics.traction === 'A' || specifics.traction === 'AA') || 
      (specifics.MaxSpeed && parseInt(specifics.MaxSpeed) > 240)
    const isFuelEfficient = specifics.fuelEfficiency === 1 || specifics.fuelEfficiency === "1"

    return (
      <>
        <div 
          id="printable-invoice" 
          ref={cardRef}
          className="w-full max-w-sm mx-auto group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          dir="rtl"
        >
          <div className="relative bg-[#0f0f0f] rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-[#B85A45]/30">

            {/* شارة الترتيب العالمي */}
            <div className="absolute top-0 right-0 z-20 flex items-center gap-2 px-4 py-2 bg-gradient-to-l from-[#B85A45] to-[#E27D60] rounded-bl-[1.5rem] shadow-lg">
              <Award className="w-4 h-4 text-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-tighter">
                الترتيب #{brand.BrandValueRanking} عالمياً
              </span>
            </div>

            <div className="p-6">
              {/* اللوجو والاسم */}
              <div className="text-center mb-6 pt-4">
                <div className="relative w-24 h-24 mx-auto mb-4 group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-[#B85A45]/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-full h-full p-3 bg-white rounded-full shadow-xl flex items-center justify-center">
                    <img 
                      src={`https://images.weserv.nl/?url=${encodeURIComponent(brand.brandLogo)}`}
                      alt={brand.brandName}
                      crossOrigin="anonymous"
                      className="max-w-full max-h-full object-contain w-auto h-auto" 
                    />
                  </div>
                </div>

                <h2 className="text-xl font-black text-white mb-1 tracking-tighter">
                  {brand.brandNameAr || brand.brandName}
                </h2>
                <br />
                <div className="flex justify-center items-center gap-2">
                  <span className="px-3 py-0.5 text-[10px] text-[#B85A45] bg-[#B85A45]/10 rounded-full font-bold border border-[#B85A45]/20">
                    {brand.brandName}
                  </span>
                  <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                  <span className="text-[11px] text-gray-400 font-medium tracking-wide flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {brand.COO || brand.madeIn}
                  </span>
                </div>
              </div>

              {/* وصف الإطار */}
              <p className="text-[11px] text-gray-500 text-center mb-6 leading-relaxed bg-white/5 p-2 rounded-xl">
                إطار <span className="text-white font-bold">{brand.brandName}</span> مقاس <span className="text-[#B85A45] font-bold">{specifics.tiresize}</span> 
                <br /> النقشة: <span className="text-gray-300 italic">{specifics.productName}</span>
              </p>

              {/* شبكة المواصفات */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-black/40 border border-white/5 rounded-2xl flex flex-col items-center justify-center group-hover:bg-[#B85A45]/5 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Weight className="w-4 h-4 text-[#B85A45]" />
                    <span className="text-[10px] font-bold text-gray-500 italic">الحمولة القصوى</span>
                  </div>
                  <span className="text-sm font-black text-white">
                    {specifics.Maxload ? `${specifics.Maxload} كجم` : 'N/A'}
                  </span>
                </div>

                <div className="p-3 bg-black/40 border border-white/5 rounded-2xl flex flex-col items-center justify-center group-hover:bg-[#B85A45]/5 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Gauge className="w-4 h-4 text-[#B85A45]" />
                    <span className="text-[10px] font-bold text-gray-500 italic">مؤشر السرعة</span>
                  </div>
                  <span className="text-sm font-black text-white">
                    {specifics.MaxSpeed ? `${specifics.MaxSpeed} كم/س` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* المواصفات التقنية */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-[#B85A45] uppercase tracking-[0.2em] text-center border-b border-white/5 pb-2">Technical Specs</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {specifics.traction && (
                    <Badge icon={<Droplets size={12}/>} label="التماسك" value={specifics.traction} color="blue" />
                  )}
                  {specifics.temperature && (
                    <Badge icon={<Thermometer size={12}/>} label="الحرارة" value={specifics.temperature} color="red" />
                  )}
                  {specifics.treadwear && (
                    <Badge icon={<Layers size={12}/>} label="تآكل المداس" value={specifics.treadwear} color="gray" />
                  )}
                  {specifics.noiseClass && (
                    <Badge icon={<Wind size={12}/>} label="الضجيج" value={`${specifics.noiseClass} dB`} color="purple" />
                  )}
                  {specifics.Depthoftread && (
                    <Badge icon={<Layers size={12}/>} label="عمق الدعسة" value={`${specifics.Depthoftread} mm`} color="orange" />
                  )}
                </div>
              </div>

              {/* المميزات الذكية */}
              {(isQuiet || hasHighStability || isFuelEfficient) && (
                <div className="px-6 py-4 bg-white/[0.02] border-t border-b border-white/5">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 text-center tracking-[0.2em]">المميزات المعتمدة</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {isQuiet && (
                      <div className="flex flex-col items-center p-3 rounded-2xl bg-black/40 border border-blue-500/20 w-24">
                        <VolumeX className="w-6 h-6 text-blue-400 mb-1 animate-pulse" />
                        <span className="text-[9px] font-bold text-gray-300">هدوء تام</span>
                      </div>
                    )}
                    {hasHighStability && (
                      <div className="flex flex-col items-center p-3 rounded-2xl bg-black/40 border border-red-500/20 w-24">
                        <Zap className="w-6 h-6 text-red-500 mb-1" />
                        <span className="text-[9px] font-bold text-gray-300 text-center leading-tight">ثبات رياضي عالي</span>
                      </div>
                    )}
                    {isFuelEfficient && (
                      <div className="flex flex-col items-center p-3 rounded-2xl bg-black/40 border border-green-500/20 w-24">
                        <Fuel className="w-6 h-6 text-green-500 mb-1" />
                        <span className="text-[9px] font-bold text-gray-300">موفر للوقود</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {tread && (
                <div className="mb-6 p-4 bg-white/5 rounded-[1.5rem] border border-white/5 relative overflow-hidden group/tread">
                  <div className="absolute -left-4 -top-4 w-12 h-12 bg-[#B85A45]/10 rounded-full blur-xl group-hover/tread:bg-[#B85A45]/20 transition-colors"></div>
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="p-3 bg-black rounded-xl border border-white/10 shadow-inner">
                      {tread.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-white">{tread.name}</span>
                        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-tighter">({tread.en})</span>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-relaxed italic">{tread.desc}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* زر الموقع الرسمي */}
              <div className="mt-8">
                <button className="w-full py-3 bg-[#B85A45] text-white text-xs font-black rounded-xl hover:bg-[#a04e3c] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#B85A45]/20">
                  <span>زيارة الموقع الرسمي</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>

            {/* التذييل */}
            <div className="bg-black/50 p-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 p-1 rounded-md">
                  <TyratyLogo />
                </div>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Empire Tyraty</span>
              </div>
              <span className="text-[9px] text-gray-600 font-mono">ID: TY-{brand.brand_id || '0000'}</span>
            </div>

            <div className="p-4 border-t border-white/5 flex items-center justify-between opacity-50">
              <div className="text-[10px] text-gray-500">
                <p>امباير تايراتي</p>
                <p>Tyraty.com © {new Date().getFullYear()}</p>
              </div>
              <div className="text-[10px] text-[#B85A45] font-bold">
                <p>الْتِزَامٌ وَقِيَم مدفوع بالأداء</p>
              </div>
            </div>
          </div>

          {/* أزرار الحفظ */}
          <div className="flex gap-4 no-print mt-6">
            <button 
              onClick={handleDownloadImage} 
              className="flex-1 flex items-center justify-center gap-2 !bg-[#1a1a1a] hover:!bg-[#252525] !text-white border border-white/10 hover:border-[#B85A45] py-4 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg group"
            >
              <FaDownload className="text-[#B85A45] group-hover:scale-110 transition-transform" /> 
              <span>حفظ كصورة</span>
            </button>
          </div>
        </div>
      </>
    )
  }

  // OrderConfirmation2 Component (للأعضاء والدفع السريع)
  const OrderConfirmation2 = () => {
    return (
      <div className="min-h-screen bg-[#0a0a0a] font-sans antialiased text-gray-200" dir="rtl">
        {/* Floating Header */}
        <div className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/5 py-4 mb-8 print:hidden">
          <br /><br /><br />
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center px-2">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-white m-0 pr-4">تأكيد الطلب</h1>
                <p className="text-[10px] text-[#B85A45] font-bold">إمباير تايراتي - التزام بالأداء</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={Print}
                  className="inline-flex items-center px-6 py-2.5 bg-[#B85A45] rounded-xl font-bold shadow-lg hover:bg-[#a04e3c] transition-all active:scale-95"
                >
                  <Printer size={18} className="ml-2" />
                  طباعة الفاتورة
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="relative bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-xl shadow-2xl border border-gray-200">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-500 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 z-[1001] shadow-sm"
              >
                <span className="text-xl font-bold">✕</span>
              </button>
              <Invoice 
                orderDetails={orderDetails} 
                onClose={() => setIsModalOpen(false)} 
              />
              <div className="pb-10 flex justify-center">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-10 py-2.5 rounded-lg font-bold transition-colors"
                >
                  خروج والعودة للمتجر
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="min-h-screen bg-gray-50 sm:px-6 lg:px-12 font-sans" dir="rtl">
          <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
            <h1 className="text-2xl font-black">تأكيد الطلب</h1>
            <button 
              onClick={Print}
              className="inline-flex items-center px-6 py-2.5 bg-[#B85A45] rounded-xl font-bold shadow-lg hover:bg-[#a04e3c] transition-all active:scale-95"
            >
              <Printer size={18} className="ml-2" />
              طباعة الفاتورة PDF
            </button>
          </div>

          {/* Invoice */}
          <div className="max-w-4xl mx-auto bg-[#0f0f0f] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/5 print:shadow-none print:border-gray-200 print:rounded-none print:bg-white">

            {/* Status */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4 bg-white/5 p-3 rounded-2xl border border-white/5 print:text-black">
              <div className="flex gap-6">
                <span className="text-[11px] text-gray-400">📅 {formatDate(orderDetails.date)}</span>
                <span className="text-[11px] text-gray-400">💳 {orderDetails.paymentMethod}</span>
                <span className="text-[11px] text-[#B85A45] font-bold">● مكتمل</span>
              </div>
              <span className="text-[10px] font-mono text-gray-500">REF: #ORD-{orderDetails.id}</span>
            </div>

            <InstallationChoice orderId={currentOrderId} customerphone={orderDetails.customer.phone} />

            {/* Customer Info */}
            <div className="p-10 pt-0 print:text-black">
              {SignIn && (
                <div className="print-me mb-4 border-b border-white/5 pb-6 print:border-gray-200" ref={invoiceRef}>
                  <h3 className="text-sm font-bold text-white border-r-2 border-[#B85A45] pr-2 mb-4 print:text-black">
                    بيانات العميل
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5 print:border-gray-100">
                      <div className="p-2 bg-[#B85A45]/10 rounded-lg">
                        <User className="w-4 h-4 text-[#B85A45]" />
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-500 leading-none mb-1 uppercase">العميل</p>
                        <p className="font-bold text-gray-200 text-sm print:text-black leading-none truncate">
                          {orderDetails.customer.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5 print:border-gray-100">
                      <div className="p-2 bg-[#B85A45]/10 rounded-lg">
                        <Phone className="w-4 h-4 text-[#B85A45]" />
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-500 leading-none mb-1 uppercase">رقم التواصل</p>
                        <p className="font-bold text-gray-200 text-sm print:text-black leading-none dir-ltr">
                          {orderDetails.customer.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5 print:border-gray-100">
                      <div className="p-2 bg-[#B85A45]/10 rounded-lg">
                        <MapPin className="w-4 h-4 text-[#B85A45]" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[9px] text-gray-500 leading-none mb-1 uppercase">العنوان</p>
                        <p className="font-bold text-gray-200 text-sm print:text-black leading-none truncate">
                          {orderDetails.customer.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Table */}
              <div className="bg-[#0f0f0f] text-white p-6 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden" dir="rtl">
                <div className="order-items-section mb-6">
                  <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-2 text-[10px] text-gray-500 uppercase font-bold border-b border-white/5">
                    <div className="col-span-6">المنتج / الإطار</div>
                    <div className="col-span-2 text-center">الكمية</div>
                    <div className="col-span-2 text-center">السعر</div>
                    <div className="col-span-2 text-left">الإجمالي</div>
                  </div>

                  <div className="divide-y divide-white/5">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors print:py-2 print:text-black">
                        <div className="col-span-12 md:col-span-6 flex items-center gap-3">
                          <span className="text-[10px] text-[#B85A45] font-mono">0{index + 1}</span>
                          <div>
                            <p className="text-sm font-bold text-gray-200 print:text-black leading-tight">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-gray-500">{orderDetails.brand?.brandName} | {orderDetails.tireSpec?.tiresize}</p>
                          </div>
                        </div>
                        <div className="col-span-4 md:col-span-2 text-center">
                          <span className="md:hidden text-[9px] text-gray-600 block">الكمية:</span>
                          <span className="text-sm text-gray-300 font-medium">×{item.quantity}</span>
                        </div>
                        <div className="col-span-4 md:col-span-2 text-center">
                          <span className="md:hidden text-[9px] text-gray-600 block">سعر الوحدة:</span>
                          <span className="text-sm text-gray-400">{item.price} <small>ر.س</small></span>
                        </div>
                        <div className="col-span-4 md:col-span-2 text-left font-bold text-[#B85A45] text-sm">
                          <span className="md:hidden text-[9px] text-gray-600 block">المجموع:</span>
                          {item.total} <small>ر.س</small>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="mt-4 flex flex-col items-end px-4">
                    <div className="w-full md:w-64 space-y-2 pt-3 border-t border-[#B85A45]/20">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>المجموع الفرعي:</span>
                        <span className="text-gray-300">{orderDetails.amount} ر.س</span>
                      </div>
                      <div className="flex justify-between items-center bg-[#B85A45]/10 p-2 rounded-lg">
                        <span className="text-xs font-bold text-[#B85A45]">الإجمالي النهائي:</span>
                        <div className="text-left">
                          <p className="text-lg font-black text-white leading-none">
                            {orderDetails.total}
                          </p>
                          <p className="text-[8px] text-[#B85A45] uppercase tracking-wider">ريال يمني</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  <div className="bg-[#0f0f0f] text-white p-6 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden" dir="rtl">
                <div className="order-items-section mb-6"></div>
                <PaymentSection orderId={orderDetails.id} total={orderDetails.total} />
                  </div>
                {/* WhatsApp Location */}
                <div className="flex flex-col gap-3 mt-6">
                  <p>ارسال موقعك الحالي الى مندوب التوصيل</p>
                  <button
                    type="button"
                    onClick={() => sendOrderToWhatsApp(orderDetails)}
                    className="w-full py-4 rounded-xl bg-[#25D366] text-white font-black flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all shadow-lg"
                  >
                    <FaWhatsapp className="text-2xl" />
                    ارسال موقعي الحالي (واتساب)
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-6 text-center border-t border-gray-100 print:block hidden">
              <p className="text-gray-500 text-sm">شكراً لتسوقكم معنا!</p>
            </div>
          </div>

          {/* Back to shop */}
          <div className="max-w-4xl mx-auto mt-8 flex flex-col sm:flex-row gap-4 justify-center print:hidden">
            <Link 
              href="/#myDIV" 
              className="flex-1 bg-white text-black hover:bg-gray-50 border border-gray-300 px-8 py-3.5 rounded-lg font-bold transition-all duration-200 flex justify-center items-center shadow-sm hover:shadow-md"
            >
              العودة للتسوق
              <ArrowRight className="w-5 h-5 mr-2" />
            </Link>
          </div>
        </div>

        {/* Specs Modal */}
        {showSpecs && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-gray-100 p-4 md:p-8 rounded-[2.5rem] shadow-2xl max-w-lg w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-800">
                  <Award className="inline-block ml-2 text-[#B85A45]" />
                  بطاقة الجودة والمواصفات
                </h3>
                <button 
                  onClick={() => setShowSpecs(false)}
                  className="bg-white/10 hover:bg-white/20 text-gray-800 w-10 h-10 rounded-full flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>
              <BrandSpecificationCard 
                brand={orderDetails.brand} 
                specifics={orderDetails.tireSpec} 
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  // GuestOrderConfirmation Component (للزوار والدفع عند الاستلام)
  const GuestOrderConfirmation = () => {
    return (
      <div className="min-h-screen bg-[#0a0a0a] font-sans antialiased text-gray-200" dir="rtl">
        <div className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/5 py-4 mb-8 print:hidden">
          <br /><br /><br />
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-white">تأكيد الطلب - زائر</h1>
                <p className="text-[10px] text-[#B85A45] font-bold">إمباير تايراتي</p>
              </div>
              <button 
                onClick={Print}
                className="inline-flex items-center px-6 py-2.5 bg-[#B85A45] rounded-xl font-bold shadow-lg hover:bg-[#a04e3c] transition-all"
              >
                <Printer size={18} className="ml-2" />
                طباعة
              </button>
            </div>
          </div>
        </div>
        <div className="flex max-w-4xl mx-auto px-4">
            <InstallationChoice orderId={currentOrderId} customerphone={orderDetails.customer.phone} />
        </div>

        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[#0f0f0f] rounded-[2.5rem] p-8 border border-white/5">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#B85A45]/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-[#B85A45]" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2">تم استلام طلبك بنجاح!</h2>
              <p className="text-gray-400">
                سيتم التواصل معك على الرقم: <span className="text-[#B85A45] font-bold">{orderData.phoneNumber}</span>
              </p>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-6">
              <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">ملخص الطلب</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">رقم الطلب:</span>
                  <span className="font-mono text-[#B85A45] font-bold">#{orderData.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">الاسم:</span>
                  <span className="text-white font-bold">{orderData.fullName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">المدينة:</span>
                  <span className="text-white font-bold">{orderData.city}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">المنتج:</span>
                  <span className="text-white font-bold">{orderData.productName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">المقاس:</span>
                  <span className="text-white font-bold">{orderData.tireSize}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <div>
                      <p className="text-white font-bold">{item.name}</p>
                      <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                    </div>
                    <p className="text-[#B85A45] font-bold">{item.total} ر.س</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-[#B85A45]/10 rounded-xl border border-[#B85A45]/20">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#B85A45]">الإجمالي النهائي:</span>
                  <span className="text-2xl font-black text-white">{orderData.total} ريال يمني</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-6">
              <h3 className="text-lg font-bold text-white mb-4">تعليمات الدفع عند الاستلام</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <p>• سيتواصل معك مندوبنا خلال دقائق  لتأكيد الطلب</p>
                <p>• يرجى ايداع المبلغ المطلوب على احدى حساباتنا التالية  </p>
                <p>• يمكنك الدفع عبر التحويل البنكي</p>
              </div>
            </div>
  <div className="bg-[#0f0f0f] text-white p-6 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden" dir="rtl">
                <div className="order-items-section mb-6"></div>
                    <PaymentSection orderId={orderDetails.id} total={orderDetails.total} />

                  </div>
            {/* Registration CTA */}
            <div className="mt-8 p-6 bg-gradient-to-r from-[#1a1a1a] to-[#252525] rounded-2xl border border-[#B85A45]/20">
              <h3 className="text-lg font-bold text-white mb-2">هل تريد حفظ بياناتك؟</h3>
              <p className="text-gray-400 text-sm mb-4">
                سجل حساباً لتتبع طلباتك ومشاهدة سجل مشترياتك وتنزيل بطاقة المواصفات .. 
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => router.push('/users/customeregister')}
                  className="flex-1 py-3 bg-[#B85A45] text-white rounded-xl font-bold hover:bg-[#a04e3c] transition-all"
                >
                  إنشاء حساب
                </button>
                <button 
                  onClick={() => router.push('/users/customerLogin')}
                  className="flex-1 py-3 border border-white/10 text-gray-300 rounded-xl font-bold hover:border-[#B85A45]/50 transition-all"
                >
                  تسجيل الدخول
                </button>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-8 text-center">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-[#B85A45] transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
                <span>العودة للرئيسية</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ✅ تحديد نوع الصفحة حسب البيانات المتوفرة
  const renderContent = () => {
    // إذا كان زائر ودفع عند الاستلام (من Query Params)
    if (isGuestCheckout) {
      return <GuestOrderConfirmation />
    }
    // إذا كان العضو مسجل دخول
    if (SignIn) {
      return <OrderConfirmation2 />
    }
    // افتراضي
    return <OrderConfirmation2 />
  }

  return renderContent()
}

// ═══════════════════════════════════════════════════════════
// Main Page Component with Suspense
// ═══════════════════════════════════════════════════════════

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B85A45] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">جاري تحميل تفاصيل الطلب...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}