import React,{useState,useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import ModalUser from '../CashTamkeen/ModalUser';
import ModalMahafathatiTRcode from './ModalMahafathatiTRcode';
import { nanoid } from 'nanoid';
import { payByMahafatiPay, resetPaymentStatus } from '../../redux/slices/paymentSliceMahfathati';
import Swal from 'sweetalert2';
import showLoadingSwal from '../../moduls/AlertsModals/Swals'
import { resetOrder,addToOrder, addToOrderCashpaywoutlog } from '../../redux/slices/basketSlice';
import { CreditCard, ChevronLeft } from 'lucide-react';

const MahafathatiPayModal = ({ paymentcard_id,paypointspaypoint_id,amount,producid,brandid,itemNO,tiresize,crcy,quantity, paymentdatE, total, tireSpec, KSAxchange }) => {
    const dispatch = useDispatch()
    const getCustomerInfo = useSelector((state) => state.CustomerAccount)
    const { SignIn,SCustID,CustomerId,CustomerToken, statusLogin, errorLogin,CustomerEmail,phoneNumber,CustomerName,AddressStreet,AddressCity } = getCustomerInfo
    const getPaymentStateMahafathati = useSelector((state) => state.PaymentPaySliceMahafathati)
    const { RequestId,paymentState, cashpayMESSAGEDESC, showTrCodeMahafatimodalstate, showTrCodeMahafatiFastmodalstate } = getPaymentStateMahafathati
    const { localagents, lastOrderDetails, } = useSelector((state) => state.basket);


const [validated, setValidated] = useState(false);
const [errors, setErrors] = useState({});
//const [customerCashPayCode, setCustomerCashPayCode] = useState(null);
//const [customerPhoneNumber, setCustomerPhoneNumber] = useState(null);
const [customerCashPayCode, setCustomerCashPayCode] = useState(""); // تغيير من null إلى ""
const [customerPhoneNumber, setCustomerPhoneNumber] = useState(""); // تغيير من null إلى ""
const [showmodalCashpay, setShowModalCashpay] = useState(false);
// const handleModalCashpayClose = () => setModalCashpay(false);
const [showmodalUser, setModalUser] = useState(false);

const [done, setDone] = useState(false);
const [Id, setId] = useState(null);

         useEffect(()=> {
               setModalUser(false)
               dispatch(resetPaymentStatus());
           },[SignIn])

 const generateShortId=(()=> {
           return nanoid(6); // يُنشئ سلسلة فريدة مكونة من 6 أحرف/أرقام
          })

  useEffect(()=>{
      const uniqueId = generateShortId();
      setId(uniqueId)
  },[showmodalCashpay, showTrCodeMahafatimodalstate])

  // اخفاء الرسالة عند ظهور مودل تاكيد الطلب
useEffect(() => {
    if (showTrCodeMahafatiFastmodalstate || showTrCodeMahafatimodalstate) {
        
        // 1. إغلاق الـ Swal بتأثير الخروج المعرف أعلاه
        Swal.close(); 

        // 2. اختياري: إظهار "Toast" صغير يؤكد نجاح الاتصال قبل ظهور المودال
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            background: '#1a1a1a',
            color: '#fff'
        });

        Toast.fire({
            icon: 'success',
            title: 'تم الاتصال.. أدخل رمز التحقق'
        });
    }
}, [showTrCodeMahafatiFastmodalstate, showTrCodeMahafatimodalstate]);

 // console.log('requestfordatabase rci_id:', RequestId)
const requestfordatabase = {
  rci_id: RequestId ? RequestId : Id,
  SCustID,
  producid,
  amount: amount,
  brandid,
  itemNO,
  tiresize,
  quantity, 
  CurrencyId: crcy,
  paymentdatE,
  paymentcard_id,
  paypointspaypoint_id
}
    //const refno = req.body.REFNO;
//console.log('requestfordatabase ::', requestfordatabase)
/*
 const requestcashpay = {
    amount: amounT,
    fromAccount: customerPhoneNumber,
  } 
  */
 // أضف هذا الفحص كصمام أمان
