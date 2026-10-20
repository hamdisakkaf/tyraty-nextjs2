import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Form, Modal, Button, Alert } from 'react-bootstrap';
import { nanoid } from 'nanoid';
import Swal from 'sweetalert2';
import { CreditCard, ChevronLeft } from 'lucide-react';
// الـ Imports الخاصة بريدكس
import { 
    saveRetailCustomerInvoices, 
    saveRetailCustomerInvoiceswoutlog, 
    payByCashpay, // للمسجلين
    payByCashpayfast, // للزوار
    resetPaymentStatus 
} from '../../redux/slices/payementSlice';
import cashTamkeen from '../../../components/assets/payments/CashTamkeen/cash-tamkeen.webp'

const PayByCashGatway = ({ paymentcardid, logo }) => {
    const dispatch = useDispatch();
    
    // 1. استدعاء البيانات (التعرف على حالة تسجيل الدخول)
    const { SCustID, CustomerToken, SignIn } = useSelector((state) => state.CustomerAccount);
    const { RequestId, paymentState, cashpayMESSAGEDESC, isLoading } = useSelector((state) => state.PaymentPaySlice);
    const { lastOrderDetails } = useSelector((state) => state.basket);
    
    // 2. حالات الـ State المحلية
    const [mobileNumberCash, setMobileNumberCash] = useState("");
    const [cashPayCode, setCashPayCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validated, setValidated] = useState(false);
    const [showmodalCashpay, setShowModalCashpay] = useState(false);
    const [tempId, setTempId] = useState(null);

    // توليد معرف فريد للعملية في حالة عدم وجود RequestId (للطلب الجديد)
    useEffect(() => {
        if (showmodalCashpay && !tempId) {
            setTempId(nanoid(6));
        }
    }, [showmodalCashpay]);

    const handleModalCashPayClose = () => {
        setShowModalCashpay(false);
        setIsSubmitting(false);
        setMobileNumberCash("");
        setCashPayCode("");
        dispatch(resetPaymentStatus()); // تنظيف الريدكس عند الإغلاق
    };

    // 3. المنطق الموحد لإرسال طلب الدفع
    const handlePaymentSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        setIsSubmitting(true);

 
        // بناء الـ Payload بناءً على حالة تسجيل الدخول
        const commonData = {
            CustomerCashPayCode: cashPayCode,
            amount: lastOrderDetails?.amount,
            rci_id: RequestId || tempId,
            paymentcardid: paymentcardid,
            paypointspaypointid: lastOrderDetails?.items?.[0]?.payPointId,
            producid: lastOrderDetails?.items?.[0]?.product_id,
            brandid: lastOrderDetails?.brand?.[0]?.brand_id,
            tiresize: lastOrderDetails?.tiresize,
            quantity: lastOrderDetails?.quantity,
            CurrencyId: lastOrderDetails?.currency,
            totaly: lastOrderDetails?.totalPrice
        };

        const finalRequest = SignIn 
            ? { ...commonData, CustomerToken } // المسجل يرسل التوكن
            : { ...commonData, mobileNumber: mobileNumberCash }; // الزائر يرسل رقم الهاتف

        try {
            Swal.fire({
                title: 'جاري معالجة الطلب...',
                text: 'يرجى الانتظار لتلقي رمز التأكيد من البنك',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });

            // اختيار الأكشن المناسب بناءً على حالة تسجيل الدخول
            const paymentAction = SignIn ? payByCashpay(finalRequest) : payByCashpayfast(finalRequest);
            const response = await dispatch(paymentAction).unwrap();

            // فحص نجاح العملية (كود 1 أو 0)
            if (response.ResultCode === 1 || response.ResultCode === 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'طلب دفع مقبول',
                    text: 'يرجى إدخال رمز التحقق (OTP) الذي وصل إلى هاتفك الآن.',
                    timer: 3000,
                    showConfirmButton: false
                });
                // ملاحظة: هنا الـ Redux سيقوم تلقائياً بفتح مودال الـ OTP (الذي صممناه في الخطوة السابقة)
                // لذا سنغلق هذا الفورم فقط
                setShowModalCashpay(false);
            } else {
                throw new Error(response.ResultMessage || "فشلت العملية");
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'فشل العملية',
                text: typeof error === 'string' ? error : error.message,
                confirmButtonColor: '#B85A45'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
<Container>
    {/* زر فتح البوابة - تصميم "Glassmorphism" متطابق مع الهوية */}
<div className="flex flex-col items-center w-full mt-4 select-none">
    <button 
        type="button" 
        onClick={() => setShowModalCashpay(true)}
        className="group relative w-full max-w-[500px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#1a1a1a] p-2 transition-all duration-500 active:scale-[0.98] hover:bg-[#222222] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
    >
        {/* تم تغيير flex-row الافتراضية إلى flex-row-reverse لمحاذاة العناصر من اليسار لليمين */}
        <div className="flex items-center justify-between flex-row-reverse w-full gap-4">
            
            {/* 1. الأيقونة: الآن في أقصى اليسار */}
            <div className="relative flex-shrink-0"> 
                <div className="bg-black/40 rounded-full w-16 h-16 flex items-center justify-center border border-white/5 shadow-inner p-1.5 transition-transform duration-500 group-hover:scale-105">
                    <img
                      src={cashTamkeen} 
                      alt="كاش تمكين"
                      className="rounded-full object-contain" 
                      style={{ width: '100%', height: '100%' }}
                    />
                </div>
            </div>

            {/* 2. النصوص: محاذاة لليمين وتأخذ المساحة المتبقية بالكامل */}
            <div className="text-right flex-1 min-w-0">
                <span className="block text-white font-bold text-base md:text-xl truncate alexandria-title">
                 كاش تمكين
                </span>
                <span className="block text-white/50 text-[10px] md:text-[12px] mt-0.5 truncate">
                    {SignIn ? "الدفع السريع للمشتركين" : "دفع سريع وآمن بدون حساب"}
                </span>
            </div>

            {/* 3. المؤشر (السهم) مع مسافة بسيطة جداً جهة اليمين */}
            <div className="flex-shrink-0 bg-white/5 p-2 rounded-full group-hover:bg-[#B85A45]/20 transition-colors mr-2">
                 <ChevronLeft size={20} className="text-white" />
            </div>
        </div>
    </button>
</div>

    {/* المودال - تصميم متناسق بحدود نحاسية خفيفة */}
    <Modal show={showmodalCashpay} onHide={handleModalCashPayClose} centered contentClassName=" bg-[#1a1a1a] border border-white/10 rounded-[2rem] overflow-hidden" backdrop="static">
     
   {/* رأس المودال */}
    <Modal.Header closeButton closeVariant="white" className="border-b border-white/5 bg-[#1a1a1a]">
      <Modal.Title className="text-white fw-bold fs-6 w-100 text-center flex items-center justify-center gap-2">
        <span>بوابة الدفع</span>
        <span className="bg-[#B85A45] text-white text-[10px] px-2 py-1 rounded-md">كاش - تمكين </span>
      </Modal.Title>
    </Modal.Header>
        <Modal.Body className="p-6">
          {/* المنطقة العلوية: الشعار والمبلغ */}
  <div className="bg-gradient-to-b from-[#202020] to-[#151515] p-8 text-center border-b border-white/5 shadow-inner">
                  {/* شعار المحفظة مع تأثير بروز */}
  <div className="relative inline-block mb-4">
    <div className="absolute inset-0 bg-[#B85A45]/20 blur-xl rounded-full"></div>
    <img 
      src= {cashTamkeen}
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
   
    </div>

  </div>
</div>
<Form noValidate validated={validated} onSubmit={handlePaymentSubmit}>
    {!SignIn && (
        <Form.Group className="mb-4">
            <Form.Label className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-2">رقم هاتف المحفظة</Form.Label>
            <Form.Control 
                required type="tel" maxLength={9} placeholder="77xxxxxxx"
                value={mobileNumberCash}
                onChange={(e) => setMobileNumberCash(e.target.value.replace(/\D/g, ''))}
                // المنطق: إذا كان الطول يساوي 9، اجعل الحدود خضراء (border-green-500)
                className={`bg-[#111111] text-white rounded-2xl py-3.5 focus:ring-0 shadow-[0_0_0_100px_#111111_inset] transition-colors duration-300
                    ${mobileNumberCash.length === 9 ? 'border-green-500' : 'border-white/10 focus:border-[#B85A45]'}`}
            />
        </Form.Group>
    )}

    <Form.Group className="mb-6">
        <Form.Label className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-2">رمز الدفع (3 أرقام)</Form.Label>
        <Form.Control 
            required type="text" maxLength={3} placeholder="---"
            value={cashPayCode}
            onChange={(e) => setCashPayCode(e.target.value.replace(/\D/g, ''))}
            // المنطق: إذا كان الطول يساوي 3، اجعل الحدود خضراء
            className={`bg-[#111111] text-white rounded-2xl py-3.5 text-center text-xl tracking-[15px] font-black focus:ring-0 shadow-[0_0_0_100px_#111111_inset] transition-colors duration-300
                ${cashPayCode.length === 3 ? 'border-green-500' : 'border-white/10 focus:border-[#B85A45]'}`}
        />
    </Form.Group>

    <Button 
        type="submit"
        disabled={(!SignIn ? mobileNumberCash.length !== 9 : false) || cashPayCode.length !== 3 || isSubmitting}
        className="w-full bg-[#B85A45] hover:bg-[#9C4836] border-none text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98]"
    >
        {isSubmitting ? "جاري الإرسال..." : "تأكيد وعملية الدفع"}
    </Button>
</Form>
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
</Container>
    );
};

//export default PayByCashGatway;

export default PayByCashGatway;