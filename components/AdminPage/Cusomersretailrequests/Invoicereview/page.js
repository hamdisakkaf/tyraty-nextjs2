"use client"

import { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { useRouter } from "next/navigation"
import { useReactToPrint } from "react-to-print"
import amountToArabicText from '../../../helpers/invoiceAmount'
import { 
  Save, Printer, Trash2, ArrowLeft, Info, Calendar, DollarSign, ArrowBigLeft
} from 'lucide-react'
import { 
  undoOrderState, emptyOrderState, Confirme_and_save_Invoice, clearOrderBasketlist 
} from '../../../../app/redux/slices/basketSlice'


const InvoiceReview = () => {
  const componentRef = useRef()
  const router = useRouter()
  const dispatch = useDispatch()

  // Redux State
  const { request_id, quantity, orderBasketlist, invoiceState } = useSelector((state) => state.basket)
  const { SignInAdmin } = useSelector((state) => state.AdminAccount)

  // Local State
  let [copyOrderBasketlist, setCopyOrderBasketlist] = useState(orderBasketlist)
  let [DolarexchangeRial, setDolarexchangeRial] = useState(0)
  let [RySaudixchangeRial, setRySaudixchangeRial] = useState(0)
  const [invoiseButton, setInvoiseButton] = useState(false)
  const [printEnabled, setPrintEnabled] = useState(true)

 const isLocalhost = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';
const localhost = 'http://localhost:5000';
const remoteserver = process.env.NEXT_PUBLIC_API_URL;
const server = isLocalhost ? localhost : remoteserver;

  // Effects
  useEffect(() => {
    if (!SignInAdmin) router.push('/adminlogin')
  }, [SignInAdmin, router])

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const res = await axios.get(`${server}/getexchangeDolar`)
        if (res.data && res.data.length > 0) {
          setDolarexchangeRial(res.data[0]?.DolarexchangeRial)
          setRySaudixchangeRial(res.data[0]?.KSAxchangeRial)
        }
      } catch (err) { 
        console.error("Error fetching rates", err) 
      }
    }
    fetchExchangeRates()
  }, [server])

  useEffect(() => { 
    setCopyOrderBasketlist(orderBasketlist) 
    console.log('copyOrderBasketlist:', copyOrderBasketlist)
  }, [orderBasketlist])

  // Actions
  const handlePrint = useReactToPrint({
    onBeforePrint: () => dispatch(clearOrderBasketlist()),
    content: () => componentRef.current,
  })

  const saveInvoice = () => {
    if (orderBasketlist.length > 0) {
      console.log('orderBasketlist:', orderBasketlist)
      dispatch(Confirme_and_save_Invoice(orderBasketlist))
      setPrintEnabled(false)
      setInvoiseButton(true)
    }
  }

  const undoOrderStatues = (req_id, total) => {
    dispatch(emptyOrderState({ req_id, total }))
    dispatch(undoOrderState(req_id))
  }

  // ✅ دالة العودة للصفحة السابقة
  const handleGoBack = () => {
    router.back()  // ← العودة للصفحة السابقة في التاريخ
    // أو يمكنك استخدام: router.push('/custretreqs') للعودة لصفحة محددة
  }

  return (
    <div className="bg-[#1e1e1e] min-h-screen py-6 font-sans antialiased text-[#F4F1EA]" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* شريط أدوات التحكم العلوي */}
        <div className="print:hidden bg-[#2B2B2B] border border-[#F4F1EA]/5 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xl">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* ✅ زر العودة للخلف */}
            <button 
              onClick={handleGoBack}
              className="flex items-center gap-1.5 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-[#F4F1EA] px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-[0.99]"
            >
              <ArrowBigLeft size={16} />
              العودة للطلبات
            </button>

            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-emerald-600/10 text-emerald-400 rounded-xl border border-emerald-600/10">
              <DollarSign size={13} />
              صرف السعودي: {RySaudixchangeRial} YER
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-[#9C4836]/10 text-[#9C4836] rounded-xl border border-[#9C4836]/10">
              <Info size={13} />
              الحالة: {invoiceState || 'جاهز للمراجعة'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              disabled={invoiseButton} 
              onClick={saveInvoice}
              className="flex items-center gap-1.5 bg-[#9C4836] hover:bg-[#7a382a] disabled:opacity-40 disabled:hover:bg-[#9C4836] text-[#F4F1EA] px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-[0.99]"
            >
              <Save size={14} />
              حفظ الفاتورة
            </button>
            <button 
              disabled={printEnabled} 
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-[0.99]"
            >
              <Printer size={14} />
              طباعة الفاتورة
            </button>
          </div>
        </div>

        {/* ورقة الفاتورة */}
        <div 
          ref={componentRef} 
          className="bg-[#2B2B2B] print:bg-white text-[#F4F1EA] print:text-black border border-[#F4F1EA]/5 print:border-0 rounded-3xl print:rounded-none p-6 md:p-10 shadow-2xl print:shadow-none transition-all"
        >
          {/* هيدر الفاتورة */}
          <div className="flex flex-row justify-between items-start border-b border-[#F4F1EA]/10 print:border-gray-200 pb-6 mb-6">
            <div className="flex flex-col">
              <img 
                src="/لوجو تايراتي tyrate - Opject-09.svg" 
                className="w-28 md:w-32 object-contain print:brightness-0" 
                alt="Logo" 
              />
              <h2 className="text-lg md:text-xl font-black text-[#9C4836] print:text-black mt-3 tracking-tight">
                إمباير تايراتي لتجارة الإطارات
              </h2>
              <span className="text-[11px] text-[#F4F1EA]/40 print:text-gray-500 font-medium mt-0.5">منصة المبيعات والتوزيع السحابية</span>
            </div>

            <div className="text-left flex flex-col items-end">
              <h1 className="text-xl md:text-2xl font-black tracking-wide text-[#F4F1EA] print:text-black bg-black/10 print:bg-gray-100 px-4 py-1.5 rounded-xl">
                فاتورة مبيعات
              </h1>
              <div className="text-xs text-[#F4F1EA]/60 print:text-gray-600 mt-4 font-medium">
                رقم الفاتورة: <span className="text-[#F4F1EA] print:text-black font-mono font-bold text-sm bg-black/20 print:bg-transparent px-1.5 py-0.5 rounded">#{request_id || '---'}</span>
              </div>
              <div className="text-xs text-[#F4F1EA]/60 print:text-gray-600 mt-2 font-medium flex items-center gap-1">
                <Calendar size={12} className="text-[#9C4836] print:text-gray-400" />
                التاريخ: <span className="text-[#F4F1EA] print:text-black font-mono font-bold">{new Date().toLocaleDateString('ar-YE')}</span>
              </div>
            </div>
          </div>

          {/* جدول عناصر الفاتورة */}
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-black/20 print:bg-gray-100 border-b border-[#F4F1EA]/10 print:border-gray-200 text-[#F4F1EA]/60 print:text-gray-700 text-xs font-bold">
                  <th className="p-3.5">#</th>
                  <th className="p-3.5 text-right">معرف العميل</th>
                  <th className="p-3.5">رقم الصنف</th>
                  <th className="p-3.5">المقاس المطلوب</th>
                  <th className="p-3.5">الكمية</th>
                  <th className="p-3.5 text-right">قناة البيع</th>
                  <th className="p-3.5">سعر المفرد</th>
                  <th className="p-3.5">الإجمالي (يمني)</th>
                  <th className="p-3.5">الإجمالي (سعودي)</th>
                  <th className="p-3.5 print:hidden">التحكم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F1EA]/5 print:divide-gray-100 text-xs text-[#F4F1EA]/80 print:text-gray-900">
                {copyOrderBasketlist ? copyOrderBasketlist.map((val, index) => {
                  const { rci_id, customers_SCustID, itemNo,totaly, tiresize, quantity, AMOUNT, paypoints_pay_point_id } = val
                  const rowTotalSaudi = Number((totaly * quantity) / RySaudixchangeRial) 

                  return (
                    <tr key={rci_id || index} className="hover:bg-[#F4F1EA]/5 print:hover:bg-transparent transition-colors">
                      <td className="p-3.5 font-mono text-[#F4F1EA]/40 print:text-gray-400">{index + 1}</td>
                      <td className="p-3.5 text-right font-bold text-[#F4F1EA] print:text-black">{customers_SCustID}</td>
                      <td className="p-3.5 font-mono">{rci_id}</td>
                      <td className="p-3.5 font-mono font-semibold text-sm tracking-tight text-[#F4F1EA]/90 print:text-gray-800">{tiresize}</td>
                      <td className="p-3.5 font-bold text-sm text-[#9C4836] print:text-black">{val.quantity}</td> 
                      <td className="p-3.5 text-right font-medium text-[#F4F1EA]/60 print:text-gray-600">{paypoints_pay_point_id}</td>
                      <td className="p-3.5 font-mono">{Number(AMOUNT).toLocaleString()}</td>
                      <td className="p-3.5 font-mono font-bold text-sm text-[#9C4836] print:text-black">
                        {Number(orderBasketlist[0]?.totaly).toLocaleString()} ر.ي
                      </td>
                      <td className="p-3.5 font-mono font-bold text-sm text-emerald-400 print:text-emerald-700">
                        <div className="p-2 bg-light rounded border-start border-primary border-3">
                          <span className="text-muted small d-block">
                            { Number((orderBasketlist[0]?.totaly / RySaudixchangeRial) ).toLocaleString()} ر.س
                          </span>
                          <br />
                          <strong className="text-dark">
                            {amountToArabicText((orderBasketlist[0]?.totaly / RySaudixchangeRial))}
                          </strong>
                        </div>
                      </td>
                      <td className="p-3.5 print:hidden">
                        <button 
                          onClick={() => undoOrderStatues(rci_id, rowTotalSaudi)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                          title="حذف البند"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan="10" className="p-8 text-center text-red-400 font-bold bg-red-950/20 rounded-xl">
                      خطأ في استخراج الطلبات الواردة لسجل المراجعة
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* منطقة حساب الإجماليات الختامية */}
          <div className="mt-8 flex justify-end">
            <div className="w-full sm:w-80 bg-black/20 print:bg-gray-50 border border-[#F4F1EA]/5 print:border-gray-200 p-4 rounded-2xl flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#F4F1EA]/60 print:text-gray-600 font-medium">الإجمالي الصافي بالريال السعودي:</span>
                <strong className="text-[#9C4836] print:text-black font-mono font-bold text-sm">
                    { Number((orderBasketlist[0]?.totaly / RySaudixchangeRial) ).toLocaleString()} ر.س
                </strong>
              </div>
              <div className="border-t border-[#F4F1EA]/5 print:border-gray-200 my-1"></div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#F4F1EA]/60 print:text-gray-600 font-medium">الإجمالي المعادل بالريال اليمني:</span>
                <strong className="text-emerald-400 print:text-emerald-700 font-mono font-black text-base">
                  {Number(orderBasketlist[0]?.totaly).toLocaleString()} <span className="text-[10px] font-sans">ر.ي</span>
                </strong>
              </div>
            </div>
          </div>

          {/* تذييل الفاتورة */}
          <div className="mt-12 text-center text-[#F4F1EA]/30 print:text-gray-400 border-t border-[#F4F1EA]/5 print:border-gray-200 pt-4 text-[11px] font-medium tracking-wide">
            شكراً لتعاملكم معنا — كود توثيق الفاتورة مصدق تلقائياً عبر السيرفر المركزي لـ "تايراتي"
          </div>
        </div>

      </div>
    </div>
  )
}

export default InvoiceReview