if (!lastOrderDetails) return null;
// ارسال القيم لدالة الدفع وبيانات حفظ الطلب في قاعدة البيانات
   const requestcashpay = {
    fromAccount: customerPhoneNumber,
    //rci_id: RequestId ? RequestId : Id,
    finalprice: lastOrderDetails?.finalPrice, // سعر الحبة بعد الفائدة
    paymentcardid: paymentcard_id ,
    paypointspaypointid: lastOrderDetails?.items?.[0]?.payPointId ,
    producid: lastOrderDetails?.items[0]?.product_id,
    pricesId: lastOrderDetails?.items[0]?.pricesid,
    brandid: lastOrderDetails?.items[0]?.brandid ,
    tiresize: lastOrderDetails?.tiresize ,
    quantity: lastOrderDetails?.quantity ,
    CurrencyId: crcy,
   // KSAxchange: KSAxchange,
    totalPrice: lastOrderDetails?.totalPrice,
  } 

//console.log('requestcashpay:', requestcashpay)
  /*
    const handleModalCashPayShow = () => {
          SignIn ? 
            // فتح نافذة الدفع باستخدام بوابة دفع كاش تمكين
          setShowModalCashpay(true) 
          : setModalUser(true) 
         }
*/
         const handleModalCashPayClose = () => {
          setShowModalCashpay(false) 
          dispatch(resetPaymentStatus());

         }

const handleRefresh = () => {
    window.location.reload();
};

