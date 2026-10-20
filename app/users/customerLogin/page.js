"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { useIsOnline } from 'react-use-is-online'
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { Phone, Lock, BoxArrowInRight, WifiOff } from 'react-bootstrap-icons'
import { custlogin, resetLoginError } from '../../redux/slices/CustomersSlice'

function CustomerLogin() {
    const router = useRouter()
    const dispatch = useDispatch()

    const getCustomerInfo = useSelector((state) => state.CustomerAccount)
    const { SignIn, statusLogin, errorLogin, registerlink } = getCustomerInfo
    const { isOnline, isOffline } = useIsOnline()

    const [mobileNumber, setMobileNumber] = useState('')
    const [password, setPassword] = useState('')
    const [validated, setValidated] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (SignIn === true) router.push('/')
    }, [SignIn, router])

    // دالة التحقق المخصصة
    const validateValues = () => {
        let localErrors = {}
        if (!mobileNumber || mobileNumber.length < 9) {
            localErrors.mobileNumber = "رقم الهاتف غير صحيح (يجب أن يكون 9 أرقام)."
        }
        if (!password || password.length < 5) {
            localErrors.password = "كلمة المرور قصيرة جداً."
        }
        setErrors(localErrors)
        return Object.keys(localErrors).length === 0
    }

    const handleLogin = async (e) => {
        if (e && e.preventDefault) e.preventDefault()
        // مسح أخطاء السيرفر السابقة فور الضغط على الزر
        dispatch(resetLoginError())

        setValidated(true)
        const isValid = validateValues()

        if (isValid) {
            setLoading(true)
            try {
                const customer = { mobileNumber, password }
                await dispatch(custlogin(customer))
            } catch (error) {
                console.error("Login Error:", error)
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <Container fluid className="min-h-screen bg-[#050505] py-12 px-4 d-flex align-items-center justify-content-center" dir="rtl">
           
            <div className="w-100 max-w-[450px] bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl text-center">
                
                <h2 className="text-white font-black text-2xl mb-6 alexandria-h2">تسجيل الدخول</h2>

                {/* تنبيه حالة الأوفلاين */}
                {isOffline && (
                    <Alert variant="warning" className="rounded-xl py-2 flex items-center justify-center gap-2 text-xs">
                        <WifiOff size={16} /> لا يوجد اتصال بالإنترنت
                    </Alert>
                )}

                {/* أخطاء السيرفر */}
                {errorLogin && (
                    <Alert variant="danger" className="rounded-xl py-2 text-xs">
                        {statusLogin || "خطأ في تسجيل الدخول، تأكد من بياناتك"}
                    </Alert>
                )}

                <Form noValidate validated={validated} onSubmit={handleLogin} className="mt-4">
                    
                    {/* حقل رقم التلفون */}
                    <Form.Group className="mb-4 text-right">
                        <Form.Label className="text-gray-400 text-xs ms-2 mb-2 italic">رقم التلفون</Form.Label>
                        <div className="relative">
                            <span className="absolute top-1/2 right-4 -translate-y-1/2 text-[#B85A45]"><Phone size={18} /></span>
                            <Form.Control 
                                required
                                type="number"
                                isInvalid={!!errors.mobileNumber}
                                className={`bg-black border-white/10 text-white rounded-xl py-3 pr-10 focus:border-[#B85A45] shadow-inner text-left [appearance:textfield] ${errors.mobileNumber ? 'shake-input' : ''}`}
                                placeholder="77xxxxxxxx"
                                onChange={(e) => {
                                    setMobileNumber(e.target.value)
                                    // 1. مسح الخطأ المحلي
                                    if(errors.mobileNumber) setErrors({...errors, mobileNumber: null})
                                    // 2. مسح خطأ Redux (السيرفر) لكي يختفي التنبيه الأحمر فوراً
                                    if(errorLogin) dispatch(resetLoginError())
                                }}
                            />
                            <Form.Control.Feedback type="invalid" className="text-red-500 text-[10px] mt-2 mr-2 font-bold d-block">
                                {errors.mobileNumber}
                            </Form.Control.Feedback>
                        </div>
                    </Form.Group>

                    {/* حقل كلمة المرور */}
                    <Form.Group className="mb-6 text-right">
                        <Form.Label className="text-gray-400 text-xs ms-2 mb-2 italic">كلمة المرور</Form.Label>
                        <div className="relative">
                            <span className="absolute top-1/2 right-4 -translate-y-1/2 text-[#B85A45]"><Lock size={18} /></span>
                            <Form.Control 
                                required
                                type="password"
                                isInvalid={!!errors.password}
                                className={`bg-black border-white/10 text-white rounded-xl py-3 pr-10 focus:border-[#B85A45] shadow-inner ${errors.password ? 'shake-input' : ''}`}
                                placeholder="••••••"
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    if(errors.password) setErrors({...errors, password: null})
                                    // مسح خطأ Redux
                                    if(errorLogin) dispatch(resetLoginError())
                                }}
                            />
                            <Form.Control.Feedback type="invalid" className="text-red-500 text-[10px] mt-2 mr-2 font-bold d-block">
                                {errors.password}
                            </Form.Control.Feedback>
                        </div>
                    </Form.Group>

                    {/* زر الدخول */}
                    <Button 
                        type="submit" 
                        disabled={loading || isOffline}
                        className="w-100 bg-[#B85A45] hover:bg-[#a04e3c] border-0 py-3 rounded-2xl text-lg font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        {loading ? <Spinner size="sm" animation="border" /> : <><BoxArrowInRight size={22} /> دخول</>}
                    </Button>
                </Form>

                {/* روابط إضافية */}
                <div className="mt-8 pt-6 border-t border-white/5">
                    {registerlink && (
                        <p className="text-gray-500 text-sm mb-2">لا تملك حساباً؟</p>
                    )}
                    <Link href="/userRegister" className="text-[#B85A45] font-bold hover:text-white transition-colors">
                        إنشاء حساب جديد
                    </Link>
                </div>
            </div>
        </Container>
    )
}

export default CustomerLogin