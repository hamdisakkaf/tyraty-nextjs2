import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation'

import Swal from 'sweetalert2';
import { Key } from 'lucide-react';
// استدعاء الأوامر من الريدكس
import { 
    ConfirmCashPayment, 
    ConfirmCashPaymentfast, 
    resetPaymentStatus 
} from '../../redux/slices/payementSlice';

const ModalCashTRCode = () => {
  const router = useRouter()
    const dispatch = useDispatch();

    // 1. استدعاء الحالات من الريدكس
    const { SignIn, CustomerToken } = useSelector((state) => state.CustomerAccount);
    const { 
        showTrCodeCashmodalstate, 
        showTrCodeCashFastmodalstate, 
        RequestId, 
        transactionCashRef, 
        isLoading 
    } = useSelector((state) => state.PaymentPaySlice);

    // 2. حالة الـ State المحلية لحقل الـ OTP فقط
    const [otpCode, setOtpCode] = useState('');
    const [validated, setValidated] = useState(false);

    // المودال يظهر إذا كانت أي من الحالتين true (للزائر أو المسجل)
    const isModalVisible = showTrCodeCashmodalstate || showTrCodeCashFastmodalstate;

    // إغلاق المودال وتصفير العمليات
    const handleClose = () => {
        setOtpCode('');
        setValidated(false);
        dispatch(resetPaymentStatus());
    };

    // 3. إرسال رمز التحقق
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        // تجهيز البيانات المشتركة (كما برمجتها أنت في الريدكس)
        // لاحظ: لا يوجد رقم هاتف هنا، فقط الـ OTP والمراجع
        const basePayload = {
            RequestID: RequestId,
            TransactionRef: transactionCashRef,
            CashOTP: otpCode
        };

        try {
            // اختيار الأكشن المناسب بناءً على حالة المستخدم
            const confirmAction = SignIn 
                ? ConfirmCashPayment({ ...basePayload, CustomerToken }) 
                : ConfirmCashPaymentfast(basePayload);

            await dispatch(confirmAction).unwrap();

            // عند النجاح (سيقوم الريدكس بتغيير ThankYouPage و toShoppingCart)
            Swal.fire({
                icon: 'success',
                title: 'تم تأكيد الدفع بنجاح!',
                text: 'جاري تحويلك لصفحة إتمام الطلب...',
                timer: 2000,
                showConfirmButton: false
            });

            setOtpCode('');
            // 🟢 تحديد النوع بناءً على حالة تسجيل الدخول
    const confirmationType = SignIn ? 'MemberPaid' : 'FastGuestPaid';

            // ✅ هنا المكان الصحيح: بعد التأكيد بنجاح
            // نقوم بإخفاء المودال وتصفير الحالة قبل التنقل
            dispatch(resetPaymentStatus()); 
            // 🚀 الإرسال مع النوع الصحيح             // التنقل لصفحة تأكيد الطلب

    router.push('/orderconfirmation', { 
        state: { 
            type: confirmationType,
            // يمكنك أيضاً إرسال أي تفاصيل إضافية قد تحتاجها صفحة التأكيد
            orderId: RequestId 
        } 
    });


        } catch (error) {
            // في حال الرفض (رمز خطأ أو منتهي الصلاحية)
            Swal.fire({
                icon: 'error',
                title: 'فشل التأكيد',
                text: typeof error === 'string' ? error : 'رمز التحقق غير صحيح أو انتهت صلاحيته',
                confirmButtonColor: '#B85A45'
            });
        }
    };

    return (
        <Modal 
            show={isModalVisible} 
            onHide={handleClose} 
            centered 
            contentClassName="bg-[#0f0f0f] border border-white/10 rounded-[2rem]"
            backdrop="static"
        >
            <Modal.Header closeButton closeVariant="white" className="border-b border-white/5">
                <Modal.Title className="text-white fs-6">تأكيد عملية الدفع</Modal.Title>
            </Modal.Header>
            
            <Modal.Body className="p-4 text-center">
                <div className="mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                        <Key size={30} className="text-black" />
                    </div>
                    <h4 className="text-white font-bold text-xl">أدخل رمز التحقق (OTP)</h4>
                    <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                        تم إرسال رسالة نصية تحتوي على رمز التحقق لمرة واحدة إلى رقم المحفظة المرتبط، يرجى إدخاله أدناه.
                    </p>
                </div>

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                        <Form.Control 
                            required
                            type="text" // استخدمنا Text لمنع الأسهم في حقول الأرقام، وسنفلتر الحروف في الـ onChange
                            placeholder="----"
                            maxLength={6} // قم بتعديله حسب طول الـ OTP الخاص بكاش تمكين (عادة 4 أو 6)
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} // السماح بالأرقام فقط
                            className="bg-black border-white/10 text-white rounded-xl py-4 text-center font-bold text-3xl transition-all focus:border-[#F59E0B] focus:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                            style={{ letterSpacing: '10px' }} // تباعد بين الأرقام ليعطي شكل الـ OTP
                        />
                        <Form.Control.Feedback type="invalid" className="text-center mt-2 text-[#B85A45]">
                            يرجى إدخال رمز التحقق بشكل صحيح
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button 
                        type="submit"
                        disabled={otpCode.length < 4 || isLoading} // تعطيل الزر إذا كان الرمز قصيراً جداً
                        className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-black font-black py-4 rounded-2xl transition-all active:scale-[0.98]"
                    >
                        {isLoading ? 'جاري التأكيد مع البنك...' : 'تأكيد العملية'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ModalCashTRCode;