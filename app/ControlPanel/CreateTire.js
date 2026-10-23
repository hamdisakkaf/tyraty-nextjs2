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
import { Layers, Zap, ArrowLeft, Save, AlertTriangle } from 'lucide-react'
import amountToArabicText from '../../components/helpers/invoiceAmount'

function CreateTire() {
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
    const isLocalhost = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';
const localhost = 'http://localhost:5000';
const remoteserver = process.env.NEXT_PUBLIC_API_URL;
const server = isLocalhost ? localhost : remoteserver;

    const [submitting, setSubmitting] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [alertVariant, setAlertVariant] = useState('success')
    const [msg, setMsg] = useState('')

    const [tiresize, setTireSize] = useState('')
    const [productName, setProductName] = useState('') 
    const [tire_slug, setTireSlug] = useState('')
    const [imageurl, setImageUrl] = useState('')
    const [Maxload, setMaxload] = useState('')
    const [MaxSpeed, setMaxSpeed] = useState('')
    const [Depthoftread, setDepthoftread] = useState('')
    const [traction, setTraction] = useState('')
    const [treadwear, setTreadwear] = useState('')
    const [temperature, setTemperature] = useState('')
    const [Wetgripclass, setWetgripclass] = useState('')
    const [noiseClass, setnoiseClass] = useState('')
    const [priceSAR, setPrice] = useState('')
    const [MadeIn, setMadeIn] = useState('')

    const [brands, setBrands] = useState([])
    const [specialProperties, setSpecialProperties] = useState([])
    const [paypoints, setPaypoints] = useState([])
    const [areastypes, setAreastypes] = useState([])
    const [roadtypes, setRoadtypes] = useState([])

    const [brandid, setBrandId] = useState('')
    const [brandname, setBrandname] = useState('')
    const [specialPropertiesId, setSpecialPropertiesId] = useState('')
    const [areastype_area_id, setAreaTypeId] = useState('')
    const [roadtypeid, setRoadTypeId] = useState('')
    const [paypointId, setPayPointId] = useState('')

    const [tireClassification, setTireClassification] = useState('Performance')

    const [asymmetrical, setAsymmetrical] = useState(false)
    const [symmetrical, setSymmetrical] = useState(false)
    const [directional, setDirectional] = useState(false)
    const [sports, setSports] = useState(false)
    const [waterEvacuation, setWaterEvacuation] = useState(false)
    const [handling, setHandling] = useState(false)
    const [fuelefficiency, setFuelEfficiency] = useState(0)
    const [status, setStatus] = useState('published');

    useEffect(() => {
        fetchbrands()
        fetchPaypoints()
        fetchspecialproperties()
        fetchareastypes()
        fetchroadtype()
    }, [])

    const fetchspecialproperties = async () => {
        try {
            const res = await axios.get(`${server}/fetchspecialproperties`)
            setSpecialProperties(res.data)
        } catch (error) {
            console.error(error)
        }
    }

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

    const fetchareastypes = async () => {
        try {
            const res = await axios.get(`${server}/fetchareastypes`)
            setAreastypes(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const fetchroadtype = async () => {
        try {
            const res = await axios.get(`${server}/fetchroadtype`)
            setRoadtypes(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const emptyFields = () => {
        setBrandId('')
        setTireSize('')
        setProductName('')
        setImageUrl('')
        setMaxload('')
        setMaxSpeed('')
        setDepthoftread('')
        setTraction('')
        setTreadwear('')
        setTemperature('')
        setFuelEfficiency(0)
        setWetgripclass('')
        setnoiseClass('')
        setPrice('')
        setSpecialPropertiesId('')
        setAreaTypeId('')
        setRoadTypeId('')
        setPayPointId('')
        setAsymmetrical(false)
        setSymmetrical(false)
        setDirectional(false)
        setSports(false)
        setWaterEvacuation(false)
        setHandling(false)
        
    }

    const handleTireClassification = (e) => {
        setTireClassification(e.target.value)
    }

    const tire = {
        brandid, brandname, productName, 
        tire_slug: tire_slug ? tire_slug : productName + tiresize,
        tiresize, imageurl,
        Maxload, MaxSpeed, Depthoftread, traction, treadwear,
        temperature, Wetgripclass, noiseClass, tireClassification,
        asymmetrical: asymmetrical ? 1 : 0,
        sports: sports ? 1 : 0,
        waterEvacuation: waterEvacuation ? 1 : 0,
        handling: handling ? 1 : 0,
        fuelefficiency: fuelefficiency ? 1 : 0,
        symmetrical: symmetrical ? 1 : 0,
        directional: directional ? 1 : 0,
        specialPropertiesId: specialPropertiesId || null,
        areastype_area_id: areastype_area_id || null,
        roadtypeid: roadtypeid || null,
        paypointId: paypointId || null,
        priceSAR: priceSAR || 0,
        status
    }

    const submitTire = async (e) => {
        e.preventDefault()

        if (!brandid) {
            setMsg('يرجى اختيار البراند أولاً ⚠️')
            setAlertVariant('warning')
            setShowAlert(true)
            return
        }

        setSubmitting(true)
        setMsg('جاري الحفظ...')

        try {
            const response = await axios.post(`${server}/createtire`, tire)

            if (response.status === 201 || response.status === 200) {
                setMsg('تم إضافة الإطار بنجاح ✅')
                setAlertVariant('success')
                setShowAlert(true)
                emptyFields()

                setTimeout(() => {
                    setShowAlert(false)
                }, 3000)
            }
        } catch (error) {
            console.error('Error during submission:', error)
            setMsg('حصلت مشكلة أثناء الحفظ ❌')
            setAlertVariant('danger')
            setShowAlert(true)

            setTimeout(() => setShowAlert(false), 4000)

            if (error.response && error.response.data) {
                setMsg(`فشل الإدخال: ${error.response.data.message}`)
            } else {
                setMsg('حصلت مشكلة في الاتصال بالسيرفر')
            }
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

                    <h2 className="text-white font-black text-xl">
                        إضافة إطار جديد
                    </h2>

                    <div className="w-20"></div>
                </div>

                {/* ✅ التنبيه */}
                {showAlert && (
                    <div 
                        className={`alert alert-${alertVariant} shadow-lg mb-4 text-center`}
                        style={{ 
                            borderRadius: '12px',
                            animation: 'fadeInDown 0.5s ease'
                        }}
                    >
                        <strong>{msg}</strong>
                    </div>
                )}

                <Card className="bg-[#2B2B2B] border-[#F4F1EA]/5 shadow-xl">
                    <Card.Body className="p-6">
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
                                                <option value=""> -- اختر البراند -- </option>
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

                            {/* ✅ الميزات والمنطقة والطريق */}
                            <Row className="mb-4">
                                <Col md={4}>
                                    {specialProperties.length > 0 && (
                                        <FloatingLabel controlId="floatingSelect" label="قائمة الميزات">
                                            <Form.Select 
                                                size="lg" 
                                                value={specialPropertiesId} 
                                                onChange={(e) => setSpecialPropertiesId(e.target.value)}
                                                className="bg-black border-white/10 text-white"
                                            >
                                                <option value=""> -- الميزة -- </option>
                                                {specialProperties.map((val) => (
                                                    <option key={val.specialProperties_id} value={val.specialProperties_id}>
                                                        {val.specialpropertiename}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FloatingLabel>
                                    )}
                                </Col>
                                <Col md={4}>
                                    {areastypes.length > 0 && (
                                        <FloatingLabel controlId="floatingSelect" label="نوع المنطقة المفضلة">
                                            <Form.Select 
                                                size="lg" 
                                                value={areastype_area_id} 
                                                onChange={(e) => setAreaTypeId(e.target.value)}
                                                className="bg-black border-white/10 text-white"
                                            >
                                                <option value="">-- نوع المنطقة --</option>
                                                {areastypes.map((area) => (
                                                    <option key={area.area_id} value={area.area_id}>
                                                        {area.area_name_ar}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FloatingLabel>
                                    )}
                                </Col>
                                <Col md={4}>
                                    {roadtypes.length > 0 && (
                                        <FloatingLabel controlId="floatingSelect" label="نوع الطريق">
                                            <Form.Select 
                                                size="lg" 
                                                value={roadtypeid} 
                                                onChange={(e) => setRoadTypeId(e.target.value)}
                                                className="bg-black border-white/10 text-white"
                                            >
                                                <option value=""> -- نوع الطريق -- </option>
                                                {roadtypes.map((road) => (
                                                    <option key={road.road_type_id} value={road.road_type_id}>
                                                        {road.road_type_Name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </FloatingLabel>
                                    )}
                                </Col>
                            </Row>

                            {/* ✅ المقاس والاسم والصورة */}
                            <Row className="mb-4">
                                <Col md={4}>
                                    <FloatingLabel controlId="floatingInput" label="Tire Size" className="mb-3">
                                        <Form.Control 
                                            placeholder="195-65R17" 
                                            value={tiresize} 
                                            onChange={(e) => setTireSize(e.target.value)}
                                            className="bg-black border-white/10 text-white"
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col md={4}>
                                    <FloatingLabel controlId="floatingInput" label="Product Name" className="mb-3">
                                        <Form.Control 
                                            placeholder="اطار بيرلي" 
                                            value={productName} 
                                            onChange={(e) => setProductName(e.target.value)}
                                            className="bg-black border-white/10 text-white"
                                        />
                                    </FloatingLabel>
                                </Col>
                                  <Col md={4}>
                                    <FloatingLabel controlId="floatingInput" label="Tire Slug" className="mb-3">
                                        <Form.Control 
                                            placeholder="Tire Slug" 
                                            value={tire_slug} 
                                            onChange={(e) => setTireSlug(e.target.value)}
                                            className="bg-black border-white/10 text-white"
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col md={4}>
                                    <FloatingLabel controlId="floatingInput" label="Image Url" className="mb-3">
                                        <Form.Control 
                                            placeholder="Image Url" 
                                            value={imageurl} 
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            className="bg-black border-white/10 text-white"
                                        />
                                    </FloatingLabel>
                                </Col>
                            </Row>

                            {/* ✅ المواصفات التقنية */}
                            <Row className="mb-4">
                                <Col md={3}>
                                    <Form.Label className="text-gray-400 text-xs">Max Load</Form.Label>
                                    <Form.Control 
                                        placeholder="000 كجم" 
                                        value={Maxload} 
                                        onChange={(e) => setMaxload(e.target.value)}
                                        className="bg-black border-white/10 text-white"
                                    />
                                </Col>
                                <Col md={3}>
                                    <Form.Label className="text-gray-400 text-xs">Max Speed</Form.Label>
                                    <Form.Control 
                                        placeholder="Max Speed" 
                                        value={MaxSpeed} 
                                        onChange={(e) => setMaxSpeed(e.target.value)}
                                        className="bg-black border-white/10 text-white"
                                    />
                                </Col>
                                <Col md={3}>
                                    <Form.Label className="text-gray-400 text-xs">Depth of Tread</Form.Label>
                                    <Form.Control 
                                        placeholder="Depth of tread" 
                                        value={Depthoftread} 
                                        onChange={(e) => setDepthoftread(e.target.value)}
                                        className="bg-black border-white/10 text-white"
                                    />
                                </Col>
                                <Col md={3}>
                                    <Form.Label className="text-gray-400 text-xs">Traction</Form.Label>
                                    <Form.Control 
                                        placeholder="Traction" 
                                        value={traction} 
                                        onChange={(e) => setTraction(e.target.value)}
                                        className="bg-black border-white/10 text-white"
                                    />
                                </Col>
                            </Row>

                            <Row className="mb-4">
                                <Col md={3}>
                                    <Form.Label className="text-gray-400 text-xs">Treadwear</Form.Label>
                                    <Form.Control 
                                        placeholder="Treadwear" 
                                        value={treadwear} 
                                        onChange={(e) => setTreadwear(e.target.value)}
                                        className="bg-black border-white/10 text-white"
                                    />
                                </Col>
                                <Col md={3}>
                                    <Form.Label className="text-gray-400 text-xs">Temperature</Form.Label>
                                    <Form.Control 
                                        placeholder="Temperature" 
                                        value={temperature} 
                                        onChange={(e) => setTemperature(e.target.value)}
                                        className="bg-black border-white/10 text-white"
                                    />
                                </Col>
                                <Col md={3}>
                                    <Form.Label className="text-gray-400 text-xs">Wet Grip Class</Form.Label>
                                    <Form.Control 
                                        placeholder="Wet grip class" 
                                        value={Wetgripclass} 
                                        onChange={(e) => setWetgripclass(e.target.value)}
                                        className="bg-black border-white/10 text-white"
                                    />
                                </Col>
                                <Col md={3}>
                                    <Form.Label className="text-gray-400 text-xs">Noise Class</Form.Label>
                                    <Form.Control 
                                        placeholder="Noise Class" 
                                        value={noiseClass} 
                                        onChange={(e) => setnoiseClass(e.target.value)}
                                        className="bg-black border-white/10 text-white"
                                    />
                                </Col>
                            </Row>

                            {/* ✅ تصنيف الإطار */}
                            <Form.Group className="mb-4">
                                <Form.Label className="text-gray-400 text-xs">تصنيف الإطار</Form.Label>
                                <Form.Select 
                                    size="lg" 
                                    value={tireClassification}
                                    onChange={handleTireClassification}
                                    className="bg-black border-white/10 text-white"
                                >
                                    <option value='Performance'>Performance Tire</option>
                                    <option value='all-season'>All-Season</option>
                                    <option value='All-Terrain'>All-Terrain</option>
                                    <option value='All-weather'>All-Weather</option>
                                    <option value='Ultra-high performance'>Ultra-High Performance</option>
                                </Form.Select>
                            </Form.Group>

                            {/* ✅ أنواع النقشة والخصائص */}
                            <Row className="mb-4">
                                <Col md={6}>
                                    <Card className="bg-black/30 border-white/5">
                                        <Card.Body>
                                            <Form.Label className="text-gray-400 text-xs mb-3 flex items-center gap-2">
                                                <Layers size={16} className="text-blue-500" /> 
                                                نوع تصميم النقشة
                                            </Form.Label>
                                            <div className="space-y-2">
                                                <Form.Check 
                                                    type="radio"
                                                    name="treadType"
                                                    id="asymmetrical-radio"
                                                    label="نقشة غير متماثلة (Asymmetrical)"
                                                    checked={asymmetrical}
                                                    onChange={() => {
                                                        setAsymmetrical(true)
                                                        setSymmetrical(false)
                                                        setDirectional(false)
                                                    }}
                                                    className="text-white"
                                                />
                                                <Form.Check 
                                                    type="radio"
                                                    name="treadType"
                                                    id="symmetrical-radio"
                                                    label="نقشة متماثلة (Symmetrical)"
                                                    checked={symmetrical}
                                                    onChange={() => {
                                                        setAsymmetrical(false)
                                                        setSymmetrical(true)
                                                        setDirectional(false)
                                                    }}
                                                    className="text-white"
                                                />
                                                <Form.Check 
                                                    type="radio"
                                                    name="treadType"
                                                    id="directional-radio"
                                                    label="نقشة اتجاهية (Directional)"
                                                    checked={directional}
                                                    onChange={() => {
                                                        setAsymmetrical(false)
                                                        setSymmetrical(false)
                                                        setDirectional(true)
                                                    }}
                                                    className="text-white"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => { 
                                                        setAsymmetrical(false)
                                                        setSymmetrical(false)
                                                        setDirectional(false)
                                                    }}
                                                    className="text-[10px] text-gray-400 hover:text-red-500 underline mt-2"
                                                >
                                                    إلغاء اختيار النقشة
                                                </button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="bg-black/30 border-white/5">
                                        <Card.Body>
                                            <Form.Label className="text-gray-400 text-xs mb-3 flex items-center gap-2">
                                                <Zap size={16} className="text-orange-500" /> 
                                                خصائص الأداء
                                            </Form.Label>
                                            <div className="space-y-2">
                                                <Form.Check 
                                                    type="switch"
                                                    id="sports-switch"
                                                    label="أداء رياضي (Sports)"
                                                    checked={sports}
                                                    onChange={() => setSports(!sports)}
                                                    className="text-white"
                                                />
                                                <Form.Check 
                                                    type="switch"
                                                    id="water-evacuation-switch"
                                                    label="تشتيت المياه (Water Evacuation)"
                                                    checked={waterEvacuation}
                                                    onChange={() => setWaterEvacuation(!waterEvacuation)}
                                                    className="text-white"
                                                />
                                                <Form.Check 
                                                    type="switch"
                                                    id="handling-switch"
                                                    label="تحكم عالي (Handling)"
                                                    checked={handling}
                                                    onChange={() => setHandling(!handling)}
                                                    className="text-white"
                                                />
                                                <Form.Check 
                                                    type="switch"
                                                    id="fuel-efficiency-switch"
                                                    label="موفر للوقود (Fuel Efficiency)"
                                                    checked={fuelefficiency === 1}
                                                    onChange={() => setFuelEfficiency(fuelefficiency === 1 ? 0 : 1)}
                                                    className="text-white"
                                                />
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                <div className="mb-3">
  {/* هنا تكتب عنوان القائمة */}
  <label className="form-label fw-bold text-dark mb-2">تحديث حالة العرض:</label>
      <select 
      value={status} 
      onChange={(e) => setStatus(e.target.value)}
      className="form-select" // كلاس جاهز من بوتستراب لتنسيق القائمة
    >
      <option value="draft">Draft</option>
      <option value="published">Published</option>
      <option value="archived">Archived</option>
    </select>
    </div>
                                </Col>
                            </Row>

                            {/* ✅ السعر */}
                            <Row className="mb-4">
                                <Col md={6}>
                                    <Form.Label className="text-[#9C4836] font-bold text-xs">السعر بالريال السعودي</Form.Label>
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
                                            إضافة الإطار
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

export default CreateTire