"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import Image from 'react-bootstrap/Image'
import Alert from 'react-bootstrap/Alert'
import { useIsOnline } from 'react-use-is-online'
import { Person, Envelope, Lock, GeoAlt, Phone, BoxArrowInLeft } from 'react-bootstrap-icons'
import bcrypt from 'bcryptjs'
import { newUserRegister } from '../../redux/slices/CustomersSlice'

function UserRegister() {
    const dispatch = useDispatch()
    const router = useRouter()

    const getUserReg = useSelector((state) => state.CustomerAccount)
    const { statusReg, errorReg, statusLogin, errorLogin, registerlink, CustomerName } = getUserReg

    const [customerName, setCustomerName] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState('')
    const hashedPassword = bcrypt.hashSync(password, '$2a$10$CwTycUXWue0Thq9StjUM0u')
    const [confPassword, setConfPassword] = useState('')
    const [addressCity, setAddressCity] = useState(null)
    const [addressStreet, setAddressStreet] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState(null)
    const [done, setDone] = useState(false)
    const [msg, setMsg] = useState('')
    const [validated, setValidated] = useState(false)
    const { isOnline, isOffline, error } = useIsOnline()
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState({})

    const handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }
        setValidated(true)
    }

    const validateValues = () => {
        let errors = {}

        if (!customerName || customerName.trim().split(/\s+/).length < 3) {
            errors.customerName = "يرجى كتابة اسمك الثلاثي كاملاً لتسهيل عملية التوصيل."
        }
        if (!phoneNumber || phoneNumber.length < 9) {
            errors.phoneNumber = "رقم الهاتف غير صحيح، يجب أن يتكون من 9 أرقام."
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email || !emailRegex.test(email)) {
            errors.email = "يرجى إدخال بريد إلكتروني صحيح (مثال: name@mail.com)."
        }
        if (!password || password.length < 5) {
            errors.password = "كلمة المرور ضعيفة، يجب أن تكون 5 رموز على الأقل."
        }
        if (!phoneNumber || phoneNumber.length <= 8) {
            errors.phoneNumber = "تأكد من صحة كتابة رقم تلفونك، رقم التلفون يجب ان يكون 9 ارقام"
        }
        if (!customerName || customerName.trim().split(' ').length < 3) {
            errors.customerName = "يرجى كتابة الاسم الثلاثي كاملاً"
        } else if (customerName.length < 9) {
            errors.customerName = "الاسم قصير جداً"
        }
        if (!password || password.length < 5) {
            errors.password = "كلمة المرور قصيرة جداً"
        }

        setErrors(errors)

        if (Object.keys(errors).length === 0) {
            console.log("Validation Passed: No errors found")
            setSubmitting(true)
            return Object.keys(errors).length === 0
        } else {
            console.log("Validation Failed:", errors)
            setSubmitting(false)
            return false
        }
    }

    const resetFields = (() => {
        setCustomerName('')
        setEmail('')
        setPassword('')
        setConfPassword('')
        setAddressCity('')
        setPhoneNumber('')
        setMsg('')
    })

    const handleRegister = async (event) => {
        if (event && event.preventDefault) {
            event.preventDefault()
        }

        const form = event.currentTarget
        setValidated(true)

        if (form && form.checkValidity() === false) {
            event.stopPropagation()
            return
        }

        const isCustomValid = validateValues()
        if (!isCustomValid) {
            console.log("Validation failed: Please check inputs length/format")
            return
        }

        const newCustomer = {
            customerName: customerName,
            email: email,
            password: password,
            addressCity: addressCity,
            CustomerZone: addressCity,
            addressStreet: addressStreet,
            phoneNumber: phoneNumber
        }

        setSubmitting(true)

        try {
            const resultAction = await dispatch(newUserRegister(newCustomer))

            if (newUserRegister.fulfilled.match(resultAction)) {
                console.log("Registration Success")
                setDone(true)
                resetFields()
                setValidated(false)
                router.push('/CustomerLogin') // ✅ استخدام Next.js router
            } else if (newUserRegister.rejected.match(resultAction)) {
                const errorMsg = resultAction.payload || resultAction.error?.message || "فشل تسجيل الحساب"
                console.error("Registration Rejected:", errorMsg)
                setDone(false)
            }
        } catch (err) {
            console.error('Unexpected Error:', err)
            setDone(false)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Container fluid className="min-h-screen bg-[#050505] py-8 px-4 sm:px-6 lg:px-8 d-flex flex-column align-items-center" dir="rtl">
            <div className="text-center mb-8 animate-fade-in">
                <div className="bg-[#0f0f0f] p-4 rounded-full inline-block shadow-2xl border border-white/5 mb-4">
                    <Image width={80} height={70} src="لوجو تايراتي tyrate - Opject-03.svg" className="object-contain" />
                </div>
                <h2 className="text-white font-black text-2xl mb-2 alexandria-h2">إنشاء حساب جديد</h2>
                <p className="text-gray-500 text-sm">انضم إلينا واستمتع بمميزات حصرية وعروض مستمرة</p>
            </div>

            {statusReg && (
                <Alert variant={errorReg ? 'danger' : 'success'} className="w-100 max-w-[500px] rounded-xl border-0 shadow-lg text-center">
                    {statusReg}
                    {registerlink && (
                        <Link href="/CustomerLogin" className="d-block mt-2 font-bold underline">
                            انقر هنا لتسجيل الدخول
                        </Link>
                    )}
                </Alert>
            )}

            <div className="w-100 max-w-[550px] bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl">
                <Form noValidate validated={validated} onSubmit={handleRegister}>
                    <Row>
                        <Col md={12} className="mb-4 text-right">
                            <Form.Label className="text-gray-400 text-xs ms-2 mb-2 italic">الاسم الكامل</Form.Label>
                            <div className="relative">
                                <span className="absolute top-1/2 right-4 -translate-y-1/2 text-[#B85A45]"><Person /></span>
                                <Form.Control 
                                    required 
                                    className={`bg-black border-white/10 text-white rounded-xl py-3 pr-10 focus:border-[#B85A45] shadow-inner ${errors.customerName ? 'shake-input' : ''}`}
                                    placeholder="الاسم الثلاثي أو الرباعي"
                                    onChange={(e) => {
                                        setCustomerName(e.target.value)
                                        if (errors.customerName) setErrors({ ...errors, customerName: null })
                                    }} 
                                />
                                {errors.customerName && (
                                    <Form.Control.Feedback type="invalid" className="text-red-500 text-[11px] mt-2 mr-2 font-bold d-block">
                                        {errors.customerName}
                                    </Form.Control.Feedback>
                                )}
                            </div>
                        </Col>

                        <Col md={12} className="mb-4 text-right">
                            <Form.Label className="text-gray-400 text-xs ms-2 mb-2 italic">البريد الإلكتروني</Form.Label>
                            <div className="relative">
                                <span className="absolute top-1/2 right-4 -translate-y-1/2 text-[#B85A45]"><Envelope /></span>
                                <Form.Control 
                                    required 
                                    type="email"
                                    className={`bg-black border-white/10 text-white rounded-xl py-3 pr-10 focus:border-[#B85A45] shadow-inner text-left ${errors.email ? 'shake-input' : ''}`}
                                    placeholder="yourname@email.com"
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        if (errors.email) setErrors({ ...errors, email: null })
                                    }} 
                                />
                                {errors.email && (
                                    <Form.Control.Feedback type="invalid" className="text-red-500 text-[11px] mt-2 mr-2 font-bold d-block">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                )}
                            </div>
                        </Col>

                        <Col md={6} className="mb-4">
                            <Form.Label className="text-gray-400 text-xs ms-2 mb-2 italic">كلمة المرور</Form.Label>
                            <div className="relative">
                                <span className="absolute top-1/2 right-4 -translate-y-1/2 text-[#B85A45]"><Lock /></span>
                                <Form.Control 
                                    required type="password"
                                    className="bg-black border-white/10 text-white rounded-xl py-3 pr-10 focus:border-[#B85A45] focus:ring-0 shadow-inner"
                                    placeholder="••••••"
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        if (errors.password) setErrors({ ...errors, password: null })
                                    }} 
                                />
                                <Form.Control.Feedback type="invalid" className="text-red-500 text-[11px] mt-2 mr-2 font-bold d-block">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </div>
                        </Col>

                        <Col md={6} className="mb-4">
                            <Form.Label className="text-gray-400 text-xs ms-2 mb-2 italic">تأكيد الكلمة</Form.Label>
                            <div className="relative">
                                <span className="absolute top-1/2 right-4 -translate-y-1/2 text-[#B85A45]"><Lock /></span>
                                <Form.Control 
                                    required type="password"
                                    className="bg-black border-white/10 text-white rounded-xl py-3 pr-10 focus:border-[#B85A45] focus:ring-0 shadow-inner"
                                    placeholder="••••••"
                                    onChange={(e) => {
                                        setConfPassword(e.target.value)
                                        if (errors.password) setErrors({ ...errors, password: null })
                                    }} 
                                />
                                <Form.Control.Feedback type="invalid" className="text-red-500 text-[11px] mt-2 mr-2 font-bold d-block">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </div>
                        </Col>

                        <Col md={6} className="mb-4">
                            <Form.Label className="text-gray-400 text-xs ms-2 mb-2 italic">المدينة</Form.Label>
                            <div className="relative">
                                <span className="absolute top-1/2 right-4 -translate-y-1/2 text-[#B85A45]"><GeoAlt /></span>
                                <Form.Control 
                                    required 
                                    className="bg-black border-white/10 text-white rounded-xl py-3 pr-10 focus:border-[#B85A45] focus:ring-0 shadow-inner"
                                    placeholder="مثلاً: صنعاء"
                                    onChange={(e) => setAddressCity(e.target.value)} 
                                />
                            </div>
                        </Col>

                        <Col md={6} className="mb-4">
                            <Form.Label className="text-gray-400 text-xs ms-2 mb-2 italic">الشارع / الحي</Form.Label>
                            <div className="relative text-left">
                                <Form.Control 
                                    required 
                                    className="bg-black border-white/10 text-white rounded-xl py-3 px-4 focus:border-[#B85A45] focus:ring-0 shadow-inner"
                                    placeholder="اسم الشارع"
                                    onChange={(e) => setAddressStreet(e.target.value)} 
                                />
                            </div>
                        </Col>

                        <Col md={12} className="mb-6">
                            <Form.Label className="text-gray-400 text-xs ms-2 mb-2 italic text-right d-block">رقم التلفون</Form.Label>
                            <div className="relative">
                                <span className="absolute top-1/2 right-4 -translate-y-1/2 text-[#B85A45]"><Phone /></span>
                                <Form.Control 
                                    required type="number"
                                    className="bg-black border-white/10 text-white rounded-xl py-3 pr-10 focus:border-[#B85A45] focus:ring-0 shadow-inner text-left [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="77xxxxxxxx"
                                    onChange={(e) => {
                                        setPhoneNumber(e.target.value)
                                        if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: null })
                                    }} 
                                />
                                {errors.phoneNumber && (
                                    <div className="text-red-500 text-[11px] mt-2 mr-2 animate-pulse font-bold">
                                        ⚠️ {errors.phoneNumber}
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>

                    <Button 
                        type="submit" 
                        className="w-100 bg-[#B85A45] hover:bg-[#a04e3c] border-0 py-3.5 rounded-2xl text-lg font-black transition-all shadow-lg hover:shadow-[#B85A45]/20 flex items-center justify-center gap-3"
                    >
                        <span>إتمام التسجيل</span>
                        <BoxArrowInLeft size={22} />
                    </Button>

                    {isOffline && (
                        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500 text-xs text-center">
                            ⚠️ أنت تعمل في وضع عدم الاتصال، سيتم الحفظ عند العودة.
                        </div>
                    )}
                </Form>
            </div>

            <div className="mt-8 text-center animate-bounce-slow">
                <p className="text-gray-500 mb-2">لديك حساب بالفعل؟</p>
                <Link href="/CustomerLogin" className="text-[#B85A45] font-black text-xl hover:text-white transition-colors flex items-center gap-2 justify-center">
                    تسجيل دخول <i className="bi bi-arrow-left-short"></i>
                </Link>
            </div>
        </Container>
    )
}

export default UserRegister