"use client"

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from "next/navigation"
import axios from 'axios'
import { Container, Row, Col, Form, Button, Card, FloatingLabel, Alert, Spinner } from 'react-bootstrap'
import { ArrowLeft, Save, PlusCircle, Globe, Award, TrendingUp, ImageIcon, Building2 } from 'lucide-react'

const AddBrand = () => {
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
    const isLocalhostEnabled = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true'
    const localhost = process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:5000'
    const remoteServer = process.env.NEXT_PUBLIC_API_URL || 'https://server.tyraty.com'
    const server = isLocalhostEnabled ? localhost : remoteServer

    const headers = { 'Authorization': `Bearer ${userToken}` }

    const [brandName, setBrandName] = useState('')
    const [brandNameAr, setBrandNameAr] = useState('')
    const [brandLogo, setBrandLogo] = useState('')
    const [coo, setCOO] = useState('')
    const [brandValueRankingYear, setBrandValueRankingYear] = useState('')
    const [brandValueRanking, setBrandValueRanking] = useState('')
    const [BSI, setBSI] = useState('')
    const [localagents, setLocalAgents] = useState([])
    const [agentid, setAgentId] = useState('')

    const [msg, setMsg] = useState('')
    const [msgVariant, setMsgVariant] = useState('secondary')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchbrands()
        fetchlocalagents()
    }, [])

    const fetchbrands = async () => {
        try {
            await axios.get(`${server}/fetchbrands`, { headers })
        } catch (error) {
            console.error(error)
        }
    }

    const fetchlocalagents = async () => {
        try {
            const res = await axios.get(`${server}/fetchlocalagents`)
            setLocalAgents(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const emptyFields = () => {
        setBrandName('')
        setBrandNameAr('')
        setBrandLogo('')
        setCOO('')
        setBrandValueRankingYear('')
        setBrandValueRanking('')
        setBSI('')
        setAgentId('')
    }

    const saveBrand = async (e) => {
        e.preventDefault()

        if (!brandName || !brandNameAr) {
            setMsg('يرجى ملء اسم البراند بالإنجليزي والعربي ⚠️')
            setMsgVariant('warning')
            return
        }

        setLoading(true)
        setMsg('جاري الحفظ...')
        setMsgVariant('info')

        const newBrand = {
            brandName,
            brandNameAr,
            brandLogo,
            coo,
            brandValueRankingYear,
            brandValueRanking,
            BSI,
            agentid: agentid || null
        }

        try {
            await axios.post(`${server}/addBrand`, newBrand)

            setMsg('✅ تم إضافة البراند بنجاح')
            setMsgVariant('success')
            emptyFields()

            setTimeout(() => setMsg(''), 3000)
        } catch (error) {
            console.error('Error saving brand:', error)
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
                        <Award size={20} className="text-[#9C4836]" />
                        إضافة براند جديد
                    </h2>

                    <div className="w-20"></div>
                </div>

                <Row className="justify-content-center">
                    <Col md={10} lg={8}>
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

                                <Form onSubmit={saveBrand}>
                                    <Row>
                                        {/* اسم البراند بالإنجليزي */}
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                                    <Globe size={14} />
                                                    Brand Name (English)
                                                </Form.Label>
                                                <Form.Control 
                                                    placeholder="GT" 
                                                    value={brandName}
                                                    onChange={(e) => setBrandName(e.target.value)}
                                                    className="bg-black border-white/10 text-white"
                                                />
                                            </Form.Group>
                                        </Col>

                                        {/* اسم البراند بالعربي */}
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                                    <Award size={14} />
                                                    اسم العلامة (عربي)
                                                </Form.Label>
                                                <Form.Control 
                                                    placeholder="اسم العلامة" 
                                                    value={brandNameAr}
                                                    onChange={(e) => setBrandNameAr(e.target.value)}
                                                    className="bg-black border-white/10 text-white"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* رابط الشعار */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                            <ImageIcon size={14} />
                                            رابط الشعار (Logo URL)
                                        </Form.Label>
                                        <Form.Control 
                                            placeholder="https://..." 
                                            value={brandLogo}
                                            onChange={(e) => setBrandLogo(e.target.value)}
                                            className="bg-black border-white/10 text-white"
                                        />
                                        {brandLogo && (
                                            <div className="mt-2 p-2 bg-black/30 rounded-lg">
                                                <small className="text-gray-400">معاينة الشعار:</small>
                                                <img 
                                                    src={brandLogo} 
                                                    alt="Logo preview" 
                                                    className="mt-1" 
                                                    style={{ maxWidth: '80px', maxHeight: '80px' }}
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            </div>
                                        )}
                                    </Form.Group>

                                    {/* بلد المنشأ */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                            <Globe size={14} />
                                            بلد المنشأ (COO)
                                        </Form.Label>
                                        <Form.Control 
                                            placeholder="مثال: الصين، اليابان، كوريا..." 
                                            value={coo}
                                            onChange={(e) => setCOO(e.target.value)}
                                            className="bg-black border-white/10 text-white"
                                        />
                                    </Form.Group>

                                    <Row>
                                        {/* سنة التصنيف */}
                                        <Col md={4}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                                    <TrendingUp size={14} />
                                                    سنة التصنيف
                                                </Form.Label>
                                                <Form.Control 
                                                    type="number"
                                                    placeholder="2024" 
                                                    value={brandValueRankingYear}
                                                    onChange={(e) => setBrandValueRankingYear(e.target.value)}
                                                    className="bg-black border-white/10 text-white"
                                                />
                                            </Form.Group>
                                        </Col>

                                        {/* القيمة العالمية */}
                                        <Col md={4}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                                    <TrendingUp size={14} />
                                                    القيمة العالمية
                                                </Form.Label>
                                                <Form.Control 
                                                    type="number"
                                                    placeholder="القيمة العالمية للعلامة" 
                                                    value={brandValueRanking}
                                                    onChange={(e) => setBrandValueRanking(e.target.value)}
                                                    className="bg-black border-white/10 text-white"
                                                />
                                            </Form.Group>
                                        </Col>

                                        {/* مؤشر القوة */}
                                        <Col md={4}>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                                    <Award size={14} />
                                                    مؤشر القوة (BSI)
                                                </Form.Label>
                                                <Form.Control 
                                                    type="number"
                                                    placeholder="BSI" 
                                                    value={BSI}
                                                    onChange={(e) => setBSI(e.target.value)}
                                                    className="bg-black border-white/10 text-white"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* الوكيل المحلي */}
                                    {localagents.length > 0 && (
                                        <Form.Group className="mb-4">
                                            <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                                <Building2 size={14} />
                                                الوكيل المحلي
                                            </Form.Label>
                                            <Form.Select 
                                                size="lg"
                                                value={agentid}
                                                onChange={(e) => setAgentId(e.target.value)}
                                                className="bg-black border-white/10 text-white"
                                            >
                                                <option value="">-- اختر الوكيل --</option>
                                                {localagents.map((val) => (
                                                    <option key={val.agentid} value={val.agentid}>
                                                        {val.agentENname} - {val.agentARname}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    )}

                                    {/* زر الحفظ */}
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
                                                    حفظ البراند
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

export default AddBrand