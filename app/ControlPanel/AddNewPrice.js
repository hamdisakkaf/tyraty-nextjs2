"use client"

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from "next/navigation"
import axios from 'axios'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import { ArrowLeft, Save, Calendar, DollarSign, Tag } from 'lucide-react'
import amountToArabicText from '../../components/helpers/invoiceAmount'

function AddNewPrice() {
    const router = useRouter()

    const getAdminInfo = useSelector((state) => state.AdminAccount)
    const { userToken, branchId, SignInAdmin, adminEmail, statusAdminLogin, permissionAdmin } = getAdminInfo

    // ✅ Next.js: useRouter بدلاً من useNavigate
    useEffect(() => {
        if (!SignInAdmin) {
            router.push('/adminlogin')
        }
    }, [SignInAdmin, router])

    // ✅ Next.js: environment variables
    const isLocalhostEnabled = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true'
    const localhost = process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:5000'
    const remoteServer = process.env.NEXT_PUBLIC_API_URL || 'https://tyraty-server.onrender.com'
    const server = isLocalhostEnabled ? localhost : remoteServer

    const [submitting, setSubmitting] = useState(false)
    const [msg, setMsg] = useState('')
    const [msgVariant, setMsgVariant] = useState('secondary')

    const [priceSAR, setPrice] = useState('')
    const [selectedDate, setSelectedDate] = useState('')

    const [brands, setBrands] = useState([])
    const [paypoints, setPaypoints] = useState([])
    const [products, setProducts] = useState([])
    const [brandProducts, setBrandProducts] = useState([])

    const [brandid, setBrandId] = useState('')
    const [productId, setProductId] = useState('')
    const [paypointId, setPayPointId] = useState('')

    useEffect(() => {
        fetchbrands()
        fetchPaypoints()
        fetchproducts()
    }, [])

    useEffect(() => {
        if (products && products.length > 0 && brandid) {
            const filtered = products.filter(item => item.brands_brand_id == brandid)
            setBrandProducts(filtered)
        } else {
            setBrandProducts([])
        }
    }, [brandid, products])

    const fetchbrands = async () => {
        try {
            const res = await axios.get(`${server}/fetchbrands`)
            setBrands(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const fetchPaypoints = async () => {
        try {
            const res = await axios.get(`${server}/fetchPaypoints`)
            setPaypoints(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const fetchproducts = async () => {
        try {
            const res = await axios.get(`${server}/getire`)
            if (res.data) {
                setProducts(res.data)
            }
        } catch (error) {
            console.error("Error fetching posts:", error)
        }
    }

    const emptyFields = () => {
        setBrandId('')
        setProductId('')
        setPayPointId('')
        setPrice('')
        setSelectedDate('')
        setBrandProducts([])
    }

    const submitTire = async (e) => {
        e.preventDefault()

        if (!productId || !paypointId || !priceSAR) {
            setMsg('يرجى ملء جميع الحقول الإجبارية ⚠️')
            setMsgVariant('warning')
            return
        }

        setSubmitting(true)
        setMsg('جاري الحفظ...')
        setMsgVariant('info')

        const newProductPrice = {
            productId: productId,
            paypointId: paypointId,
            madeDate: selectedDate,
            priceSAR: priceSAR
        }

        try {
            const res = await axios.post(`${server}/addNewProductPrice`, newProductPrice)

            setMsg(res.data.message || 'تم الحفظ بنجاح ✅')
            setMsgVariant('success')

            setTimeout(() => {
                emptyFields()
                setMsg('')
            }, 2000)

        } catch (error) {
            const errorMsg = error.response?.data?.message || 'حصلت مشكلة في الادخال ❌'
            setMsg(errorMsg)
            setMsgVariant('danger')
            console.error("Submission Error:", error)

            setTimeout(() => setMsg(''), 4000)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value)
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

                    <h2 className="text-white font-black text-xl">
                        إضافة سعر جديد
                    </h2>

                    <div className="w-20"></div>
                </div>

                <Card className="bg-[#2B2B2B] border-[#F4F1EA]/5 shadow-xl">
                    <Card.Body className="p-6">
                        {/* ✅ التنبيه */}
                        {msg && (
                            <div className={`alert alert-${msgVariant} shadow-lg mb-4 text-center`} style={{ borderRadius: '12px' }}>
                                <strong>{msg}</strong>
                            </div>
                        )}

                        <Form onSubmit={submitTire}>
                            {/* ✅ البراند ونقطة البيع */}
                            <Row className="mb-4">
                                <Col md={6}>
                                    {brands.length > 0 && (
                                        <FloatingLabel controlId="floatingSelect" label="البراند">
                                            <Form.Select 
                                                size="lg" 
                                                value={brandid}
                                                onChange={(e) => setBrandId(e.target.value)}
                                                className="bg-black border-white/10 text-white"
                                            >
                                                <option value=""> -- البراند -- </option>
                                                {brands.map((val) => (
                                                    <option key={val.brand_id} value={val.brand_id}>
                                                        {val.brandName}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FloatingLabel>
                                    )}
                                </Col>
                                <Col md={6}>
                                    {paypoints.length > 0 && (
                                        <FloatingLabel controlId="floatingSelect" label="نقطة بيع/ موزع">
                                            <Form.Select 
                                                size="lg" 
                                                value={paypointId}
                                                onChange={(e) => setPayPointId(e.target.value)}
                                                className="bg-black border-white/10 text-white"
                                            >
                                                <option value=""> -- نقطة بيع -- </option>
                                                {paypoints.map((val) => (
                                                    <option key={val.pay_point_id} value={val.pay_point_id}>
                                                        {val.pay_point_Name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FloatingLabel>
                                    )}
                                </Col>
                            </Row>

                            {/* ✅ المنتجات والتاريخ */}
                            <Row className="mb-4">
                                <Col md={6}>
                                    {brandProducts.length > 0 && (
                                        <FloatingLabel controlId="floatingSelect" label="قائمة المنتجات">
                                            <Form.Select 
                                                size="lg" 
                                                value={productId}
                                                onChange={(e) => setProductId(e.target.value)}
                                                className="bg-black border-white/10 text-white"
                                            >
                                                <option value=""> -- المقاس -- </option>
                                                {brandProducts.map((val) => (
                                                    <option key={val.product_id} value={val.product_id}>
                                                        {val.tiresize}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FloatingLabel>
                                    )}
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="dateField">
                                        <Form.Label className="text-gray-400 text-xs flex items-center gap-2">
                                            <Calendar size={14} />
                                            تاريخ تصنيع الإطار
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                            className="bg-black border-white/10 text-white"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* ✅ السعر */}
                            <Row className="mb-4">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="text-[#9C4836] font-bold text-xs flex items-center gap-2">
                                            <DollarSign size={14} />
                                            سعر التكلفة بالريال السعودي
                                        </Form.Label>
                                        <Form.Control 
                                            type="number"
                                            value={priceSAR} 
                                            placeholder="0.00" 
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="bg-black border-white/10 text-white"
                                        />
                                        {priceSAR && (
                                            <small className="text-[#9C4836] mt-1 d-block">
                                                {amountToArabicText(Number(priceSAR))}
                                            </small>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* ✅ زر الحفظ */}
                            <div className="d-flex justify-content-end">
                                <Button 
                                    type="submit"
                                    disabled={submitting}
                                    className="d-flex align-items-center gap-2 px-4"
                                    style={{ 
                                        backgroundColor: submitting ? '#ccc' : '#9C4836',
                                        borderColor: submitting ? '#ccc' : '#9C4836',
                                        cursor: submitting ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {submitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            {' '} جاري الحفظ...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            حفظ السعر
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

export default AddNewPrice