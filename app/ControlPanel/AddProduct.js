"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useRouter } from "next/navigation"
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react'
import amountToArabicText from '../../components/helpers/invoiceAmount'
function AddProduct() {
    const router = useRouter()

    const getAdminInfo = useSelector((state) => state.AdminAccount)
    const { userToken, branchId, branchName, SignInAdmin, adminEmail, statusAdminLogin, permissionAdmin } = getAdminInfo

    // ✅ Next.js: useRouter بدلاً من useNavigate
    useEffect(() => {
        if (!SignInAdmin) {
            router.push('/adminlogin')
        }
    }, [SignInAdmin, router])

    const [data, setData] = useState([{ fname: "", lname: "" }])

    const [subsectionId, setSubsectionId] = useState("")
    const [brandname, setBrandName] = useState("")
    const [producNameAR, setProducNameAR] = useState("")
    const [producNameEN, setProducNameEN] = useState("")
    const [productDescription, setProductDescription] = useState("")
    const [ModelNo, setModelNo] = useState("")
    const [imageurl, setImageUrl] = useState("")
    const [price, setPrice] = useState("")
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(false)

    // ✅ Next.js: environment variables
    const isLocalhostEnabled = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true'
    const localhost = process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:5000'
    const remoteServer = process.env.NEXT_PUBLIC_API_URL || 'https://server.tyraty.com'
    const server = isLocalhostEnabled ? localhost : remoteServer

    useEffect(() => {
        if (msg.includes('نجاح')) {
            emptyFields()
            const timer = setTimeout(() => setMsg(''), 3000)
            return () => clearTimeout(timer)
        }
    }, [msg])

    const emptyFields = () => {
        setBrandName("")
        setProducNameAR("")
        setProducNameEN("")
        setProductDescription("")
        setModelNo("")
        setImageUrl("")
        setSubsectionId("")
        setPrice("")
        setData([{ fname: "", lname: "" }])
    }

    const handleClick = () => {
        setData([...data, { fname: "", lname: "" }])
    }

    const handleChange = (e, i) => {
        const { name, value } = e.target
        const onchangeVal = [...data]
        onchangeVal[i][name] = value
        setData(onchangeVal)
    }

    const handleDelete = (i) => {
        const deleteVal = [...data]
        deleteVal.splice(i, 1)
        setData(deleteVal)
    }

    const addProduct = async (e) => {
        e.preventDefault()
        setLoading(true)

        const product = {
            brandname: brandname,
            subsectionId: subsectionId,
            producNameAR: producNameAR,
            producNameEN: producNameEN,
            ModelNo: ModelNo,
            productDescription: productDescription,
            productSpecificationJSON: data,
            imageurl: imageurl,
            priceSAR: price
        }

        try {
            const res = await axios.post(`${server}/addProduct`, product)
            setMsg('✅ تم إضافة المنتج بنجاح')
        } catch (error) {
            console.error('Error:', error)
            setMsg('❌ حصلت مشكلة في الادخال')
        } finally {
            setLoading(false)
        }
    }

    // ✅ دالة العودة للخلف
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
                        إضافة منتج جديد
                    </h2>

                    <div className="w-20"></div>
                </div>

                <Card className="bg-[#2B2B2B] border-[#F4F1EA]/5 shadow-xl">
                    <Card.Body className="p-6">
                        {/* رسالة النجاح/الخطأ */}
                        {msg && (
                            <Badge 
                                bg={msg.includes('نجاح') ? 'success' : 'danger'} 
                                className="d-block mb-4 p-2 text-center"
                            >
                                {msg}
                            </Badge>
                        )}

                        <Form onSubmit={addProduct}>
                            <Row className="mb-4">
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-gray-400 text-xs">معرف القسم</Form.Label>
                                        <Form.Control 
                                            placeholder="subsectionId" 
                                            value={subsectionId} 
                                            onChange={(e) => setSubsectionId(e.target.value)}
                                            className="bg-black border-white/10 text-white"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-gray-400 text-xs">العلامة التجارية</Form.Label>
                                        <Form.Control 
                                            placeholder="Brand Name" 
                                            value={brandname} 
                                            onChange={(e) => setBrandName(e.target.value)}
                                            className="bg-black border-white/10 text-white"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-4">
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-gray-400 text-xs">اسم المنتج (عربي)</Form.Label>
                                        <Form.Control 
                                            placeholder="اسم المنتج" 
                                            value={producNameAR} 
                                            onChange={(e) => setProducNameAR(e.target.value)}
                                            className="bg-black border-white/10 text-white"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-gray-400 text-xs">اسم المنتج (إنجليزي)</Form.Label>
                                        <Form.Control 
                                            placeholder="Product Name EN" 
                                            value={producNameEN} 
                                            onChange={(e) => setProducNameEN(e.target.value)}
                                            className="bg-black border-white/10 text-white"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-gray-400 text-xs">رقم الموديل</Form.Label>
                                        <Form.Control 
                                            placeholder="Model No" 
                                            value={ModelNo} 
                                            onChange={(e) => setModelNo(e.target.value)}
                                            className="bg-black border-white/10 text-white"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-4">
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-gray-400 text-xs">السعر (ريال سعودي)</Form.Label>
                                        <Form.Control 
                                            type="number"
                                            placeholder="Price" 
                                            value={price} 
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="bg-black border-white/10 text-white"
                                        />
                                        {price && (
                                            <small className="text-[#9C4836] mt-1 d-block">
                                                {amountToArabicText(Number(price))}
                                            </small>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-gray-400 text-xs">رابط الصورة</Form.Label>
                                        <Form.Control 
                                            placeholder="Image Url" 
                                            value={imageurl} 
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            className="bg-black border-white/10 text-white"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-4">
                                <Form.Label className="text-gray-400 text-xs">وصف المنتج</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={4} 
                                    placeholder="Product Description" 
                                    value={productDescription} 
                                    onChange={(e) => setProductDescription(e.target.value)}
                                    className="bg-black border-white/10 text-white"
                                />
                            </Form.Group>

                            {/* ✅ مواصفات المنتج المُحسّنة */}
                            <Card className="bg-black/30 border-white/5 mb-4">
                                <Card.Body>
                                    <div className="flex items-center justify-between mb-3">
                                        <Form.Label className="text-gray-400 text-xs m-0">مواصفات المنتج</Form.Label>
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm" 
                                            onClick={handleClick}
                                            className="d-flex align-items-center gap-1"
                                        >
                                            <Plus size={16} />
                                            إضافة مواصفة
                                        </Button>
                                    </div>

                                    {data.map((val, i) => (
                                        <div key={i} className="d-flex gap-2 mb-2 align-items-center">
                                            <Form.Control 
                                                name="fname" 
                                                placeholder="المواصفة" 
                                                value={val.fname} 
                                                onChange={(e) => handleChange(e, i)}
                                                className="bg-black border-white/10 text-white"
                                            />
                                            <Form.Control 
                                                name="lname" 
                                                placeholder="القيمة" 
                                                value={val.lname} 
                                                onChange={(e) => handleChange(e, i)}
                                                className="bg-black border-white/10 text-white"
                                            />
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleDelete(i)}
                                                className="d-flex align-items-center"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    ))}

                                    <small className="text-gray-500 mt-2 d-block">
                                        {JSON.stringify(data)}
                                    </small>
                                </Card.Body>
                            </Card>

                            <div className="d-flex justify-content-end">
                                <Button 
                                    variant="primary" 
                                    type="submit" 
                                    disabled={loading}
                                    className="d-flex align-items-center gap-2 px-4"
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" />
                                            جاري الحفظ...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            حفظ المنتج
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

export default AddProduct