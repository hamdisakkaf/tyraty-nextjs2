"use client"

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from "next/navigation"
import axios from 'axios'
import { Container, Row, Col, Form, Button, Card, Table, InputGroup, Alert, Spinner } from 'react-bootstrap'
import { Percent, User, TrendingUp, TrendingDown, Save, ArrowLeft, DollarSign, Settings } from 'lucide-react'
import amountToArabicText from '../../components/helpers/invoiceAmount'
// ============================================
// الصفحة الأولى: PricingSettings
// ============================================
export const PricingSettings = () => {
    const router = useRouter()

    const getAdminInfo = useSelector((state) => state.AdminAccount)
    const { userToken, branchId, SignInAdmin, adminEmail, statusAdminLogin, permissionAdmin } = getAdminInfo

    useEffect(() => {
        if (!SignInAdmin) {
            router.push('/adminlogin')
        }
    }, [SignInAdmin, router])

    const isLocalhostEnabled = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true'
    const localhost = process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:5000'
    const remoteServer = process.env.NEXT_PUBLIC_API_URL || 'https://tyraty-server.onrender.com'
    const server = isLocalhostEnabled ? localhost : remoteServer

    const [exchangeRate, setExchangeRate] = useState(530)
    const [globalMargin, setGlobalMargin] = useState(15)
    const [roundType, setRoundType] = useState('nearest-5')
    const [submitting, setSubmitting] = useState(false)
    const [msg, setMsg] = useState('')
    const [msgVariant, setMsgVariant] = useState('secondary')

    const [tiers, setTiers] = useState([
        { min: 0, max: 200, margin: 1, label: 'إطارات اقتصادية (أقل من 200)' },
        { min: 201, max: 600, margin: 1, label: 'إطارات متوسطة (201 - 600)' },
        { min: 601, max: 5000, margin: 1, label: 'إطارات فاخرة/شاحنات (أكبر من 600)' }
    ])

    const handleTierChange = (index, value) => {
        const newTiers = [...tiers]
        newTiers[index].margin = parseFloat(value)
        setTiers(newTiers)
    }

    const handleSave = async () => {
        const isConfirmed = window.confirm("⚠️ هل أنت متأكد؟ سيتم تغيير كافة أسعار الإطارات في الموقع بناءً على المعطيات الجديدة.")

        if (!isConfirmed) return

        setSubmitting(true)
        setMsg('جاري التحديث...')
        setMsgVariant('info')

        try {
            const response = await axios.post(`${server}/api/update-tiered-prices`, { exchangeRate, tiers })
            const { log } = response.data

            setMsg(`✅ تم التحديث بنجاح! إجمالي الإطارات: ${log.total} | تم تحديثها: ${log.success} | فشل: ${log.failed}`)
            setMsgVariant('success')

            setTimeout(() => setMsg(''), 5000)
        } catch (error) {
            setMsg('❌ حدث خطأ أثناء عملية التحديث، يرجى مراجعة الاتصال بالسيرفر.')
            setMsgVariant('danger')
            setTimeout(() => setMsg(''), 5000)
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
                <div className="flex items-center justify-between mb-6">
                    <button 
                        onClick={handleGoBack}
                        className="flex items-center gap-2 text-[#9C4836] hover:text-[#b85a45] transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-bold">العودة</span>
                    </button>

                    <h2 className="text-white font-black text-xl flex items-center gap-2">
                        <Settings size={20} className="text-[#9C4836]" />
                        نظام الشرائح المتغيرة للأرباح
                    </h2>

                    <div className="w-20"></div>
                </div>

                {msg && (
                    <div className={`alert alert-${msgVariant} shadow-lg mb-4 text-center`} style={{ borderRadius: '12px' }}>
                        <strong>{msg}</strong>
                    </div>
                )}

                <Card className="bg-[#2B2B2B] border-[#F4F1EA]/5 shadow-xl">
                    <Card.Header className="bg-[#9C4836] text-white py-3">
                        <h5 className="mb-0 flex items-center gap-2">
                            <DollarSign size={18} />
                            إعدادات الأسعار
                        </h5>
                    </Card.Header>
                    <Card.Body className="p-6">
                        <Row className="mb-4">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="text-gray-400 text-xs">سعر صرف الريال السعودي الحالي</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        value={exchangeRate} 
                                        onChange={(e) => setExchangeRate(e.target.value)}
                                        className="bg-black border-white/10 text-white"
                                    />
                                    {exchangeRate && (
                                        <small className="text-[#9C4836] mt-1 d-block">
                                            {amountToArabicText(Number(exchangeRate))}
                                        </small>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="text-gray-400 text-xs">نسبة الربح العامة (%)</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        value={globalMargin} 
                                        onChange={(e) => setGlobalMargin(e.target.value)}
                                        className="bg-black border-white/10 text-white"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label className="text-gray-400 text-xs">طريقة التقريب</Form.Label>
                                    <Form.Select 
                                        value={roundType}
                                        onChange={(e) => setRoundType(e.target.value)}
                                        className="bg-black border-white/10 text-white"
                                    >
                                        <option value="nearest-5">أقرب 5</option>
                                        <option value="nearest-10">أقرب 10</option>
                                        <option value="nearest-100">أقرب 100</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <h6 className="text-white mb-3">ضبط نسب الربح حسب سعر التكلفة:</h6>

                        <Table striped bordered hover className="text-center bg-black/30">
                            <thead className="bg-[#9C4836]/20">
                                <tr>
                                    <th className="text-white">الشريحة (بالريال السعودي)</th>
                                    <th className="text-white">نسبة الربح (%)</th>
                                </tr>
                            </thead>
                            <tbody className="text-white">
                                {tiers.map((tier, index) => (
                                    <tr key={index}>
                                        <td>{tier.label}</td>
                                        <td>
                                            <Form.Control 
                                                type="number" 
                                                value={tier.margin}
                                                onChange={(e) => handleTierChange(index, e.target.value)}
                                                className="bg-black border-white/10 text-white text-center"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <Button 
                            onClick={handleSave}
                            disabled={submitting}
                            className="w-100 py-3 mt-3 d-flex align-items-center justify-content-center gap-2"
                            style={{ 
                                backgroundColor: submitting ? '#ccc' : '#9C4836',
                                borderColor: submitting ? '#ccc' : '#9C4836',
                                cursor: submitting ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {submitting ? (
                                <>
                                    <Spinner animation="border" size="sm" />
                                    جاري التحديث...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    تطبيق وحفظ التغييرات لجميع الإطارات
                                </>
                            )}
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    )
}



export default PricingSettings