"use client"

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from "next/navigation"
import axios from 'axios'
import { Container, Row, Col, Form, Button, Card, FloatingLabel, Alert, Spinner } from 'react-bootstrap'
import { ArrowLeft, Save, DollarSign, TrendingUp, Globe } from 'lucide-react'
import amountToArabicText from '../../components/helpers/invoiceAmount'

function ExchangeRates() {
    const router = useRouter()

    const getAdminInfo = useSelector((state) => state.AdminAccount)
    const { userToken, branchId, branchName, adminId, SignInAdmin, adminEmail, statusAdminLogin, permissionAdmin } = getAdminInfo

    // ✅ Next.js: useRouter بدلاً من useNavigate
    useEffect(() => {
        if (!SignInAdmin) {
            router.push('/adminlogin')
        }
    }, [SignInAdmin, router])

    // ✅ Next.js: environment variables
    const isLocalhostEnabled = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true'
    const localhost = process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:5000'
    const remoteServer = process.env.NEXT_PUBLIC_API_URL || 'https://server.tyraty.com'
    const server = isLocalhostEnabled ? localhost : remoteServer

    const [dolarexchangeRial, setDolarexchangeRial] = useState('')
    const [KSAxchangeRial, setKSAxchangeRial] = useState('')

    const [msg, setMsg] = useState('')
    const [msgVariant, setMsgVariant] = useState('secondary')
    const [loading, setLoading] = useState(false)

    const emptyFields = () => {
        setDolarexchangeRial('')
        setKSAxchangeRial('')
    }

    const saveExchangeRates = async (e) => {
        e.preventDefault()

        // ✅ Validation محسّن
        if (!dolarexchangeRial) {
            setMsg('❌ يرجى إدخال سعر صرف الدولار مقابل الريال اليمني')
            setMsgVariant('warning')
            return
        }

        if (!KSAxchangeRial) {
            setMsg('❌ يرجى إدخال سعر صرف الريال السعودي مقابل الريال اليمني')
            setMsgVariant('warning')
            return
        }

        setLoading(true)
        setMsg('جاري الحفظ...')
        setMsgVariant('info')

        const exchangeratestoday = {
            dolarexchangeRial: Number(dolarexchangeRial),
            KSAxchangeRial: Number(KSAxchangeRial),
            admin_id: adminId
        }

        try {
            await axios.post(`${server}/updateexchangerates`, exchangeratestoday)

            setMsg('✅ تم تعديل سعر العملة بنجاح')
            setMsgVariant('success')
            emptyFields()

            setTimeout(() => setMsg(''), 3000)
        } catch (error) {
            console.error('Error:', error)
            setMsg('❌ حصلت مشكلة في التعديل')
            setMsgVariant('danger')
            setTimeout(() => setMsg(''), 4000)
        } finally {
            setLoading(false)
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
                        <Globe size={20} className="text-[#9C4836]" />
                        تعديل سعر العملة اليومي
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

                                <Form onSubmit={saveExchangeRates}>
                                    {/* ✅ سعر الدولار */}
                                    <Form.Group className="mb-4">
                                        <FloatingLabel 
                                            controlId="dollarRate" 
                                            label="💵 قيمة صرف الدولار مقابل الريال اليمني"
                                        >
                                            <Form.Control 
                                                type="number"
                                                placeholder="سعر الريال اليمني مقابل الدولار" 
                                                value={dolarexchangeRial} 
                                                required 
                                                onChange={(e) => setDolarexchangeRial(e.target.value)}
                                                className="bg-black border-white/10 text-white"
                                            />
                                        </FloatingLabel>
                                        {dolarexchangeRial && (
                                            <small className="text-[#9C4836] mt-1 d-block">
                                                {amountToArabicText(Number(dolarexchangeRial))} ريال يمني
                                            </small>
                                        )}
                                    </Form.Group>

                                    {/* ✅ سعر الريال السعودي */}
                                    <Form.Group className="mb-4">
                                        <FloatingLabel 
                                            controlId="ksaRate" 
                                            label="🇸🇦 قيمة صرف الريال السعودي مقابل الريال اليمني"
                                        >
                                            <Form.Control 
                                                type="number"
                                                placeholder="قيمة الريال اليمني مقابل الريال السعودي" 
                                                value={KSAxchangeRial}  
                                                required
                                                onChange={(e) => setKSAxchangeRial(e.target.value)}
                                                className="bg-black border-white/10 text-white"
                                            />
                                        </FloatingLabel>
                                        {KSAxchangeRial && (
                                            <small className="text-[#9C4836] mt-1 d-block">
                                                {amountToArabicText(Number(KSAxchangeRial))} ريال يمني
                                            </small>
                                        )}
                                    </Form.Group>

                                    {/* ✅ معلومات إضافية */}
                                    <div className="bg-black/30 rounded-lg p-3 mb-4">
                                        <h6 className="text-gray-400 text-xs mb-2">📊 معلومات التحديث:</h6>
                                        <div className="text-gray-500 text-xs">
                                            <p className="mb-1">• سيتم تحديث أسعار جميع المنتجات تلقائياً</p>
                                            <p className="mb-1">• التحديث يؤثر على الفواتير الجديدة فقط</p>
                                            <p className="mb-0">• آخر تحديث: {new Date().toLocaleDateString('ar-YE')}</p>
                                        </div>
                                    </div>

                                    {/* ✅ زر الحفظ */}
                                    <Button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                                        style={{ 
                                            backgroundColor: loading ? '#ccc' : '#9C4836',
                                            borderColor: loading ? '#ccc' : '#9C4836',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            borderRadius: '12px'
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner animation="border" size="sm" />
                                                جاري الحفظ...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                حفظ أسعار العملة
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

export default ExchangeRates