const payByMahafathatiGatway = async (event) => {
  if (event) event.preventDefault();
  //const form = event.currentTarget;
  
  dispatch(resetPaymentStatus());

// التحقق من الأخطاء
  const validationErrors = validateValues();
  if (Object.keys(validationErrors).length > 0) {
    setValidated(true);
    return;
  }

  setValidated(true);

  // 1. التحقق من طول الرقم
  if (!customerPhoneNumber || customerPhoneNumber.length !== 9) {
    setErrors({ CashPayCode: "رقم الهاتف يجب أن يتكون من 9 أرقام" });
    return;
  }
// الطريقة الأولى: استخدام القيمة الافتراضية (الأكثر أماناً)
if (!(customerPhoneNumber || "").toString().trim() || (customerPhoneNumber || "").length !== 9) {
    setErrors({ CashPayCode: "رقم الهاتف يجب أن يتكون من 9 أرقام" });
    return;
}

/*
// الطريقة الثانية: (الأبسط والأكثر حداثة)
if (!customerPhoneNumber || customerPhoneNumber?.length !== 9) {
    setErrors({ CashPayCode: "رقم الهاتف يجب أن يتكون من 9 أرقام" });
    return;
}
*/
  try {
    // 2. إظهار مؤشر انتظار SweetAlert2
    Swal.fire({
      title: 'جاري الاتصال بالبنك...',
      text: 'يرجى عدم إغلاق النافذة حتى اكتمال العملية',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    dispatch(resetOrder)
    // 3. تنفيذ الدفع وانتظار الرد
    const response = await dispatch(payByMahafatiPay(requestcashpay)).unwrap();
    // حفظ بيانات الاوردر في سلة الشراء
   // dispatch(addToOrder(requestcashpay));
     //  console.log('addOrdeToBacket dispatch :', addOrdeToBacket);
    console.log('✅ Success pay By Mahafathati pay:', response);
   
} catch (error) {
    console.error("Full Error Object:", error);

    // 1. استخراج الرسالة بذكاء (صمام أمان)
    // نبحث عن الرسالة في error.data (Axios) أو error.message (JS) أو error مباشرة
    const serverMessage = error?.data?.message || error?.message || error?.errDesc || (typeof error === 'string' ? error : "");
    const serverType = error?.data?.type || error?.type || "";

    let displayMessage = "فشلت عملية الدفع، يرجى المحاولة مرة أخرى";
    let iconType = 'error';
    let isDuplicate = false;

    // 2. فحص هل هو خطأ تكرار (بناءً على النوع أو النص)
    if (serverType === "DUPLICATE_ORDER" || serverMessage.includes("Duplicate entry") || serverMessage.includes("مسجل لدينا بالفعل")) {
        displayMessage = "هذا الطلب مسجل لدينا بالفعل. يرجى مراجعة قائمة 'مشترياتي' للتأكد من حالة العملية، او قم باغلاق هذه النافذة والدفع من جديد.";
        iconType = 'info';
        isDuplicate = true;
    } else if (serverMessage) {
        // إذا كان خطأ آخر وله رسالة، نستخدم رسالة السيرفر
        displayMessage = serverMessage;
    }

    // 3. عرض النافذة المنبثقة باستخدام المتغير displayMessage
   Swal.fire({
    icon: iconType,
    title: isDuplicate ? 'طلب مكرر' : 'فشل العملية',
    text: displayMessage,
    // تغيير نصوص الأزرار بناءً على الحالة
    confirmButtonText: isDuplicate ? 'الانتقال لسلة التسوق' : 'إغلاق',
    confirmButtonColor: isDuplicate ? '#3085d6' : '#B85A45',
    
    // إظهار زر التحديث دائماً كزر إضافي (Deny Button)
    showDenyButton: true,
    denyButtonText: 'تحديث الصفحة',
    denyButtonColor: '#6e7d88',

    showCancelButton: isDuplicate,
    cancelButtonText: 'إلغاء',
    reverseButtons: true 
}).then((result) => {
    /* 1. إذا ضغط على الزر الرئيسي (تأكيد) */
    if (result.isConfirmed) {
        if (isDuplicate) {
            window.location.href = '/ShoppingCart';
        }
    } 
    /* 2. إذا ضغط على زر "تحديث الصفحة" (Deny) */
    else if (result.isDenied) {
        // تحديث الصفحة فوراً
        window.location.reload();
    }
});

    setDone(false);
}
};


    const saveRetailInvoicesCashpay = ((event) => {
      event.preventDefault()
      const form = event.currentTarget;
   

      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        setValidated(true);
      }
       
      /* في حالة لا تعرض مودل الدفع الا بعد تسجيل الدخول
     SignIn ? 
          setShowModalCashpay(true) 
       : setModalUser(true)
       */
       setShowModalCashpay(true) 
    })
    
// --- 1. إصلاح دالة التحقق الأساسية ---
const validateValues = () => {
  let errors = {};
  const phone = (customerPhoneNumber || "").toString().trim();

  if (phone.length === 0) {
    errors.CashPayCode = "ادخل رقم تلفونك المرتبط بمحفظتي";
  } else if (phone.length < 9) {
    errors.CashPayCode = "رقم التلفون يجب أن يتكون من 9 أرقام";
  } else if (phone.length > 9) {
    errors.CashPayCode = "رقم التلفون لا يزيد عن 9 أرقام";
  }
  
  setErrors(errors);
  return errors;
};
return(
<Container >
<div className="flex flex-col items-center w-full mt-4 select-none px-2">
  
  <button 
    type="button" 
    onClick={saveRetailInvoicesCashpay}
    className="group relative w-full max-w-[450px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#1a1a1a] p-2 transition-all duration-500 active:scale-[0.98] hover:bg-[#222222] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
  > 
    {/* لمسة ضوئية هادئة */}
    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></span>

    {/* الحاوية الرئيسية بنظام Flexbox متزن */}
    <div className="flex items-center justify-between flex-row-reverse w-full gap-3">
      
      {/* 1. الأيقونة: تم تكبير الحاوية إلى w-16 h-16 لتبدو أوضح */}
      <div className="relative flex-shrink-0"> 
        <div className="bg-[#1a1a1a] rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center border border-white/10 shadow-2xl p-1.5">
            <img
              src="/assests/payments/Mahafathati/mahafathati_pay.webp" 
              alt="محفظتي"
              className="rounded-full object-contain bg-white" 
              style={{ width: '100%', height: '100%' }}
            />
        </div>
        <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1a1a1a] rounded-full"></span>
      </div>

      {/* 2. النصوص: تأخذ المساحة المتبقية */}
      <div className="text-right flex-1 min-w-0">
        <span className="block text-white font-bold text-base md:text-xl truncate alexandria-title">
          بوابة دفع محفظتي
        </span>
        <span className="block text-white/50 text-[10px] md:text-[12px] mt-0.5 truncate">
          آمن، سريع، ومعتمد لإتمام طلبك فوراً
        </span>
      </div>

      {/* 3. السهم */}
      <div className="flex-shrink-0 bg-white/5 p-2 rounded-full group-hover:bg-[#B85A45]/20 transition-colors">
         <ChevronLeft size={20} className="text-white" />
      </div>
    </div>
  </button>

  {/* نص التوثيق */}
  <div className="flex items-center justify-center gap-2 mt-3 w-full opacity-30">
    <div className="h-[1px] w-10 bg-gray-600"></div>
    <p className="text-[8px] md:text-[9px] text-gray-400 whitespace-nowrap">معاملة آمنة ومشفرة 100%</p>
    <div className="h-[1px] w-10 bg-gray-600"></div>
  </div>
</div>

 {showmodalUser ? <ModalUser showModal={showmodalUser} /> : null}

  {/* --- المودال (Popup) --- */}
  <Modal 
    size="md" 
    show={showmodalCashpay} 
    onHide={handleModalCashPayClose}
    centered 
    contentClassName="bg-[#0f0f0f] border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.9)]"
    backdrop="static" // يمنع الإغلاق بالضغط في الخارج لضمان التركيز
    keyboard={false}
  >
    {/* رأس المودال */}
    <Modal.Header closeButton closeVariant="white" className="border-b border-white/5 bg-[#1a1a1a]">
      <Modal.Title className="text-white fw-bold fs-6 w-100 text-center flex items-center justify-center gap-2">
        <span>بوابة الدفع</span>
        <span className="bg-[#B85A45] text-white text-[10px] px-2 py-1 rounded-md">محفظتي - بنك التضامن</span>
      </Modal.Title>
    </Modal.Header>

    <Modal.Body className="p-0">
      <div >
       
        {/* رسائل الحالة */}
      {/* رسائل الحالة - تعديل هام */}
{(paymentState || cashpayMESSAGEDESC) && (
  <div className="bg-[#B85A45]/10 border border-[#B85A45]/20 text-[#B85A45] p-3 rounded-xl mb-4 text-center text-sm font-bold animate-pulse">
      {/* تأكد أنك تعرض نصوصاً فقط هنا */}
      {typeof paymentState === 'object' ? paymentState.message : paymentState} 
      {" "}
      {typeof cashpayMESSAGEDESC === 'object' ? cashpayMESSAGEDESC.errDesc : cashpayMESSAGEDESC}
  </div>
)}

        {/* كارت تفاصيل الدفع */}
        <div className="bg-[#151515] border border-white/5 rounded-2xl overflow-hidden">
          
          {/* المنطقة العلوية: الشعار والمبلغ */}
  <div className="bg-gradient-to-b from-[#202020] to-[#151515] p-8 text-center border-b border-white/5 shadow-inner">
  {/* شعار المحفظة مع تأثير بروز */}
  <div className="relative inline-block mb-4">
    <div className="absolute inset-0 bg-[#B85A45]/20 blur-xl rounded-full"></div>
    <img 
      src="/assests/payments/Mahafathati/mahafathati_pay.webp" 
      className="relative h-20 w-auto mx-auto object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
      alt="MAHAFATHATI pay"
    />
  </div>

  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[2px] mb-4">تفاصيل الدفع المستحق</p>

  {/* حاوية المبالغ المنظمة */}
  <div className="space-y-4">
    
    {/* المبلغ الأساسي (سعودي) */}
    <div className="flex items-center justify-between bg-black/30 px-4 py-2 rounded-xl border border-white/5">
      <span className="text-gray-500 text-xs">المبلغ بالسعر الأساسي:</span>
      <div className="text-white font-bold">
        {lastOrderDetails?.amount} <span className="text-[10px] text-[#B85A45]">ر.س</span>
      </div>
    </div>

    {/* السعر الإجمالي بالريال اليمني - (البطل / الـ Hero) */}
    <div className="py-4 border-y border-white/5 my-2">
      <p className="text-gray-400 text-[10px] mb-1">الإجمالي المطلوب سداده</p>
      <h2 className="text-5xl font-black text-white tracking-tighter flex items-center justify-center gap-2">
      
        {Math.round(lastOrderDetails?.totalPrice).toLocaleString()} 
        <span className="text-sm text-[#B85A45] font-black self-end mb-2">ريال يمني</span>
      </h2>
 
    </div>

    {/* تفاصيل إضافية صغيرة */}
    <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="text-right">
            <span className="block text-[9px] text-gray-500 uppercase">إجمالي المنتجات</span>
            <span className="text-white text-sm font-bold">{lastOrderDetails?.quantity} <small className="text-[#B85A45]">حبات</small></span>
        </div>
        <div className="text-left border-r border-white/10 pr-3">
            <span className="block text-[9px] text-gray-500 uppercase">سعر الصرف المعتمد</span>
            <span className="text-white text-sm font-bold">{KSAxchange} <small className="text-[#B85A45]">Y/S</small></span>
        </div>
    </div>

  </div>
</div>

          <div className="p-5">
         
            <Form noValidate validated={validated}>
              <Form.Group className="mb-5 text-center">
                <Form.Label className="text-gray-300 text-sm mb-3 d-block font-bold">
                  أدخل رقم تلفونك  (9 أرقام)
                </Form.Label>
                
                {/* حقل الإدخال المحسن للجوال */}
                <div className="relative">
                  <Form.Control 
                    required 
                    autoFocus 
                    type="text" 
                    // يظهر لوحة أرقام فقط في الجوال
                    inputMode="numeric"
                    placeholder="7XXXXXXXX"
                    // هنا التعديل المهم: tracking-widest للجوال بدلاً من قيمة ثابتة كبيرة
                    className={`bg-black border-2 text-white h-16 rounded-xl text-center text-1xl font-bold tracking-[0.5em] md:tracking-[1em] focus:border-[#B85A45] focus:ring-0 focus:shadow-[0_0_15px_rgba(184,90,69,0.3)] transition-all ${errors.CashPayCode ? 'border-danger animate-shake' : 'border-white/10'}`}
                    //value={customerPhoneNumber}
                    // ضمان أن القيمة دائماً نصية لتجنب خطأ الـ null
                    value={customerPhoneNumber || ""}
                    /*
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= 9 && /^\d*$/.test(val)) {
                        setCustomerPhoneNumber(val);
                        if (errors.CashPayCode) setErrors({});
                      }
                    }}
                    */
                    onChange={(e) => {
                      const val = e.target.value;
                      // 1. السماح بالأرقام فقط
                      // 2. الحد الأقصى 9 أرقام
                      if (val.length <= 9 && /^\d*$/.test(val)) {
                        setCustomerPhoneNumber(val);
                        // مسح الخطأ فور البدء في الكتابة الصحيحة
                        if (errors.CashPayCode) setErrors(prev => ({ ...prev, CashPayCode: null }));
                      }
                    }}
 
                  />
     

                  {/* أيقونة الهاتف - غيرتها لـ phone بما أنه رقم هاتف */}
  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
    <i className="bi bi-phone-fill text-lg"></i>
  </div>

  {/* مؤشر عدد الأرقام المتبقية (اختياري) */}
  {customerPhoneNumber?.length > 0 && (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-mono">
      {customerPhoneNumber.length}/9
    </div>
  )}
  </div>

                {/* رسالة الخطأ */}
                <div className="h-6 mt-2"> {/* حجز مكان ثابت لمنع القفز */}
                  {errors.CashPayCode && (
                    <div className="text-danger text-xs font-bold animate-bounce">
                      <i className="bi bi-exclamation-triangle-fill me-1"></i>
                      {errors.CashPayCode}
                    </div>
                  )}
                </div>
              </Form.Group>

              {/* زر إتمام الدفع */}
              <Button 
   className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-black font-black text-sm py-4 rounded-2xl transition-all active:scale-[0.96] flex justify-center items-center gap-2 shadow-[0_15px_30px_-10px_rgba(217,119,6,0.4)]"
                                        
                onClick={(e) => {
                  const validationErrors = validateValues();
                  if (Object.keys(validationErrors).length === 0) {
                    payByMahafathatiGatway(e);
                  }
                }}
              >
                <CreditCard size={20} />   
                تأكيد الدفع الآن
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </Modal.Body>

    <Modal.Footer className="border-t border-white/5 bg-[#0a0a0a] justify-content-center py-3">
      <button 
        className="text-gray-500 hover:text-white text-sm font-bold transition-colors bg-transparent border-0"
        onClick={handleModalCashPayClose}
      >
        إلغاء العملية
      </button>
    </Modal.Footer>
  </Modal>

  {/* 2. استدعاء المودال (يجب أن يكون مستقلاً تماماً) */}
  {(showTrCodeMahafatimodalstate || showTrCodeMahafatiFastmodalstate) && (
     <ModalMahafathatiTRcode />
  )}
</Container>
) 
  
        }

export default MahafathatiPayModal;