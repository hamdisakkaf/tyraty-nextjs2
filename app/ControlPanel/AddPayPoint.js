"use client"

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from "next/navigation"
import axios from 'axios'
import { Container, Row, Col, Form, Button, Card, FloatingLabel, Alert, Spinner } from 'react-bootstrap'
import { ArrowLeft, Save, PlusCircle, Store, MapPin, Phone, Globe } from 'lucide-react'

const AddPayPoint = () => {
    const router = useRouter()

    const { userToken, adminEmail, branchName, storeAddress, SignInAdmin } = useSelector((state) => state.AdminAccount)

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

    const headers = { 'Authorization': `Bearer ${userToken}` }

    const [formData, setFormData] = useState({
        pay_point_Name: '',
        pay_point_Name_En: '',
        payPointsAdd: '',
        payPointslocation: '',
        payPointstel: '',
        payPointstel2: ''
    })

    const [status, setStatus] = useState({ loading: false, error: '', success: '' })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("البيانات المرسلة:", formData)

        setStatus({ loading: true, error: '', success: '' })

        try {
            const response = await axios.post(`${server}/api/paypoints/add`, formData, { headers })
            setStatus({ loading: false, error: '', success: response.data.message })

            // تفريغ النموذج بعد النجاح
            setFormData({
                pay_point_Name: '', 
                pay_point_Name_En: '', 
                payPointsAdd: '',
                payPointslocation: '', 
                payPointstel: '', 
                payPointstel2: ''
            })

            console.log('response api/paypoints/add', response)

            setTimeout(() => setStatus({ loading: false, error: '', success: '' }), 3000)
        } catch (err) {
            setStatus({ 
                loading: false, 
                error: err.response?.data?.message || 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً',
                success: '' 
            })
            setTimeout(() => setStatus({ loading: false, error: '', success: '' }), 4000)
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
                        <Store size={20} className="text-[#9C4836]" />
                        إضافة نقطة بيع جديدة
                    </h2>

                    <div className="w-20"></div>
                </div>

                <Row className="justify-content-center">
                    <Col md={10} lg={8}>
                        <Card className="bg-[#2B2B2B] border-[#F4F1EA]/5 shadow-xl">
                            <Card.Header className="bg-[#9C4836] text-white py-3">
                                <h5 className="mb-0 d-flex align-items-center gap-2">
                                    <PlusCircle size={20} />
                                    إضافة نقطة بيع جديدة
                                </h5>
                            </Card.Header>
                            <Card.Body className="p-6">
                                {status.error && (
                                    <Alert variant="danger" className="mb-4 shadow-sm" style={{ borderRadius: '12px' }}>
                                        {status.error}
                                    </Alert>
                                )}
                                {status.success && (
                                    <Alert variant="success" className="mb-4 shadow-sm" style={{ borderRadius: '12px' }}>
                                        {status.success}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        {/* الاسم بالعربي والانجليزي */}
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                                    <Store size={14} />
                                                    الاسم (عربي)
                                                </Form.Label>
                                                <Form.Control 
                                                    required 
                                                    name="pay_point_Name"
                                                    value={formData.pay_point_Name} 
                                                    onChange={handleChange}
                                                    placeholder="مثال: شركة البركة للإطارات"
                                                    className="bg-black border-white/10 text-white"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                                    <Globe size={14} />
                                                    الاسم (English)
                                                </Form.Label>
                                                <Form.Control 
                                                    required 
                                                    name="pay_point_Name_En"
                                                    value={formData.pay_point_Name_En} 
                                                    onChange={handleChange}
                                                    placeholder="Example: Al-Baraka Tires Co."
                                                    className="bg-black border-white/10 text-white"
                                                />
                                            </Form.Group>
                                        </Col>

                                        {/* العنوان والموقع */}
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                                    <MapPin size={14} />
                                                    العنوان (الوصف)
                                                </Form.Label>
                                                <Form.Control 
                                                    name="payPointsAdd"
                                                    value={formData.payPointsAdd} 
                                                    onChange={handleChange}
                                                    placeholder="مثال: شارع الستين - بجوار محطة الكهرباء"
                                                    className="bg-black border-white/10 text-white"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                                    <MapPin size={14} />
                                                    الموقع (رابط خرائط جوجل)
                                                </Form.Label>
                                                <Form.Control 
                                                    name="payPointslocation"
                                                    value={formData.payPointslocation} 
                                                    onChange={handleChange}
                                                    placeholder="https://goo.gl/maps/..."
                                                    className="bg-black border-white/10 text-white"
                                                />
                                            </Form.Group>
                                        </Col>

                                        {/* أرقام التواصل */}
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                                    <Phone size={14} />
                                                    رقم الهاتف 1
                                                </Form.Label>
                                                <Form.Control 
                                                    required 
                                                    name="payPointstel"
                                                    value={formData.payPointstel} 
                                                    onChange={handleChange}
                                                    placeholder="01-XXXXXX"
                                                    className="bg-black border-white/10 text-white"
                                                    style={{ direction: 'ltr' }}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                                    <Phone size={14} />
                                                    رقم الهاتف 2 (اختياري)
                                                </Form.Label>
                                                <Form.Control 
                                                    name="payPointstel2"
                                                    value={formData.payPointstel2} 
                                                    onChange={handleChange}
                                                    placeholder="01-XXXXXX"
                                                    className="bg-black border-white/10 text-white"
                                                    style={{ direction: 'ltr' }}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <div className="text-end mt-4">
                                        <Button 
                                            type="submit" 
                                            className="px-5 py-2 fw-bold shadow-sm d-flex align-items-center gap-2"
                                            style={{ 
                                                backgroundColor: status.loading ? '#ccc' : '#9C4836',
                                                borderColor: status.loading ? '#ccc' : '#9C4836',
                                                cursor: status.loading ? 'not-allowed' : 'pointer',
                                                borderRadius: '12px'
                                            }}
                                            disabled={status.loading}
                                        >
                                            {status.loading ? (
                                                <>
                                                    <Spinner size="sm" />
                                                    جاري الحفظ...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={18} />
                                                    حفظ نقطة البيع
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default AddPayPoint