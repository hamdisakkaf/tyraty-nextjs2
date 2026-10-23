"use client"

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from "next/navigation"
import axios from 'axios'
import { Container, Row, Col, Form, Button, Card, Table, InputGroup, Alert, Spinner } from 'react-bootstrap'
import { Percent, User, TrendingUp, TrendingDown, Save, ArrowLeft, DollarSign, Settings } from 'lucide-react'
import amountToArabicText from '../../components/helpers/invoiceAmount'

export const Agentpriceupdate = () => {
    const router = useRouter()

    const { userToken, adminEmail, branchName, storeAddress, SignInAdmin } = useSelector((state) => state.AdminAccount)

    useEffect(() => {
        if (!SignInAdmin) {
            router.push('/adminlogin')
        }
    }, [SignInAdmin, router])

    const isLocalhost = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';
const localhost = 'http://localhost:5000';
const remoteserver = process.env.NEXT_PUBLIC_API_URL;
const server = isLocalhost ? localhost : remoteserver;

    const headers = { 'Authorization': `Bearer ${userToken}` }

    const [payPoints, setPayPoints] = useState([])
    const [selectedPayPoint, setSelectedPayPoint] = useState('')
    const [percentage, setPercentage] = useState('')
    const [action, setAction] = useState('increase')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    useEffect(() => {
        const fetchPayPoints = async () => {
            try {
                const res = await axios.get(`${server}/fetchPaypoints`)
                setPayPoints(res.data)
            } catch (err) {
                console.error("خطأ في جلب الوكلاء", err)
            }
        }
        fetchPayPoints()
    }, [server])

    const handleUpdate = async (e) => {
        e.preventDefault()

        if (!selectedPayPoint || !percentage) {
            setMessage({ type: 'danger', text: 'يرجى اختيار الوكيل وتحديد النسبة المئوية.' })
            return
        }

        setLoading(true)
        setMessage({ type: '', text: '' })

        try {
            const response = await axios.post(`${server}/api/prices/bulk-update-percent`, {
                payPointId: selectedPayPoint,
                percentage: percentage,
                action: action
            }, { headers })

            setMessage({ type: 'success', text: response.data.message })
            setPercentage('')

            setTimeout(() => setMessage({ type: '', text: '' }), 5000)
        } catch (err) {
            setMessage({ 
                type: 'danger', 
                text: err.response?.data?.message || 'حدث خطأ أثناء تحديث الأسعار.' 
            })
            setTimeout(() => setMessage({ type: '', text: '' }), 5000)
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
                <div className="flex items-center justify-between mb-6">
                    <button 
                        onClick={handleGoBack}
                        className="flex items-center gap-2 text-[#9C4836] hover:text-[#b85a45] transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-bold">العودة</span>
                    </button>

                    <h2 className="text-white font-black text-xl flex items-center gap-2">
                        <Percent size={20} className="text-[#9C4836]" />
                        تحديث أسعار الوكلاء جماعياً
                    </h2>

                    <div className="w-20"></div>
                </div>

                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="bg-[#2B2B2B] border-[#F4F1EA]/5 shadow-xl">
                            <Card.Header className="bg-[#9C4836] text-white py-3">
                                <h4 className="mb-0 d-flex align-items-center justify-content-center gap-2">
                                    <Percent size={20} />
                                    تحديث الأسعار
                                </h4>
                            </Card.Header>
                            <Card.Body className="p-6">
                                {message.text && (
                                    <Alert variant={message.type} className="mb-4 shadow-sm" style={{ borderRadius: '12px' }}>
                                        {message.text}
                                    </Alert>
                                )}

                                <Form onSubmit={handleUpdate}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                            <User size={16} />
                                            اختر نقطة البيع / الوكيل
                                        </Form.Label>
                                        <Form.Select 
                                            value={selectedPayPoint} 
                                            onChange={(e) => setSelectedPayPoint(e.target.value)}
                                            className="bg-black border-white/10 text-white py-2"
                                        >
                                            <option value="">-- اختر الوكيل --</option>
                                            {payPoints.map(point => (
                                                <option key={point.pay_point_id} value={point.pay_point_id}>
                                                    {point.pay_point_Name} (ID: {point.pay_point_id})
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="text-gray-400 text-xs">نوع العملية</Form.Label>
                                        <Row className="g-2">
                                            <Col>
                                                <Button 
                                                    variant={action === 'increase' ? 'success' : 'outline-success'} 
                                                    className="w-100 py-2 d-flex align-items-center justify-content-center"
                                                    onClick={() => setAction('increase')}
                                                >
                                                    <TrendingUp size={18} className="me-2" /> 
                                                    زيادة السعر
                                                </Button>
                                            </Col>
                                            <Col>
                                                <Button 
                                                    variant={action === 'decrease' ? 'danger' : 'outline-danger'} 
                                                    className="w-100 py-2 d-flex align-items-center justify-content-center"
                                                    onClick={() => setAction('decrease')}
                                                >
                                                    <TrendingDown size={18} className="me-2" /> 
                                                    خفض السعر
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                            <DollarSign size={16} />
                                            النسبة المئوية للـ{action === 'increase' ? 'زيادة' : 'نقصان'}
                                        </Form.Label>
                                        <InputGroup>
                                            <Form.Control 
                                                type="number" 
                                                placeholder="مثلاً: 5" 
                                                value={percentage}
                                                onChange={(e) => setPercentage(e.target.value)}
                                                step="0.1"
                                                className="bg-black border-white/10 text-white py-2"
                                            />
                                            <InputGroup.Text className="bg-[#2B2B2B] text-white border-white/10">
                                                %
                                            </InputGroup.Text>
                                        </InputGroup>
                                        {percentage && (
                                            <small className="text-[#9C4836] mt-1 d-block">
                                                {amountToArabicText(Number(percentage))} بالمئة
                                            </small>
                                        )}
                                    </Form.Group>

                                    <Button 
                                        type="submit" 
                                        className="w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                                        style={{ 
                                            backgroundColor: loading ? '#ccc' : '#9C4836',
                                            borderColor: loading ? '#ccc' : '#9C4836',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            borderRadius: '12px'
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner animation="border" size="sm" />
                                                جاري التحديث...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                تطبيق التحديث النهائي
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

export default Agentpriceupdate