"use client"

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from "next/navigation"
import Link from 'next/link'
import axios from 'axios'
import io from "socket.io-client"
// Redux Actions
import { 
  addToOrder, 
  exportOrder,
  updateOrderStatues, 
  fetchBrands, 
  fetchAgents, 
  fetchproductquantityInStore 
} from '../../../app/redux/slices/basketSlice'

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { 
  Gauge, Car, Sparkles, ArrowLeft, RefreshCw, Smartphone, 
  MapPin, Printer, CheckCircle, PackageOpen, DollarSign, 
  Calendar, Layers, ShieldCheck, User, Bell, Info
} from 'lucide-react';
import { X } from 'lucide-react'
import { Modal } from 'react-bootstrap'



import { ShieldLock, PersonPlus, BoxArrowInRight, Telephone, Lock } from 'react-bootstrap-icons'

// --- Configuration ---
const isLocalhostEnabled = process.env.NEXT_PUBLIC_ISLOCALHOST === 'false'
const localhost = process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:5001'
const remoteServer = process.env.NEXT_PUBLIC_API_URL || 'https://tyraty-server.onrender.com'
const server = isLocalhostEnabled ? localhost : remoteServer

// --- Sub-Component: Request Row ---
// ==========================================
// 1. المكون الفرعي المحدث: RequestRow
// ==========================================
const RequestRow = ({ val, brandLogos, localagent, onCheckStock, onProcessOrder, server }) => {
  const [approvedQty, setApprovedQty] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [showModal, setShowPrompt] = useState(false);

  const {
    rci_id, CustomerName,
    SCustID, customers_SCustID, tiresize, itemNo, 
    quantity, purchaseordercircle, AMOUNT, 
    invoiceDate, brands_brand_id,
    pay_point_Name,
    payPointLocation,
    installation_types_type_id,
    type_name_ar,
    service_fee,
    center_name_ar,
    address_details,
    contact_number,
    installation_map_url
  } = val;

  const agentsList = localagent?.flat() || [];
  const brandsList = brandLogos?.flat() || [];
  const currentBrand = brandsList.find(b => String(b.brand_id) === String(brands_brand_id));
  const currentAgent = agentsList.find(a => String(a.agentid) === String(currentBrand?.agents_agentid));

  const handleWhatsAppOrder = () => {
    const phone = currentAgent?.saleswatsappphone;
    if (!phone) {
      alert("رقم الواتساب غير متوفر لهذا الوكيل.");
      return;
    }
    const message = `*طلب جديد من تايراتي*%0A` +
                    `*رقم الفاتورة:* ${val.rci_id}%0A` +
                    `*الماركة:* ${currentBrand?.brandNameAr || 'غير محدد'}%0A` +
                    `*المقاس:* ${val.tiresize}%0A` +
                    `*الكمية:* ${val.quantity}`;

    const finalPhone = phone.startsWith('7') ? `967${phone}` : phone;
    window.open(`https://wa.me/${finalPhone}?text=${message}`, '_blank');
  };

  const handleSendToDeliveryRep = (e) => {
    if (e) e.preventDefault();

    if (!deliveryPhone) {
      alert("الرجاء إدخال رقم هاتف مندوب المبيعات أولاً.");
      return;
    }

    const message = `*بيانات توصيل طلب من تايراتي* 📍%0A%0A` +
                    `*رقم الطلب:* ${rci_id}%0A` +
                    `*اسم العميل:* ${CustomerName || 'غير معروف'}%0A` +
                    `*نوع الخدمة:* ${type_name_ar || 'غير محدد'}%0A` +
                    `*المقاس:* ${tiresize}%0A` +
                    `*الكمية:* ${quantity}%0A` +
                    `*رابط الموقع الجغرافي (Google Maps):* ${installation_map_url || 'لم يحدد العميل موقعه عبر الـ GPS'}`;

    const finalPhone = deliveryPhone.startsWith('7') ? `967${deliveryPhone}` : deliveryPhone;
    window.open(`https://wa.me/${finalPhone}?text=${message}`, '_blank');
  };

  return (
    <>
      <tr className="border-b border-[#F4F1EA]/5 hover:bg-[#F4F1EA]/5 transition-colors align-middle">
        {/* معرف الطلب */}
        <td className="p-4">
          <span className="px-2.5 py-1 text-xs font-mono font-bold bg-[#F4F1EA]/10 text-[#F4F1EA] rounded-md">
            #{rci_id}
          </span>
        </td>

        {/* العميل */}
        <td className="p-4 min-w-[150px]">
          <div className="flex flex-col">
            <span className="font-bold text-[#F4F1EA] text-sm">{customers_SCustID} {CustomerName || 'عميل غير معروف'}</span>
            <span className="text-xs text-[#F4F1EA]/50 font-mono mt-0.5">{SCustID}</span>
          </div>
        </td>

        {/* تفاصيل المنتج والبراند والوكيل */}
        <td className="p-4">
          <div className="flex items-center gap-3">
            {currentBrand ? (
              <>
                {currentBrand.brandLogo && (
                  <img src={currentBrand.brandLogo} alt="" className="w-9 h-9 object-contain bg-white/5 rounded-lg p-1" />
                )}
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-[#F4F1EA]">{currentBrand.brandNameAr}</span>
                  {currentAgent ? (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 text-[10px] font-medium bg-[#9C4836]/20 text-[#9C4836] rounded border border-[#9C4836]/20">
                        الوكيل: {currentAgent.agentARname}
                      </span>
                      <button 
                        onClick={handleWhatsAppOrder}
                        className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold flex items-center gap-1 transition-colors"
                      >
                        إرسال لـ واتساب
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-red-400 font-semibold mt-1">الوكيل غير مربوط</span>
                  )}
                </div>
              </>
            ) : (
              <span className="px-2 py-1 text-xs bg-red-900/20 text-red-400 rounded-md">ماركة غير معرفة</span>
            )}
          </div>
        </td>

        {/* نقطة البيع */}
        <td className="p-4">
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-[#F4F1EA]">{pay_point_Name}</span>
            <span className="text-xs text-[#F4F1EA]/60 mt-0.5">{payPointLocation}</span>
          </div>
        </td>

        {/* طريقة التوصيل */}
        <td className="p-4">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#F4F1EA]">{installation_types_type_id} {type_name_ar}</span>
              <span className="text-xs text-[#9C4836] font-bold mt-0.5">{service_fee} YER</span>
              <span className="text-[11px] text-[#F4F1EA]/40 truncate max-w-[180px] mt-0.5">
                {center_name_ar} {address_details} {contact_number}
              </span>
            </div>
            <button 
              onClick={() => setShowPrompt(true)} 
              className="px-2.5 py-1.5 bg-[#9C4836]/10 hover:bg-[#9C4836]/20 text-[#9C4836] rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            >
              <Info size={12} />
              استعلام
            </button>
          </div>
        </td>

        {/* المقاس */}
        <td className="p-4 font-mono text-sm text-[#F4F1EA]/80">{val.tiresize}</td>

        {/* الكمية المطلوبة */}
        <td className="p-4 text-center font-bold text-lg text-[#9C4836]">{val.quantity}</td>

        {/* سعر الوحدة */}
        <td className="p-4 font-mono text-sm text-[#F4F1EA]/80">{Number(val.AMOUNT).toLocaleString()}</td>

        {/* الإجمالي */}
        <td className="p-4 font-mono font-bold text-sm text-emerald-400">
          {(val.AMOUNT * val.quantity).toLocaleString()}
        </td>

        {/* التاريخ */}
        <td className="p-4 text-xs text-[#F4F1EA]/50 font-mono">{invoiceDate}</td>

        {/* إجراءات الموظف الفورية */}
        <td className="p-4 min-w-[180px]">
          <div className="flex flex-col gap-2">
            <input 
              type="number" 
              placeholder="الكمية المعتمدة" 
              value={approvedQty}
              onChange={(e) => setApprovedQty(e.target.value)}
              className="w-full text-center py-1.5 px-2 text-xs bg-[#2B2B2B] border border-[#F4F1EA]/10 rounded-lg text-[#F4F1EA] placeholder-[#F4F1EA]/30 focus:border-[#9C4836] focus:outline-none"
            />
            <div className="flex gap-1.5">
              <button 
                onClick={() => onCheckStock(val)}
                className="w-1/2 py-1.5 bg-transparent border border-[#9C4836] text-[#9C4836] hover:bg-[#9C4836]/10 rounded-lg text-xs font-bold transition-all"
              >
                فحص
              </button>
              <button 
                onClick={() => onProcessOrder(val)}
                className="w-1/2 py-1.5 bg-[#9C4836] hover:bg-[#7a382a] text-[#F4F1EA] rounded-lg text-xs font-bold transition-all shadow-md shadow-[#9C4836]/10"
              >
                إصدار
              </button>
            </div>
          </div>
        </td>
      </tr>

      {/* المودال الشفاف الفخم للتوصيل والموقع عبر الـ Tailwind */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowPrompt(false)}></div>
          
          <div className="relative w-full max-w-md bg-[#2B2B2B] border border-[#F4F1EA]/10 rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-fadeIn">
            {/* هيدر المودال */}
            <div className="flex items-center justify-between p-5 border-b border-[#F4F1EA]/5 bg-[#242424]">
              <h3 className="text-sm font-bold text-[#F4F1EA] text-center w-full">طريقة التوصيل والموقع الجغرافي</h3>
              <button 
                onClick={() => setShowPrompt(false)} 
                className="absolute left-4 p-1.5 text-[#F4F1EA]/50 hover:text-[#F4F1EA] rounded-full hover:bg-white/5 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* محتوى المودال */}
            <div className="p-6" dir="rtl">
              <div className="text-center mb-5">
                <div className="inline-flex p-3 rounded-full bg-[#9C4836]/10 mb-3 text-[#9C4836]">
                  <MapPin size={24} />
                </div>
                <p className="text-[#F4F1EA] font-bold text-sm mb-1">آلية الاستلام: {type_name_ar}</p>
                <p className="text-[#F4F1EA]/50 text-xs">رسوم الخدمة المضافة للعميل: {service_fee} ريال يمني</p>

                <div className="mt-4 p-3 bg-black/20 rounded-xl border border-[#F4F1EA]/5 text-right text-xs">
                  <span className="text-[#F4F1EA]/50 font-bold block mb-1.5">📍 الموقع المحدد من العميل (GPS):</span>
                  {installation_map_url ? (
                    <a href={installation_map_url} target="_blank" rel="noreferrer" className="text-cyan-400 break-all block underline hover:text-cyan-300">
                      {installation_map_url}
                    </a>
                  ) : (
                    <span className="text-amber-500 italic block">لم يقم العميل بالتقاط إحداثيات خرائط جوجل لهذا الطلب</span>
                  )}
                </div>
              </div>

              {/* فورم إرسال تفاصيل التوصيل للمندوب */}
              <form onSubmit={handleSendToDeliveryRep}>
                <div className="mb-5">
                  <label className="text-[#F4F1EA]/60 text-xs font-bold block mb-2">رقم هاتف مندوب المبيعات أو سائق التوصيل</label>
                  <input 
                    required 
                    type="tel" 
                    placeholder="77x xxx xxx" 
                    value={deliveryPhone}
                    onChange={(e) => setDeliveryPhone(e.target.value)}
                    className="w-full bg-black/40 border border-[#F4F1EA]/10 text-[#F4F1EA] rounded-xl py-3 text-center font-bold tracking-wider placeholder-[#F4F1EA]/20 focus:border-[#9C4836] focus:outline-none"
                    style={{ direction: 'ltr' }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold mb-3 shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] text-sm"
                >
                  إرسال تفاصيل الموقع والمقاس للمندوب (واتساب)
                </button>
              </form>

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-[#F4F1EA]/5"></div>
                <span className="mx-3 text-[#F4F1EA]/20 text-[11px] font-medium">خيارات لوجستية</span>
                <div className="flex-grow border-t border-[#F4F1EA]/5"></div>
              </div>

              <button 
                onClick={() => window.print()}
                className="w-full bg-[#F4F1EA]/5 border border-[#F4F1EA]/10 text-[#F4F1EA]/80 hover:text-[#F4F1EA] hover:bg-[#F4F1EA]/10 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
              >
                <Printer size={14} />
                طباعة كرت التوصيل والتركيب
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const notificationSound = new Audio("sounds/ding.mp3")
const socket = io.connect("https://tyraty-server.onrender.com")

// --- Main Component ---
const CustomersRetailRequests = () => {
  // ✅ Next.js: useRouter بدلاً من useNavigate
  const router = useRouter()
  const dispatch = useDispatch()

  const getCustomerInfo = useSelector((state) => state.CustomerAccount)
  const { SignIn, CustomerToken, statusLogin, errorLogin, CustomerEmail, phoneNumber } = getCustomerInfo

  const { userToken, adminEmail, branchName, storeAddress, SignInAdmin } = useSelector((state) => state.AdminAccount)
  const { localagents, orderBasketlist, productQuantityInStore } = useSelector((state) => state.basket)
  const [notifications, setNotifications] = useState([])


  const displayDesktopNotification = (message) => {
    console.log("حالة الإذن الحالية:", Notification.permission)

    if (!("Notification" in window)) {
        alert("هذا المتصفح لا يدعم إشعارات سطح المكتب")
    } 
    else if (Notification.permission === "granted") {
        const notify = new Notification("طلب شراء جديد 🛒", {
            body: message,
            icon: "/logo_tyrate.svg",
        })

        notify.onclick = () => {
            window.focus()
        }
        if ("vibrate" in navigator) {
            navigator.vibrate(500)
        }
    } 
    else {
        console.log("الإذن مرفوض أو لم يتم طلبه بعد")
    }
  }

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission()
      }
    }

    socket.on("receive_order_notification", (data) => {
      notificationSound.play().catch(error => {
        console.log("فشل تشغيل الصوت بسبب سياسة المتصفح: ", error)
      })
      console.log("إشعار جديد:", data)
      toast.success(data.message, {
        position: "top-right",
        autoClose: 5000,
      })
      displayDesktopNotification(data.message)
      setNotifications((list) => [data, ...list])
    })

    return () => {
      socket.off("receive_order_notification")
    }
  }, [])

  const [requestsList, setRequestsList] = useState([])
  const [brandLogos, setBrandLogos] = useState([])
  const [exchangeRates, setExchangeRates] = useState({ usd: 0, sar: 0 })
  const [loading, setLoading] = useState(false)

  // ✅ Next.js: router.push بدلاً من navigate
  useEffect(() => {
    if (!SignInAdmin) router.push('/adminlogin')
  }, [SignInAdmin, router])

  const fetchData = async () => {
    setLoading(true)
    try {
       dispatch(fetchBrands())
       dispatch(fetchAgents())
      await getBrandLogo()
      await fetchRequests()
      await fetchExchangeRates()
    } catch (err) {
      console.error("Error fetching initial data", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getBrandLogo = async () => {
    try {
      const res = await axios.get(`${server}/getbrandLogo`)
      setBrandLogos(res.data)
      console.log("Brands fetched:", res.data)
    } catch (error) {
      console.error("Error fetching brand logos:", error)
    }
  }

  const fetchRequests = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${userToken}` }
      const res = await axios.get(`${server}/fetch-customers-retail-requests`, { headers })
      console.log('setRequestsList res.data', res.data)
      setRequestsList(res.data)
    } catch (error) {
      console.error("Error fetching requests:", error)
    }
  }

  const fetchExchangeRates = async () => {
    try {
      const res = await axios.get(`${server}/getexchangeDolar`)
      if (res.data && res.data[0]) {
        setExchangeRates({
          usd: res.data?.[0]?.DolarexchangeRial,
          sar: res.data?.[0]?.KSAxchangeRial
        })
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error)
    }
  }

  const handleCheckStock = (productData) => {
    dispatch(fetchproductquantityInStore(productData))
  }

  const handleProcessOrder = (request, approvedQty) => {
    const finalQty = Number(approvedQty) || request.quantity
    const updatedList = requestsList.filter(item => item.rci_id !== request.rci_id)
    setRequestsList(updatedList)
    dispatch(updateOrderStatues(request.rci_id))
    dispatch(exportOrder({ ...request, quantity: finalQty }))
  }

  // ==========================================
// 2. المكون الرئيسي المحدث: Dashboard
// ==========================================
  return (
    <div className="bg-[#1e1e1e] min-vh-100 py-6 font-sans antialiased text-[#F4F1EA]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* شريط الإدارة العلوي (Header) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-[#F4F1EA]/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#9C4836]/10 text-[#9C4836]">
                <PackageOpen size={24} />
              </span>
              <h2 className="text-xl font-bold text-[#F4F1EA]">نظام إدارة وتوزيع طلبات التجزئة</h2>
            </div>
            <p className="text-xs text-[#F4F1EA]/50 mt-1 mr-10">
              فرع: <span className="text-[#F4F1EA] font-semibold">{branchName || 'الرئيسي'}</span> — العنوان: <span className="text-[#F4F1EA] font-semibold">{storeAddress}</span> | المسؤول: <span className="text-[#9C4836] font-mono">{adminEmail}</span>
            </p>
          </div>
          
          <Link href="/admin/Cusomersretailrequests/InvoiceReview" passHref legacyBehavior>
            <a className="inline-flex items-center gap-2 bg-[#F4F1EA]/5 hover:bg-[#F4F1EA]/10 text-[#F4F1EA] px-4 py-2 rounded-xl text-xs font-bold border border-[#F4F1EA]/10 transition-all self-start md:self-auto">
              <ArrowLeft size={16} />
              مراجعة الفاتورة الحالية
            </a>
          </Link>
        </div>

        {/* خط الاتصال الفوري بالسيرفر */}
        <div className="bg-[#2B2B2B] border border-[#F4F1EA]/5 rounded-xl p-3 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <p className="text-xs text-[#F4F1EA]/80 font-medium mb-0">
              حالة لوحة تحكم الموظفين: <span className="text-emerald-400 font-bold">متصل بالسيرفر المركزي ومستعد لاستقبال الطلبات الفورية</span>
            </p>
          </div>
          <span className="text-[10px] bg-black/30 font-mono px-2 py-0.5 rounded text-[#F4F1EA]/40">Node.js Sync</span>
        </div>

        {/* بطاقات الإحصائيات الفورية والمالية (Stats Grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* سعر صرف الدولار */}
          <div className="bg-[#2B2B2B] border border-[#F4F1EA]/5 rounded-2xl p-4 text-center shadow-md">
            <div className="flex items-center justify-between text-[#F4F1EA]/40 text-xs mb-2 font-medium">
              <span>سعر صرف الدولار</span>
              <DollarSign size={14} />
            </div>
            <h4 className="text-lg font-mono font-bold text-emerald-400">{exchangeRates.usd} <span className="text-[10px] text-[#F4F1EA]/40">YER</span></h4>
          </div>

          {/* سعر صرف السعودي */}
          <div className="bg-[#2B2B2B] border border-[#F4F1EA]/5 rounded-2xl p-4 text-center shadow-md">
            <div className="flex items-center justify-between text-[#F4F1EA]/40 text-xs mb-2 font-medium">
              <span>سعر صرف السعودي</span>
              <Layers size={14} />
            </div>
            <h4 className="text-lg font-mono font-bold text-emerald-400">{exchangeRates.sar} <span className="text-[10px] text-[#F4F1EA]/40">YER</span></h4>
          </div>

          {/* الطلبات الواردة والمعلقة */}
          <div className="bg-[#2B2B2B] border border-amber-500/20 rounded-2xl p-4 text-center shadow-md bg-gradient-to-br from-amber-500/[0.02] to-transparent">
            <div className="flex items-center justify-between text-amber-500/50 text-xs mb-2 font-medium">
              <span>الطلبات الجديدة المعلقة</span>
              <Smartphone size={14} />
            </div>
            <h4 className="text-2xl font-bold text-amber-400 font-mono">{requestsList.length} <span className="text-xs font-sans text-amber-500/60 font-normal">طلبات</span></h4>
          </div>

          {/* حالة فحص المخزون */}
          <div className="bg-[#2B2B2B] border border-cyan-500/20 rounded-2xl p-4 text-center shadow-md bg-gradient-to-br from-cyan-500/[0.02] to-transparent">
            <div className="flex items-center justify-between text-cyan-500/50 text-xs mb-2 font-medium">
              <span>المخزون الاحتياطي (آخر فحص)</span>
              <ShieldCheck size={14} />
            </div>
            <h4 className="text-lg font-bold text-cyan-400 font-mono">{productQuantityInStore || '—'}</h4>
          </div>
        </div>

        {/* سجل الإشعارات الفورية (Notifications Log) */}
        {notifications.length > 0 && (
          <div className="bg-[#2B2B2B] border border-[#F4F1EA]/5 rounded-2xl p-4 mb-8">
            <div className="flex items-center gap-2 text-xs font-bold text-[#F4F1EA]/60 mb-3 px-1">
              <Bell size={14} className="text-[#9C4836]" />
              <span>شريط الإشعارات اللوجستية الفورية:</span>
            </div>
            <ul className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {notifications.map((notif, index) => (
                <li key={index} className="p-3 bg-black/20 border border-[#F4F1EA]/5 rounded-xl text-xs flex justify-between items-center gap-4">
                  <div>
                    <strong className="text-amber-400 font-medium">{notif.message}</strong>
                    <span className="text-[#F4F1EA]/40 mx-2">|</span>
                    <span className="text-[#F4F1EA]/50">رقم الكود المرجعي للطلب: #{notif.orderId}</span>
                  </div>
                  <span className="text-[10px] text-[#F4F1EA]/30 font-mono bg-black/40 px-2 py-0.5 rounded flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(notif.timestamp).toLocaleTimeString('ar-YE')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* جدول تصفيف ومعالجة البيانات الأساسي (Data Table Container) */}
        <div className="bg-[#2B2B2B] border border-[#F4F1EA]/5 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 bg-[#242424] border-b border-[#F4F1EA]/5 flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#F4F1EA] flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-[#9C4836] rounded"></span>
              جدول طلبات التجزئة الواردة للمنصة
            </h3>
            <span className="text-[11px] font-medium bg-[#9C4836]/10 text-[#9C4836] px-2.5 py-1 rounded-full">
              تحديث تلقائي مفعّل
            </span>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-t-transparent border-[#9C4836] mb-3"></div>
                <p className="text-xs text-[#F4F1EA]/50 font-medium">جاري تحديث ومزامنة البيانات مع السيرفر...</p>
              </div>
            ) : (
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-black/20 border-b border-[#F4F1EA]/5 text-[#F4F1EA]/60 text-xs font-bold">
                    <th className="p-4 font-bold">المعرف</th>
                    <th className="p-4 font-bold">العميل</th>
                    <th className="p-4 font-bold">تفاصيل وإدارة الوكيل</th>
                    <th className="p-4 font-bold">نقطة القيد والبيع</th>
                    <th className="p-4 font-bold">آلية ومركز الاستلام</th>
                    <th className="p-4 font-bold">المقاس</th>
                    <th className="p-4 font-bold text-center">الكمية</th>
                    <th className="p-4 font-bold">سعر المفرد</th>
                    <th className="p-4 font-bold">الإجمالي</th>
                    <th className="p-4 font-bold">التاريخ</th>
                    <th className="p-4 font-bold text-center">خيارات التوزيع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F1EA]/5 text-xs">
                  {requestsList.length > 0 ? (
                    requestsList.map((val) => (
                      <RequestRow 
                        key={val.rci_id}
                        val={val}
                        brandLogos={brandLogos}
                        localagent={localagents}
                        onCheckStock={handleCheckStock}
                        onProcessOrder={handleProcessOrder}
                        server={server}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center py-16 text-[#F4F1EA]/40 font-medium italic">
                        سجل الطلبات فارغ، لا توجد طلبات معلقة بانتظار المعالجة حالياً.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
      <ToastContainer position="top-left" theme="dark" />
    </div>
  );
}

export default CustomersRetailRequests