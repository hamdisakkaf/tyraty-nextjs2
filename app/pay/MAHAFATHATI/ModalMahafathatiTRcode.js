import React, { useRef, useState, useEffect } from 'react';
import { Modal, Button, Form, Col, Container, Row, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation'

import { resetPaymentStatus, ConfirmMahafatiPayment, ConfirmMahafatiPaymentfast } from '../../redux/slices/paymentSliceMahfathati';
import { resetOrder } from '../../redux/slices/basketSlice';
import Swal from 'sweetalert2';

function ModalMahafathatiTRcode() {
    const dispatch = useDispatch();
    const router = useRouter()
    const inputRef = useRef(null);
    // 1. جلب البيانات من Redux مباشرة
    const { CustomerToken, SignIn } = useSelector((state) => state.CustomerAccount);
      const { localagents,orderBasketlist, lastOrderDetails, product_id,amount, } = useSelector((state) => state.basket);

const { 
        isLoading, 
        isSuccess,
        showTrCodeMahafatimodalstate, 
        showTrCodeMahafatiFastmodalstate, 
        RequestId, 
        transNo,
        paymentState,
        cashpayMESSAGEDESC
    } = useSelector((state) => state.PaymentPaySliceMahafathati);

    const [OTP, setOTP] = useState('');
    const [validated, setValidated] = useState(false);
    const [msg, setMsg] = useState('');

    const [timer, setTimer] = useState(60); // 60 ثانية كبداية
    const [canResend, setCanResend] = useState(false);

    const [attempts, setAttempts] = useState(0);
const MAX_ATTEMPTS = 3; // الحد الأقصى للمحاولات

    const [isShaking, setIsShaking] = useState(false);
    // 2. دالة الإغلاق تقوم بتصفير الحالة في Redux (وهذا سيخفي المكون من الأب تلقائياً)
    const handleClose = () => {
        dispatch(resetPaymentStatus());
    };

    
    useEffect(() => {
    if (showTrCodeMahafatimodalstate) {
        // تأخير بسيط لضمان انتهاء انيميشن المودال
        setTimeout(() => inputRef.current?.focus(), 500);
    }
}, [showTrCodeMahafatimodalstate]);

    useEffect(() => {
    let interval;
    if (timer > 0 && !canResend) {
        interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
    } else {
        setCanResend(true);
        clearInterval(interval);
    }
    return () => clearInterval(interval);
}, [timer, canResend]);

//  اهتزاز داخل الحقل اذا ادخل كود تحقق غير صحيح
const triggerShake = () => {
    setIsShaking(true);
    // إزالة التأثير بعد انتهاء الانيميشن (400ms) ليكون جاهزاً للمرة القادمة
    setTimeout(() => setIsShaking(false), 400);
};



   const handleConfirm = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (attempts >= MAX_ATTEMPTS) return;

    setMsg(null);

    if (form.checkValidity() === false) {
        event.stopPropagation();
        setValidated(true);
        return;
    }

    const data = {
        RequestId: RequestId,
        transNo: transNo,
        TransactionRef: transNo,
        otp: OTP,
        CustomerToken: CustomerToken
    };
    const datafast = {
        RequestId: RequestId,
        transId: transNo,
        otp: OTP,
    };

    try {
        const action = showTrCodeMahafatiFastmodalstate 
            ? ConfirmMahafatiPaymentfast(datafast) 
            : ConfirmMahafatiPayment(data);

        // ✅ التعديل هنا: عند استخدام unwrap()، الـ result هو الـ payload نفسه
        const payload = await dispatch(action).unwrap(); 
        
        const errorCode = payload?.bankResponse?.errCode;
        // التحقق من النجاح (دعم 0 و 120) والتأكد من وجود بيانات الصفوف
        const isSuccess = (errorCode == 0 || errorCode == '0' || errorCode == 120 || errorCode == '120') && payload?.rows !== undefined;

        if (isSuccess) {
            setMsg('✅ تم التأكيد بنجاح');
            
            // انتظار الـ Swal لينتهي تماماً
            await Swal.fire({
                icon: 'success',
                title: 'تم التأكيد بنجاح',
                text: 'شكراً لثقتك بمتجر تايراتي، جاري تجهيز طلبك..',
                timer: 2000,
                showConfirmButton: false,
                background: '#121212',
                color: '#fff'
            });

            // ✅ الترتيب الصحيح للتنفيذ
            handleClose(); 
         // بعد نجاح عملية الدفع واكتمال الـ API
if (SignIn) {
    // حالة العميل المسجل (عضو الإمبراطورية)
    setTimeout(() => {
        router.push('/orderconfirmation', {
            replace: true, // لمنع العميل من العودة لصفحة الدفع عند ضغط زر الرجوع
            state: { 
                type: 'MemberPaid',
                // basketlist: orderBasketlist
            } 
        });
    }, 100);
} else {
    // حالة الزائر (الدفع السريع)
    setTimeout(() => {
        router.push('/orderconfirmation', {
            replace: true,
            state: { 
                type: 'FastGuestPaid', // أو 'FastGuestPaid' حسب ما اعتمدته في صفحة الاستقبال
               // basketlist: orderBasketlist
            }
        });
    }, 100);
}

               
    
        } else {
            // منطق الفشل وعدد المحاولات
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            
            if (newAttempts >= MAX_ATTEMPTS) {
                handleClose(); 
                await Swal.fire({
                    icon: 'error',
                    title: 'تم تجاوز الحد المسموح',
                    text: 'لقد أدخلت الرمز خطأ 3 مرات لحماية حسابك.',
                    background: '#121212', color: '#fff'
                });
            } else {
                setMsg(`❌ رمز التحقق غير صحيح. متبقي ${MAX_ATTEMPTS - newAttempts} محاولات`);
                setOTP(''); 
                triggerShake();
            }
        }

    } catch (error) {
        // أي خطأ Rejected من الـ unwrap سيأتي هنا
        setMsg('❌ حدث خطأ في الاتصال، يرجى المحاولة لاحقاً');
        triggerShake();
        console.error("Confirm Error:", error);
    }
};

    return (
        <Modal 
            // الربط المباشر بحالة ريدكس هو الحل الأضمن للظهور ✅
            show={showTrCodeMahafatimodalstate || showTrCodeMahafatiFastmodalstate}
            onHide={handleClose} 
            centered 
            backdrop="static"
            contentClassName={`bg-[#0f0f0f] border-white/10 rounded-[2rem] ${isShaking ? 'shake-modal' : ''}`}
        >
            <Modal.Header  className="bg-light" closeButton={!isLoading}>
                <Modal.Title className="alexandria-span fs-5">
                    تأكيد عملية الدفع - محفظتي
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-4">
                <Form noValidate validated={validated} onSubmit={handleConfirm}>
                   
                
                    <div className="text-center mb-4">
                    <span className="text-orange-500 text-[10px] bg-orange-500/10 px-2 py-1 rounded-full">{ lastOrderDetails?.finalPrice }</span>
                        <p className="text-muted small">
                            {paymentState} <br/> {cashpayMESSAGEDESC}
                        </p>
                        {isSuccess && <Alert variant={cashpayMESSAGEDESC.includes('✅') ? 'success' : 'danger'}>{cashpayMESSAGEDESC}</Alert>}
                    </div>

<div className="text-center mb-2">
    {attempts > 0 && attempts < MAX_ATTEMPTS && (
        <span className="text-orange-500 text-[10px] bg-orange-500/10 px-2 py-1 rounded-full">
            محاولة {attempts} من {MAX_ATTEMPTS}
        </span>
    )}
</div>
                    <Form.Group as={Col} controlId="otpInput" className="mb-4">
                        <Form.Label className="fw-bold">رمز التحقق (OTP)</Form.Label>
                        <Form.Control 
                          ref={inputRef}
                            required 
                            type='number'
                            placeholder="أدخل الرمز المكون من 4 أرقام"  
                            className="text-center py-2"
                            value={OTP}
                            onChange={(e) => setOTP(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            ادخل رمز التحقق الذي وصل إلى هاتفك
                        </Form.Control.Feedback>
                    </Form.Group>
{/* يوضع هذا الكود تحت حقل الـ OTP في المودال */}
<div className="text-center mt-3">
    {timer > 0 ? (
        <div className="flex items-center justify-center gap-2">
            <span className="text-gray-400 text-xs">تنتهي صلاحية الرمز خلال:</span>
            <span className={`font-mono font-bold ${timer < 10 ? 'text-red-500 animate-pulse' : 'text-[#B85A45]'}`}>
                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </span>
        </div>
    ) : (
        <button 
            type="button"
            onClick={handleConfirm}
            className="text-[#B85A45] text-xs font-bold hover:underline bg-transparent border-0"
        >
            لم يصلك الرمز؟ إعادة الإرسال الآن
        </button>
    )}
</div>
                  
        <Button
    type="submit"
    disabled={isLoading} // سيتم تعطيله فوراً عند بدء الطلب
    className={`w-full py-3 rounded-xl font-bold transition-all ${
        isLoading ? 'opacity-70 cursor-not-allowed' : 'bg-[#B85A45] hover:bg-[#a04d3a]'
    }`}
>
    {isLoading ? (
        <div className="flex items-center justify-center gap-2 text-white">
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            جاري المعالجة...
        </div>
    ) : (
        'تأكيد العملية'
    )}
</Button>

                </Form>
            </Modal.Body>

            <Modal.Footer className="justify-content-center border-0">
                <Button variant="link" className="text-muted text-decoration-none" onClick={handleClose}>
                    إلغاء العملية
                </Button>
            </Modal.Footer>
 <div className="w-full bg-white/5 h-1 mt-4 rounded-full overflow-hidden">
    <div 
        className="h-full bg-[#B85A45] transition-all duration-1000 ease-linear"
        style={{ width: `${(timer / 60) * 100}%` }}
    ></div>
</div>
        </Modal>
    );
}

export default ModalMahafathatiTRcode;