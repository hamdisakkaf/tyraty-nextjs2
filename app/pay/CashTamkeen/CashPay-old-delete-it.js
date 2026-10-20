import React,{useState,useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import ModalUser from './ModalUser';
import { nanoid } from 'nanoid';
import { saveRetailCustomerInvoices,payByCashpay, resetPaymentState } from '../../../redux/slices/payementSlice';
import cashTamkeen from '../../../assets/payments/CashTamkeen/cash-tamkeen.webp'

const CashPayModal = ({ paymentcardid, logo }) => {
        const dispatch = useDispatch()
        const getCustomerInfo = useSelector((state) => state.CustomerAccount)
        const { SignIn,SCustID,CustomerId,CustomerToken, statusLogin, errorLogin,CustomerEmail,phoneNumber,CustomerName,AddressStreet,AddressCity } = getCustomerInfo
        const getPaymentState = useSelector((state) => state.PaymentPaySlice)
       const { RequestId,paymentState, cashpayMESSAGEDESC } = getPaymentState
      const { lastOrderDetails } = useSelector((state) => state.basket);
    
const [validated, setValidated] = useState(false);
const [errors, setErrors] = useState({});
const [customerCashPayCode, setCustomerCashPayCode] = useState(null);
const [showmodalCashpay, setShowModalCashpay] = useState(false);
// const handleModalCashpayClose = () => setModalCashpay(false);
const [showmodalUser, setModalUser] = useState(false);

const [done, setDone] = useState(false);
const [Id, setId] = useState(null);

const [showmodalCashpay2, setShowmodalCashpay] = useState(showmodalCashpay);
const [showRetryUI, setShowRetryUI] = useState(false);
const [transactionData, setTransactionData] = useState(null);
const [errorMessage, setErrorMessage] = useState('');
const [showSuccessMessage, setShowSuccessMessage] = useState(false);


         useEffect(()=> {
               setModalUser(false)
           },[SignIn])

  const generateShortId=(()=> {
           return nanoid(6); // يُنشئ سلسلة فريدة مكونة من 6 أحرف/أرقام
          })

  useEffect(()=>{
      const uniqueId = generateShortId();
      setId(uniqueId)
  },[showmodalCashpay])

      // بناء الـ Payload بناءً على حالة تسجيل الدخول
        const commonData = {
            CustomerCashPayCode: customerCashPayCode,
            amount: lastOrderDetails?.amount,
            totaly: lastOrderDetails?.finalPrice,
            rci_id: RequestId ? RequestId : Id,
            paymentcardid: paymentcardid,
            paypointspaypointid: lastOrderDetails?.items?.[0]?.payPointId ,
            producid: lastOrderDetails?.items?.[0]?.product_id,
            brandid: lastOrderDetails?.brand?.[0]?.brand_id,
            tiresize: lastOrderDetails?.tiresize,
            quantity: lastOrderDetails?.quantity,
            CurrencyId: lastOrderDetails?.currency,

        };

  
 // console.log('requestfordatabase rci_id:', RequestId)
const requestfordatabase = {
  rci_id: RequestId ? RequestId : Id,
  SCustID,
  produciD: commonData.producid,
  AMOUNT: commonData.amount,
  brandid: commonData.brandid,
  tiresizE: commonData.tiresize,
  quantitY: commonData.quantity,
  CurrencyId: commonData.CurrencyId,
  paymentcard_id: commonData.paymentcardid,
  paypointspaypoint_id: commonData.paypointspaypointid ?? null
}
    //const refno = req.body.REFNO;
console.log('requestfordatabase ::', requestfordatabase)

 const requestcashpay = {
    SCustID: SCustID,
    AMOUNT: commonData.amount,
    totaly:commonData.totaly,
    CurrencyId: commonData.CurrencyId,
    customerCashPayCode,
    Desc: 'شراء اصناف عبر موقع الويب',
    Id: RequestId ? RequestId : Id,
    CustomerToken: CustomerToken
  } 
  
    const handleModalCashPayShow = () => {
          SignIn ? 
            // فتح نافذة الدفع باستخدام بوابة دفع كاش تمكين
          setShowModalCashpay(true) 
          : setModalUser(true) 
         }

         const handleModalCashPayClose = () => {
          setShowModalCashpay(false) 
         }


const payByCashGatway = async (event) => {// أضفنا async هنا
 event.preventDefault(); // منع تحديث الصفحة

 const form = event.currentTarget;

 if (form.checkValidity() === false) {
 event.preventDefault();
 event.stopPropagation();
 setValidated(true); // تفعيل إظهار أخطاء التحقق للمستخدم
 } else {
 setValidated(true);

 try {
 // التحقق من المدخلات
 if (customerCashPayCode.length !== 3) {

 console.error("كود الشراء يتكون من 3 أرقام (في اعدادات تطبيق كاش)");
 return;
 }
// التحقق من المدخلات
 if (customerCashPayCode.length === 3 && requestcashpay.totaly !==0 ) {
 const response = await dispatch(payByCashpay(requestcashpay)).unwrap();
  console.log('Success payByCashpay:', response);
 } else {
 // تنبيه المستخدم لطول الكود
console.log('Customer pay Code == 3 digits');
  }
 // هنا يمكنك تفعيل حفظ الفاتورة
await dispatch(saveRetailCustomerInvoices(requestfordatabase)).unwrap();
 } catch (error) {
 console.error("Caught payment error:", error);
 setDone(false);
 }
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
       
     SignIn ? 
          setShowModalCashpay(true) 
       : setModalUser(true)
    })
    
    const validateValues = () => {
      let errors = {};
      
      if (customerCashPayCode.length < 3 ) {
        errors.CashPayCode = "تأكد من صحة كتابة رقم الدفع الخاص بتطبيق كاش، رقم الدفع  يتكون من 3 ارقام";
      }
      
      if (customerCashPayCode.length > 3) {
        errors.CashPayCode = "رقم الدفع الخاص بتطبيق كاش لا يزيد عن 3 أرقام";
      }
      if (customerCashPayCode.length == 0) {
        errors.CashPayCode = "ادخل رقم دفع كاش الخاص بك";
      }
      setErrors(errors)
      
      return errors;
    };

return(
<Container >
 
<div className="flex flex-col items-center w-100 mt-6 select-none">
  {/* حاوية الشعار العلوية - تم تحسين البروز والظل */}
  <div className="mb-[-20px] z-20">
    <div className="bg-[#1a1a1a] p-1.5 rounded-full border-2 border-[#B85A45]/30 shadow-[0_0_20px_rgba(184,90,69,0.2)] animate-pulse-slow">
      <div className="bg-white rounded-full p-1 shadow-inner">
        <img
          src="/assests/payments/CashTamkeen/cash-tamkeen.webp" 
          alt="بوابة دفع كاش"
          className="rounded-full object-contain"
          width={60}
          height={60}
        />
      </div>
    </div>
  </div>

  <button 
    type="button" 
    onClick={saveRetailInvoicesCashpay}
    className="group relative w-full overflow-hidden rounded-2xl md:rounded-[2rem] border-0 transition-all duration-500 active:scale-95 shadow-[0_15px_40px_rgba(184,90,69,0.25)] hover:shadow-[0_20px_50px_rgba(184,90,69,0.4)]"
    style={{ 
      maxWidth: '500px',
      minWidth: '200px'
    }}
    
  > 
    {/* تأثير ضوئي متحرك (Glass reflection) */}
    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></span>

    <div className="flex items-center justify-between px-6 py-4">
      {/* النصوص - تحسين الـ Typography */}
      <div className="text-right flex-1">
        <span className="block text-white font-black text-xl md:text-2xl tracking-tight alexandria-h2">
          بوابة دفع كاش
        </span>
        <span className="block text-white/80 text-[10px] md:text-[11px] font-light mt-1 opacity-90 group-hover:text-white transition-colors">
          آمن، سريع، ومعتمد لإتمام طلبك فوراً
        </span>
      </div>

      {/* الأيقونة الجانبية - تصميم أكثر حداثة */}
      <div className="relative mr-4">
        <div className="bg-white/10 rounded-circle w-14 h-14 flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-xl group-hover:rotate-6 transition-transform">
            <i className="bi bi-cash-coin fs-4 text-white">   
            <img
          src="/assests/payments/CashTamkeen/cash-tamkeen.webp" 
          alt="بوابة دفع كاش"
          className="rounded-full object-contain bg-white/5 p-1"
          width={60}
          height={60}
        /></i>
        </div>
   
        {/* نقطة خضراء تشير للعمل الفوري */}
        <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#B85A45] rounded-full"></span>
      </div>
    </div>
  </button>

  {/* نص التوثيق تحت الزر - UX Trust Factor */}
  <div className="flex items-center justify-center gap-4 mt-4 text-gray-500">
    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/10"></div>
    <div className="flex items-center gap-2">
       <span className="text-[10px] font-medium tracking-widest uppercase flex items-center gap-1.5 opacity-70">
         <i className="bi bi-shield-lock-fill text-[#B85A45]"></i>
         Secure Payment Gateway
       </span>
    </div>
    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/10"></div>
  </div>
</div>
 {showmodalUser ? <ModalUser 
  showModal={showmodalUser} 
  onClose={() => setModalUser(false)} // هذا السطر هو مفتاح الحل
  /> : null}

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
        <span className="bg-[#B85A45] text-white text-[10px] px-2 py-1 rounded-md">CASH</span>
      </Modal.Title>
    </Modal.Header>

    <Modal.Body className="p-0">
      <div className="p-5">
        
        {/* رسائل الحالة */}
        {(paymentState || cashpayMESSAGEDESC) && (
          <div className="bg-[#B85A45]/10 border border-[#B85A45]/20 text-[#B85A45] p-3 rounded-xl mb-4 text-center text-sm font-bold animate-pulse">
             {paymentState} {cashpayMESSAGEDESC}
          </div>
        )}

        {/* كارت تفاصيل الدفع */}
        <div className="bg-[#151515] border border-white/5 rounded-2xl overflow-hidden">
          
          {/* المنطقة العلوية: الشعار والمبلغ */}
          <div className="bg-gradient-to-b from-[#202020] to-[#151515] p-6 text-center border-b border-white/5">
            <img 
              src={cashTamkeen} 
              className="h-16 w-auto mx-auto mb-4 object-contain drop-shadow-lg"
              alt="Cash Tamkeen"
            />
            <p className="text-gray-400 text-xs mb-1">المبلغ الإجمالي المستحق</p>
            <h2 className="text-4xl font-black text-white tracking-tighter mb-0">
              {lastOrderDetails.finalPrice} <span className="text-lg text-[#B85A45] font-bold">ريال</span>
            </h2>
          </div>

          <div className="p-5">
            <Form noValidate validated={validated}>
              <Form.Group className="mb-5 text-center">
                <Form.Label className="text-gray-300 text-sm mb-3 d-block font-bold">
                  أدخل كود الشراء (3 أرقام)
                </Form.Label>
                
                {/* حقل الإدخال المحسن للجوال */}
                <div className="relative">
                  <Form.Control 
                    required 
                    autoFocus 
                    type="text" 
                    inputMode="numeric" 
                    placeholder="---"
                    // هنا التعديل المهم: tracking-widest للجوال بدلاً من قيمة ثابتة كبيرة
                    className={`bg-black border-2 text-white h-16 rounded-xl text-center text-3xl font-bold tracking-[0.5em] md:tracking-[1em] focus:border-[#B85A45] focus:ring-0 focus:shadow-[0_0_15px_rgba(184,90,69,0.3)] transition-all ${errors.CashPayCode ? 'border-danger animate-shake' : 'border-white/10'}`}
                    value={customerCashPayCode}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.length <= 3 && /^\d*$/.test(val)) {
                        setCustomerCashPayCode(val);
                        if (errors.CashPayCode) setErrors({});
                      }
                    }}
                  />
                  {/* أيقونة صغيرة داخل الحقل */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                    <i className="bi bi-key-fill"></i>
                  </div>
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
                className="w-100 border-0 rounded-xl py-3.5 text-lg font-black transition-all hover:brightness-110 active:scale-95"
                style={{ 
                    backgroundColor: '#B85A45',
                    boxShadow: '0 8px 20px -5px rgba(184,90,69,0.5)' 
                }}
                onClick={(e) => {
                  const validationErrors = validateValues();
                  if (Object.keys(validationErrors).length === 0) {
                    payByCashGatway(e);
                  }
                }}
              >
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
</Container>) 
  
        }

export default CashPayModal;