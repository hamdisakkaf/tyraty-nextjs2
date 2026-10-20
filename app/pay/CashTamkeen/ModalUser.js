import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link'
import { Container, Badge, Row, Button, Form, Modal } from 'react-bootstrap';
import { X } from 'lucide-react';
import { ShieldLock, PersonPlus, BoxArrowInRight, Telephone, Lock } from 'react-bootstrap-icons';
import { custlogin } from '../../redux/slices/CustomersSlice';

function ModalUser({ showModal, onClose }) {
    const dispatch = useDispatch();

    // 1. الحالات (States)
    const [showPrompt, setShowPrompt] = useState(showModal); // شاشة التنبيه الكبيرة
    const [showLoginModal, setShowLoginModal] = useState(false); // مودال الفورم الصغير
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const [msg, setMsg] = useState('');

    // مراقبة الـ Props لتحديث الحالة إذا تغيرت من الخارج
    useEffect(() => {
        setShowPrompt(showModal);
    }, [showModal]);

    // 2. وظائف التحكم (Actions)
    
    // إغلاق كل شيء
   const handleCloseAll = () => {
        setShowPrompt(false);
        setShowLoginModal(false);
        if (onClose) onClose(); // 2. أخبر الأب أن الإغلاق تم
    };

    // الانتقال من التنبيه إلى مودال تسجيل الدخول
    const handleSwitchToLogin = () => {
        setShowPrompt(false); // إخفاء التنبيه
        setShowLoginModal(true); // إظهار المودال
    };

    // العودة من المودال إلى التنبيه عند الضغط على X
    const handleBackToPrompt = () => {
        setShowLoginModal(false);
        setShowPrompt(true);
    };

    // 3. منطق تسجيل الدخول
    const loginCustomer = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        const customer = { mobileNumber, passowrd: password };
        
        try {
            const resultAction = await dispatch(custlogin(customer));
            // التحقق من النجاح بناءً على هيكلة الـ Redux لديك
            if (resultAction.payload && resultAction.payload.rows) {
                setMsg('تم تسجيل الدخول بنجاح');
                setTimeout(() => handleCloseAll(), 1500); // إغلاق بعد نجاح العملية
            } else {
                setMsg('تأكد من رقم تلفونك وكلمة المرور');
            }
        } catch (error) {
            setMsg('حدث خطأ في الاتصال');
        }
    };

    return (
        <>
            {/* أ: شاشة التنبيه الكبيرة (Prompt Overlay) */}
            {showPrompt && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <Container className="max-w-2xl">
                        <div className="bg-[#0f0f0f] border border-[#B85A45]/30 rounded-[1.5rem] p-6 shadow-2xl relative overflow-hidden">
                            <button onClick={handleCloseAll} className="absolute top-4 left-4 p-2 text-gray-500 hover:text-[#B85A45] bg-white/5 rounded-full">
                                <X size={20} />
                            </button>

                            <div className="flex flex-col md:flex-row align-items-center gap-4 text-center md:text-right">
                                <div className="bg-[#B85A45]/10 p-4 rounded-full animate-pulse">
                                    <ShieldLock className="text-[#B85A45] text-3xl" />
                                </div>

                                <div className="flex-grow-1">
                                    <h4 className="text-white font-bold mb-2 text-xl">يرجى تسجيل الدخول للمتابعة</h4>
                                    <p className="text-gray-400 text-sm mb-4">لإتمام عملية الدفع وتأمين مشترياتك، يمكنك عليك تسجيل الدخول .</p>
                                    
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                                        <Badge bg="none" className="bg-white/5 border border-white/10 text-gray-300 py-2 px-3 rounded-full">شراكة استراتيجية </Badge>
                                        <Badge bg="none" className="bg-white/5 border border-white/10 text-gray-300 py-2 px-3 rounded-full">سجل الطلبات</Badge>
                                        <Badge bg="none" className="bg-white/5 border border-white/10 text-gray-300 py-2 px-3 rounded-full">سجل مشترياتك</Badge>
                                        <Badge bg="none" className="bg-white/5 border border-white/10 text-gray-300 py-2 px-3 rounded-full">حفظ الفواتير </Badge>

                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button className="bg-[#B85A45] border-0 py-3 px-5 rounded-xl flex items-center justify-center gap-2" onClick={handleSwitchToLogin}>
                                            <BoxArrowInRight /> تسجيل الدخول
                                        </Button>
                                        <Button as={Link} to="/useregister" className="bg-white/5 border border-white/10 py-3 px-5 rounded-xl text-white">
                                            <PersonPlus /> حساب جديد
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            )}

            {/* ب: مودال تسجيل الدخول (Bootstrap Modal) */}
            <Modal 
                show={showLoginModal} 
                onHide={handleBackToPrompt}
                centered
                backdrop="static"
                contentClassName="bg-[#0f0f0f] border border-white/10 rounded-[2rem] overflow-hidden"
            >
                <Modal.Header closeButton closeVariant="white" className="border-b border-white/5 bg-[#151515]">
                    <Modal.Title className="text-white font-bold w-100 text-center">تسجيل الدخول</Modal.Title>
                </Modal.Header>

                <Modal.Body className="p-6">
                    <div className="text-center mb-6">
                        <div className="inline-block p-3 rounded-full bg-[#B85A45]/10 mb-3 text-[#B85A45]">
                            <PersonPlus size={30} />
                        </div>
                        <p className="text-gray-400 text-sm">أهلاً بك مجدداً في تايراتي</p>
                    </div>

                    <Form noValidate validated={validated} onSubmit={loginCustomer}>
                        {msg && (
                            <div className={`p-3 rounded-xl mb-4 text-center text-sm ${msg.includes('بنجاح') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                {msg}
                            </div>
                        )}

                        <Form.Group className="mb-4">
                            <Form.Label className="text-gray-300 text-xs font-bold">رقم الهاتف</Form.Label>
                            <div className="relative">
                                <Telephone className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500" />
                                <Form.Control required type="tel" placeholder="77x xxx xxx" className="bg-black border-white/10 text-white rounded-xl py-3 pr-10" style={{ direction: 'ltr' }} onChange={(e) => setMobileNumber(e.target.value)} />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-6">
                            <Form.Label className="text-gray-300 text-xs font-bold">كلمة المرور</Form.Label>
                            <div className="relative">
                                <Lock className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500" />
                                <Form.Control required type="password" placeholder="••••••••" className="bg-black border-white/10 text-white rounded-xl py-3 pr-10" onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </Form.Group>

                        <Button type="submit" className="w-100 bg-[#B85A45] border-0 py-3 rounded-xl font-bold mb-4 shadow-lg shadow-[#B85A45]/20">
                            دخول آمن
                        </Button>
                    </Form>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="mx-4 text-gray-500 text-[10px]">أو</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <Button as={Link} to="/useregister" onClick={handleCloseAll} className="w-100 bg-white/5 border-white/5 text-gray-300 py-3 rounded-xl mt-4 text-sm">
                        ليس لديك حساب؟ سجل الآن
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalUser;