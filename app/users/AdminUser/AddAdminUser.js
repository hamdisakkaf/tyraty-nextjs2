"use client"

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from "next/navigation"
import Link from 'next/link'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import Alert from 'react-bootstrap/Alert'
import { useIsOnline } from 'react-use-is-online'
import { ArrowLeft, UserPlus, Shield, Mail, Lock, CheckCircle } from 'lucide-react'
import { NewAdminUser } from '../../redux/slices/CustomersSlice'

function AddAdminUser() {
    const dispatch = useDispatch()
    const router = useRouter()

    const getUserReg = useSelector((state) => state.CustomerAccount)
    const { statusReg, errorReg, statusAddNewAdminError, addNewAdminstate, registerlink } = getUserReg

    const [isLoading, setIsLoading] = useState(false)
    const [username, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')
    const [msg, setMsg] = useState('')
    const [validated, setValidated] = useState(false)
    const { isOnline, isOffline } = useIsOnline()
    const [errors, setErrors] = useState({})

    const validateValues = () => {
        let newErrors = {}

        if (!username || username.length < 3) {
            newErrors.username = "اسم المستخدم يجب أن يكون 3 أحرف على الأقل"
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email || !emailRegex.test(email)) {
            newErrors.email = "يرجى إدخال بريد إلكتروني صحيح"
        }

        if (!password || password.length < 5) {
            newErrors.password = "كلمة المرور يجب أن لا تقل عن 5 أحرف"
        }

        if (password !== confPassword) {
            newErrors.confPassword = "كلمتا المرور غير متطابقتين"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const resetFields = () => {
        setUserName('')
        setEmail('')
        setPassword('')
        setConfPassword('')
        setMsg('')
        setErrors({})
    }

    const regNewAdmin = async (event) => {
        event.preventDefault()
        const form = event.currentTarget

        setValidated(true)

        if (form.checkValidity() === false) {
            event.stopPropagation()
            return
        }

        const isCustomValid = validateValues()
        if (!isCustomValid) {
            return
        }

        setIsLoading(true)
        setMsg('')

        const newUser = {
            name: username,
            email: email,
            password: password,
        }

        try {
            await dispatch(NewAdminUser(newUser)).unwrap()
            setMsg('✅ تم إنشاء الحساب بنجاح!')
            resetFields()
            setValidated(false)
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : 'حصل خطأ غير متوقع'
            setMsg(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoBack = () => {
        router.back()
    }

    return (
        <div className="bg-[#1e1e1e] min-h-screen py-6" dir="rtl">
            <Container>
                {/* ✅ شريط الأدوات العلوي */}
                <div className="flex items-center justify-between mb-6">
                    <button 
                        onClick={handleGoBack}
                        className="flex items-center gap-2 text-[#9C4836] hover:text-[#b85a45] transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-bold">العودة</span>
                    </button>

                    <h2 className="text-white font-black text-xl flex items-center gap-2">
                        <Shield size={20} className="text-[#9C4836]" />
                        إضافة مستخدم نظام
                    </h2>

                    <div className="w-20"></div>
                </div>

                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <div className="text-center mb-6">
                            <div className="bg-[#2B2B2B] p-4 rounded-full inline-block shadow-xl border border-[#F4F1EA]/5 mb-4">
                                <UserPlus size={40} className="text-[#9C4836]" />
                            </div>
                            <h3 className="text-white font-black text-2xl mb-2">تسجيل حساب مستخدم النظام</h3>
                            <p className="text-gray-500 text-sm">إنشاء حساب جديد للوصول إلى لوحة التحكم</p>
                        </div>

                        {/* ✅ التنبيهات */}
                        {msg && (
                            <Alert 
                                variant={msg.includes('✅') ? 'success' : 'danger'} 
                                className="mb-4 shadow-sm text-center"
                                style={{ borderRadius: '12px' }}
                            >
                                <strong>{msg}</strong>
                            </Alert>
                        )}

                        {errorReg && (
                            <Alert variant="danger" className="mb-4 shadow-sm text-center">
                                {errorReg}
                            </Alert>
                        )}

                        {addNewAdminstate && (
                            <Alert variant="info" className="mb-4 shadow-sm text-center">
                                {addNewAdminstate}
                            </Alert>
                        )}

                        <div className="bg-[#2B2B2B] border border-[#F4F1EA]/5 rounded-2xl p-6 shadow-xl">
                            <Form noValidate validated={validated} onSubmit={regNewAdmin}>
                                {/* اسم المستخدم */}
                                <Form.Group className="mb-4">
                                    <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                        <UserPlus size={14} />
                                        اسم المستخدم
                                    </Form.Label>
                                    <Form.Control 
                                        required
                                        type="text"
                                        placeholder="اسم المستخدم"
                                        value={username}
                                        onChange={(e) => {
                                            setUserName(e.target.value)
                                            if (errors.username) setErrors({...errors, username: null})
                                        }}
                                        isInvalid={!!errors.username}
                                        className="bg-black border-white/10 text-white py-2"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        يرجى إدخال اسم المستخدم
                                    </Form.Control.Feedback>
                                    {errors.username && (
                                        <small className="text-danger">{errors.username}</small>
                                    )}
                                </Form.Group>

                                {/* البريد الإلكتروني */}
                                <Form.Group className="mb-4">
                                    <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                        <Mail size={14} />
                                        البريد الإلكتروني
                                    </Form.Label>
                                    <Form.Control 
                                        required
                                        type="email"
                                        placeholder="yourname@email.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                            if (errors.email) setErrors({...errors, email: null})
                                        }}
                                        isInvalid={!!errors.email}
                                        className="bg-black border-white/10 text-white py-2"
                                        style={{ direction: 'ltr' }}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        يرجى إدخال بريد إلكتروني صحيح
                                    </Form.Control.Feedback>
                                    {errors.email && (
                                        <small className="text-danger">{errors.email}</small>
                                    )}
                                </Form.Group>

                                {/* كلمة المرور */}
                                <Form.Group className="mb-4">
                                    <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                        <Lock size={14} />
                                        كلمة المرور
                                    </Form.Label>
                                    <Form.Control 
                                        required
                                        type="password"
                                        placeholder="كلمة السر"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            if (errors.password) setErrors({...errors, password: null})
                                        }}
                                        isInvalid={!!errors.password}
                                        className="bg-black border-white/10 text-white py-2"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        أدخل كلمة السر الخاصة بك (5 أحرف على الأقل)
                                    </Form.Control.Feedback>
                                    {errors.password && (
                                        <small className="text-danger">{errors.password}</small>
                                    )}
                                </Form.Group>

                                {/* تأكيد كلمة المرور */}
                                <Form.Group className="mb-4">
                                    <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                        <CheckCircle size={14} />
                                        تأكيد كلمة المرور
                                    </Form.Label>
                                    <Form.Control 
                                        required
                                        type="password"
                                        placeholder="تأكيد كلمة السر"
                                        value={confPassword}
                                        onChange={(e) => {
                                            setConfPassword(e.target.value)
                                            if (errors.confPassword) setErrors({...errors, confPassword: null})
                                        }}
                                        isInvalid={!!errors.confPassword}
                                        className="bg-black border-white/10 text-white py-2"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        يرجى تأكيد كلمة المرور
                                    </Form.Control.Feedback>
                                    {errors.confPassword && (
                                        <small className="text-danger">{errors.confPassword}</small>
                                    )}
                                </Form.Group>

                                {/* زر التسجيل */}
                                <Button 
                                    variant="primary" 
                                    type="submit"
                                    disabled={isLoading || isOffline}
                                    className="w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                                    style={{ 
                                        backgroundColor: isLoading ? '#ccc' : '#9C4836',
                                        borderColor: isLoading ? '#ccc' : '#9C4836',
                                        cursor: isLoading ? 'not-allowed' : 'pointer',
                                        borderRadius: '12px'
                                    }}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            جاري التسجيل...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={18} />
                                            تسجيل
                                        </>
                                    )}
                                </Button>

                                {/* حالة الاتصال */}
                                {isOffline && (
                                    <Alert variant="warning" className="mt-3 text-center">
                                        ⚠️ لا يوجد اتصال بالإنترنت، يمكنك إنشاء حساب جديد عند الاتصال
                                    </Alert>
                                )}
                            </Form>
                        </div>

                        {/* رابط تسجيل الدخول */}
                        <div className="mt-4 text-center">
                            <p className="text-gray-500 mb-2">لديك حساب بالفعل؟</p>
                            <Link href="/CustomerLogin" className="text-[#9C4836] font-bold hover:text-white transition-colors">
                                تسجيل دخول
                            </Link>
                        </div>

                        {registerlink && (
                            <div className="mt-3 text-center">
                                <Alert variant="success" className="text-center">
                                    {statusReg}
                                    <Link href="/CustomerLogin" className="d-block mt-2 fw-bold">
                                        انقر هنا لتسجيل الدخول
                                    </Link>
                                </Alert>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default AddAdminUser