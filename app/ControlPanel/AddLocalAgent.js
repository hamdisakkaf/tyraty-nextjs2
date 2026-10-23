"use client"

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from "next/navigation"
import axios from 'axios'
import { Container, Row, Col, Form, Button, Card, FloatingLabel, Alert, Spinner } from 'react-bootstrap'
import { ArrowLeft, Save, UserPlus, Phone, Globe, ImageIcon } from 'lucide-react'

function LocalAgent() {
    const router = useRouter()

    const getAdminInfo = useSelector((state) => state.AdminAccount)
    const { userToken, branchId, branchName, SignInAdmin, adminEmail, statusAdminLogin, permissionAdmin } = getAdminInfo

    // ✅ Next.js: useRouter بدلاً من useNavigate
    useEffect(() => {
        if (!SignInAdmin) {
            router.push('/adminlogin')
        }
    }, [SignInAdmin, router])

    // ✅ Next.js: environment variables
    const isLocalhost = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';
const localhost = 'http://localhost:5000';
const remoteserver = process.env.NEXT_PUBLIC_API_URL;
const server = isLocalhost ? localhost : remoteserver;

    const [agentARname, setAgentARname] = useState('')
    const [agentENname, setAgentENname] = useState('')
    const [agentLogo, setAgentLogo] = useState('')
    const [mobileNumber, setMobileNumber] = useState('')
    const [saleswatsappphone, setSalesWatsappPhone] = useState('')

    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [msg, setMsg] = useState('')
    const [msgVariant, setMsgVariant] = useState('secondary')

    const validateValues = () => {
        let newErrors = {}

        if (!agentARname.trim()) {
            newErrors.agentARname = 'يرجى إدخال اسم الوكيل بالعربي'
        }

        if (!agentENname.trim()) {
            newErrors.agentENname = 'يرجى إدخال اسم الوكيل بالإنجليزي'
        }

        if (!mobileNumber || mobileNumber.length < 9) {
            newErrors.mobileNumber = 'رقم التلفون يجب أن لا يقل عن 9 أرقام'
        }

        if (!saleswatsappphone || saleswatsappphone.length < 9) {
            newErrors.saleswatsappphone = 'رقم واتساب المبيعات يجب أن لا يقل عن 9 أرقام'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const emptyFields = () => {
        setAgentARname('')
        setAgentENname('')
        setAgentLogo('')
        setMobileNumber('')
        setSalesWatsappPhone('')
        setErrors({})
    }

    const saveLocalAgent = async (e) => {
        e.preventDefault()

        if (!validateValues()) {
            setMsg('يرجى تصحيح الأخطاء أولاً ⚠️')
            setMsgVariant('warning')
            return
        }

        setSubmitting(true)
        setMsg('جاري الحفظ...')
        setMsgVariant('info')

        const localAgent = {
            agentARname: agentARname,
            agentENname: agentENname,
            agentLogo: agentLogo,
            mobileNumber: mobileNumber,
            saleswatsappphone: saleswatsappphone
        }

        try {
            const res = await axios.post(`${server}/addlocalAgent`, localAgent)

            setMsg('✅ تم الحفظ بنجاح')
            setMsgVariant('success')
            emptyFields()

            setTimeout(() => setMsg(''), 3000)
        } catch (err) {
            console.error('Error:', err)
            setMsg('❌ حدث خطأ، لم يتم حفظ بيانات الوكيل')
            setMsgVariant('danger')
            setTimeout(() => setMsg(''), 4000)
        } finally {
            setSubmitting(false)
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
                        <UserPlus size={20} className="text-[#9C4836]" />
                        إضافة وكيل محلي
                    </h2>

                    <div className="w-20"></div>
                </div>

                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="bg-[#2B2B2B] border-[#F4F1EA]/5 shadow-xl">
                            <Card.Body className="p-6">
                                {/* ✅ التنبيه */}
                                {msg && (
                                    <Alert 
                                        variant={msgVariant} 
                                        className="mb-4 shadow-sm text-center" 
                                        style={{ borderRadius: '12px' }}
                                    >
                                        <strong>{msg}</strong>
                                    </Alert>
                                )}

                                <Form onSubmit={saveLocalAgent} noValidate>
                                    {/* ✅ اسم الوكيل بالعربي */}
                                    <Form.Group className="mb-4">
                                        <FloatingLabel 
                                            controlId="agentARname" 
                                            label="🇸🇦 اسم الوكيل (عربي)"
                                        >
                                            <Form.Control 
                                                placeholder="اسم الوكيل بالعربي"
                                                value={agentARname}
                                                onChange={(e) => {
                                                    setAgentARname(e.target.value)
                                                    if (errors.agentARname) {
                                                        setErrors({...errors, agentARname: null})
                                                    }
                                                }}
                                                isInvalid={!!errors.agentARname}
                                                className="bg-black border-white/10 text-white"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.agentARname}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>

                                    {/* ✅ اسم الوكيل بالإنجليزي */}
                                    <Form.Group className="mb-4">
                                        <FloatingLabel 
                                            controlId="agentENname" 
                                            label="🌍 اسم الوكيل (إنجليزي)"
                                        >
                                            <Form.Control 
                                                placeholder="Agent Name (English)"
                                                value={agentENname}
                                                onChange={(e) => {
                                                    setAgentENname(e.target.value)
                                                    if (errors.agentENname) {
                                                        setErrors({...errors, agentENname: null})
                                                    }
                                                }}
                                                isInvalid={!!errors.agentENname}
                                                className="bg-black border-white/10 text-white"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.agentENname}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>

                                    {/* ✅ رابط الشعار */}
                                    <Form.Group className="mb-4">
                                        <FloatingLabel 
                                            controlId="agentLogo" 
                                            label="🖼️ رابط شعار الوكيل"
                                        >
                                            <Form.Control 
                                                placeholder="Image URL"
                                                value={agentLogo}
                                                onChange={(e) => setAgentLogo(e.target.value)}
                                                className="bg-black border-white/10 text-white"
                                            />
                                        </FloatingLabel>
                                        {agentLogo && (
                                            <div className="mt-2 p-2 bg-black/30 rounded-lg">
                                                <small className="text-gray-400">معاينة الشعار:</small>
                                                <img 
                                                    src={agentLogo} 
                                                    alt="Logo preview" 
                                                    className="mt-1" 
                                                    style={{ maxWidth: '80px', maxHeight: '80px' }}
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            </div>
                                        )}
                                    </Form.Group>

                                    {/* ✅ رقم التلفون */}
                                    <Form.Group className="mb-4">
                                        <FloatingLabel 
                                            controlId="mobileNumber" 
                                            label="📱 رقم التلفون"
                                        >
                                            <Form.Control 
                                                type="tel"
                                                placeholder="77xxxxxxx"
                                                value={mobileNumber}
                                                onChange={(e) => {
                                                    setMobileNumber(e.target.value)
                                                    if (errors.mobileNumber) {
                                                        setErrors({...errors, mobileNumber: null})
                                                    }
                                                }}
                                                isInvalid={!!errors.mobileNumber}
                                                className="bg-black border-white/10 text-white"
                                                style={{ direction: 'ltr' }}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.mobileNumber}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>

                                    {/* ✅ رقم واتساب المبيعات */}
                                    <Form.Group className="mb-4">
                                        <FloatingLabel 
                                            controlId="saleswatsappphone" 
                                            label="💬 رقم واتساب المبيعات"
                                        >
                                            <Form.Control 
                                                type="tel"
                                                placeholder="77xxxxxxx"
                                                value={saleswatsappphone}
                                                onChange={(e) => {
                                                    setSalesWatsappPhone(e.target.value)
                                                    if (errors.saleswatsappphone) {
                                                        setErrors({...errors, saleswatsappphone: null})
                                                    }
                                                }}
                                                isInvalid={!!errors.saleswatsappphone}
                                                className="bg-black border-white/10 text-white"
                                                style={{ direction: 'ltr' }}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.saleswatsappphone}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>

                                    {/* ✅ زر الحفظ */}
                                    <Button 
                                        type="submit"
                                        disabled={submitting}
                                        className="w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                                        style={{ 
                                            backgroundColor: submitting ? '#ccc' : '#9C4836',
                                            borderColor: submitting ? '#ccc' : '#9C4836',
                                            cursor: submitting ? 'not-allowed' : 'pointer',
                                            borderRadius: '12px'
                                        }}
                                    >
                                        {submitting ? (
                                            <>
                                                <Spinner animation="border" size="sm" />
                                                جاري الحفظ...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                حفظ بيانات الوكيل
                                            </>
                                        )}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default LocalAgent