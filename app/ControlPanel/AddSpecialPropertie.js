"use client"

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from "next/navigation"
import axios from 'axios'
import { Container, Row, Col, Form, Button, Card, FloatingLabel, Alert, Spinner } from 'react-bootstrap'
import { ArrowLeft, Save, Star, ImageIcon, FileText } from 'lucide-react'

function AddSpecialPropertie() {
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

    const [specialpropertiename, setSpecialPropertieName] = useState('')
    const [specialpropertienamear, setSpecialPropertieNameAr] = useState('')
    const [specialpropertieiconurl, setSpecialPropertieIconURL] = useState('')
    const [specialpropertiedescribe, setSpecialPropertieDescribe] = useState('')

    const [msg, setMsg] = useState('')
    const [msgVariant, setMsgVariant] = useState('secondary')
    const [loading, setLoading] = useState(false)

    const emptyFields = () => {
        setSpecialPropertieName('')
        setSpecialPropertieNameAr('')
        setSpecialPropertieIconURL('')
        setSpecialPropertieDescribe('')
    }

    const saveSpecialPropertie = async (e) => {
        e.preventDefault()

        if (!specialpropertiename || !specialpropertienamear) {
            setMsg('يرجى ملء اسم الميزة بالإنجليزي والعربي ⚠️')
            setMsgVariant('warning')
            return
        }

        setLoading(true)
        setMsg('جاري الحفظ...')
        setMsgVariant('info')

        const newspecialpropertie = {
            specialpropertiename: specialpropertiename,
            specialpropertienamear: specialpropertienamear,
            specialpropertiedescribe: specialpropertiedescribe,
            specialpropertieiconurl: specialpropertieiconurl
        }

        try {
            await axios.post(`${server}/addnewspecialpropertie`, newspecialpropertie)

            setMsg('✅ تم إضافة الميزة بنجاح')
            setMsgVariant('success')
            emptyFields()

            setTimeout(() => setMsg(''), 3000)
        } catch (error) {
            console.error('Error:', error)
            setMsg('❌ حصلت مشكلة في الإدخال')
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
                        <Star size={20} className="text-[#9C4836]" />
                        إضافة ميزة خاصة
                    </h2>

                    <div className="w-20"></div>
                </div>

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

                        <Form onSubmit={saveSpecialPropertie}>
                            <Row className="mb-4">
                                <Col md={6}>
                                    <FloatingLabel 
                                        controlId="floatingInput" 
                                        label="اسم الميزة (إنجليزي)"
                                        className="mb-3"
                                    >
                                        <Form.Control 
                                            placeholder="Special Propertie Name" 
                                            value={specialpropertiename}
                                            onChange={(e) => setSpecialPropertieName(e.target.value)}
                                            className="bg-black border-white/10 text-white"
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col md={6}>
                                    <FloatingLabel 
                                        controlId="floatingInput" 
                                        label="اسم الميزة (عربي)"
                                        className="mb-3"
                                    >
                                        <Form.Control 
                                            placeholder="ميزة خاصة" 
                                            value={specialpropertienamear}
                                            onChange={(e) => setSpecialPropertieNameAr(e.target.value)}
                                            className="bg-black border-white/10 text-white"
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <Row className="mb-4">
                                <Col md={12}>
                                    <FloatingLabel 
                                        controlId="floatingInput" 
                                        label="رابط الأيقونة"
                                        className="mb-3"
                                    >
                                        <Form.Control 
                                            placeholder="Icon URL" 
                                            value={specialpropertieiconurl}
                                            onChange={(e) => setSpecialPropertieIconURL(e.target.value)}
                                            className="bg-black border-white/10 text-white"
                                        />
                                    </FloatingLabel>
                                    {specialpropertieiconurl && (
                                        <div className="mt-2 p-2 bg-black/30 rounded-lg">
                                            <small className="text-gray-400">معاينة الأيقونة:</small>
                                            <img 
                                                src={specialpropertieiconurl} 
                                                alt="Icon preview" 
                                                className="mt-1" 
                                                style={{ maxWidth: '50px', maxHeight: '50px' }}
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                    )}
                                </Col>
                            </Row>

                            <Row className="mb-4">
                                <Col md={12}>
                                    <FloatingLabel 
                                        controlId="floatingInput" 
                                        label="وصف الميزة"
                                    >
                                        <Form.Control 
                                            as="textarea" 
                                            rows={4}
                                            placeholder="وصف الميزة" 
                                            value={specialpropertiedescribe}
                                            onChange={(e) => setSpecialPropertieDescribe(e.target.value)}
                                            className="bg-black border-white/10 text-white"
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            <div className="d-flex justify-content-end">
                                <Button 
                                    type="submit"
                                    disabled={loading}
                                    className="d-flex align-items-center gap-2 px-4"
                                    style={{ 
                                        backgroundColor: loading ? '#ccc' : '#9C4836',
                                        borderColor: loading ? '#ccc' : '#9C4836',
                                        cursor: loading ? 'not-allowed' : 'pointer'
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
                                            حفظ الميزة
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    )
}

export default AddSpecialPropertie