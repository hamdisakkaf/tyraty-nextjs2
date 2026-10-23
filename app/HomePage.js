"use client"

import React,{ useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { addToOrder } from '../app/redux/slices/basketSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'
//import Image from 'react-bootstrap/Image'
import Image from 'next/image';

import 'bootstrap/dist/css/bootstrap.min.css'
import Carousel from 'react-bootstrap/Carousel'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { FloatingLabel } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'
import Stack from '@mui/material/Stack'
import SuggestedArticles from './blog/SuggestedArticles'
import PostsGrid from './blog/filtercarsposts'
import  TireDetailLink  from '../components/Links/TireCheckoutLinks'
import TireCard from '../components/TireCard'
import {
    CheckCircle,
    Globe, ClipboardCheck,
    Clock, CalendarDays,
    Fuel, FileText,
    VolumeX,
    Award,
    Hash,
    ExternalLink,
    TrendingUp,
    Shield,
    Package,
    MapPin,
    Gauge,
    Thermometer,
    Wind,
    Droplets,
    Activity,
    Layers,
    Calendar, Info, Weight, Construction,
    ArrowRight, CloudSunRain,
    Printer, CreditCard, User, Phone, Zap, Waves, Navigation, ChevronLeft,
    ThermometerSnowflake, Flame, ArrowLeftCircle, Eye,
    Search, Car, Sparkles, ChevronRight, DollarSign, Truck, BadgeCheck, Users
} from 'lucide-react'

import { getposts } from '../app/apis/blogapi'
import { getTempData, getTractionData, getTreadwearBadge } from '../components/helpers/utils'

const HomePage = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const pathname = usePathname()
    
 const isLocalhost = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';
const localhost = 'http://localhost:5000';
const remoteserver = process.env.NEXT_PUBLIC_API_URL;
const server = isLocalhost ? localhost : remoteserver;

    console.log('Current API Server:', server)

    const ref = useRef({})
    const myRef = useRef()
    const resultsRef = useRef(null)

    const [notifications, setNotifications] = useState([])
    const getCustomerInfo = useSelector((state) => state.CustomerAccount)
    const { SignIn, statusLogin, CustomerToken, errorLogin, CustomerEmail, phoneNumber } = getCustomerInfo

    const getAdminInfo = useSelector((state) => state.AdminAccount)
    const { userToken, userInfo, SignInAdmin, statusAdminLogin, permissionAdmin } = getAdminInfo

    console.log('homepage CustomerToken..', CustomerToken)
    const [time, setTime] = useState('')
    const [soldCount, setSoldCount] = useState(50)
    const [error] = useState(null)
    const [viewMode, setViewMode] = useState('detailed')

    let [tiresize, setTireSize] = useState("155R12")
    let [posts, setPosts] = useState([])
    const [availableSizes, setAvailableSizes] = useState([])
    const [selectedSize, setSelectedSize] = useState('')

    const scrollToResults = () => {
        resultsRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }

    useEffect(() => {
        axios.get(`${server}/api/tire-sizes`)
            .then(res => {
                setAvailableSizes(res.data)
            })
            .catch(err => console.error("Error fetching sizes:", err))
    }, [server])

    // Counter animation for social proof
    useEffect(() => {
        const interval = setInterval(() => {
            setSoldCount(prev => prev + Math.floor(Math.random() * 3))
        }, 8000)
        return () => clearInterval(interval)
    }, [])

    let [orderDetails, setOrderDetails] = useState([])
    let [tirePrices, setTirePrices] = useState([])
    let [DolarexchangeRial, setDolarexchangeRial] = useState()
    let [KSAxchangeRial, setKSAxchangeRial] = useState()

    const [show, setShow] = useState(false)
    const [showA, setShowA] = useState(false)
    const toggleShowA = () => setShowA(!showA)
    const [brand, setBrandLogo] = useState([])
    const [brandName, setBrandName] = useState()
    const [specialproperties, setSpecialProperties] = useState([])
    const [areatypes, setAreatypes] = useState([])
    const [currentAreaType, setcurrentAreaType] = useState(null)

    const [modalShow, setModalShow] = useState(false)
    const [suggestedPosts, setSuggestedPosts] = useState([])
    const [family, setFamily] = useState({
        familyname: 'اطارات السيارات',
        familyname2: 'اطارات المركبات الثقيلة'
    })



    function MydModalWithGrid(props) {
        return (
            <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <h1 className='alexandria-h1'>{props.specialpropertienamear} - {props.specialpropertiename}</h1>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="grid-example">
                    <Container>
                        <Row>
                            <Col xs={12} md={8}></Col>
                            <Col xs={6} md={4}>
                                <div>
                                    <img
                                        src={props.specialpropertieiconurl}
                                        className="rounded me-2"
                                        alt={props.specialpropertienamear}
                                        width={120}
                                        height={100}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p className='alexandria-p'>{props.specialpropertiedescribe}</p>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>إغلاق</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    const fitchTiresFromTireSize = (size) => {
        try {
            axios.get(`${server}/getFromTireSize?tiresize=${encodeURIComponent(size)}`, {})
                .then((res) => {
                    setOrderDetails(res.data)
                    getBrandLogo()
                    getSpecialPropertie()
                    getAreatypes()
                    console.log('setOrderDetails:', res.data)
                }).catch(() => {
                    return null
                })
        } catch (error) {
            console.error('fitchTiresFromTireSize error', error)
            return null
        }
    }

    const onPayment = async (pricesid) => {
        const curentOrder = orderDetails?.filter(item =>
            String(item?.pricesid).includes(String(pricesid))
        )

        console.log(' orderDetails.filter:', curentOrder)
        console.log(' curentOrder[0]:', curentOrder[0].finalPrice)

        const orderData = {
            pricesid: curentOrder[0].pricesid,
            amount: Number(curentOrder[0].price),
            finalPrice: Number(curentOrder[0].finalPrice),
            quantity: 1,
            totalPrice: Number(curentOrder[0].finalPrice),
            tiresize: curentOrder[0].tiresize,
            currency: "SAR",
            items: curentOrder,
            brand: brand,
            tireSpec: curentOrder[0],
            date: new Date().toISOString()
        }

        console.log('orderDetails in Home:', orderData)
        dispatch(addToOrder(orderData))
        router.push(`shop/checkout/ppid/${pricesid}`)
    }

    const getPosts = async () => {
        try {
            axios.get(`${server}/getposts`)
                .then((res) => {
                    setPosts(res.data)
                }).catch(() => {
                    return null
                })
        } catch (error) {
            console.error(error)
            return null
        }
    }

    const filtercarspost = () => {
        const familyid = 1
        return posts.filter(post => post.sectionsfamely_family_id == familyid)
    }
    const filtercarsposts = filtercarspost()

    useEffect(() => {
        yemeniRials()
        getPosts()
        getpostsByFamily()
    }, [])

    const getpostsByFamily = async () => {
        try {
            const res = await axios.get(`${server}/getpostsByFamily/1`)
            const allPosts = Array.isArray(res.data) ? res.data : (res.data.posts || [])
            setSuggestedPosts(allPosts.slice(0, 15))
        } catch (error) {
            console.error("خطأ في جلب المقالات المقترحة:", error)
            setSuggestedPosts([])
        }
    }

    useEffect(() => {
        if (tiresize) {
            fitchTiresFromTireSize(encodeURIComponent(tiresize))
        }
    }, [tiresize])

    const yemeniRials = () => {
        axios.get(`${server}/getexchangeDolar`).then((data) => {
            console.log('DolarexchangeRial data:', data.data[0].DolarexchangeRial)
            setDolarexchangeRial(data.data[0].DolarexchangeRial)
            setKSAxchangeRial(data.data[0].KSAxchangeRial)
        })
    }

    let handleTireSizeChange = (e) => {
        setTireSize(e.target.value)
    }

    useEffect(() => {
        // في Next.js، يمكن استخدام router.query أو searchParams
        // للحصول على المعاملات من URL
        const params = new URLSearchParams(window.location.search)
        const tireSizeFromUrl = params.get('tireSize')
        if (tireSizeFromUrl) {
            setTireSize(tireSizeFromUrl)
        }
    }, [])

    const getBrandLogo = () => {
        axios.get(`${server}/getbrandLogo`).then((data) => {
            setBrandLogo(data.data)
        })
    }

    const getSpecialPropertie = (() => {
        axios.get(`${server}/fetchspecialProperties`).then((data) => {
            setSpecialProperties(data.data)
        })
    })

    const getAreatypes = (() => {
        axios.get(`${server}/getAreatypes`)
            .then((data) => {
                console.log('currentAreaType data:', data.data)
                setAreatypes(data.data)
                console.log('areatypes:', areatypes)

                const foundArea = data.data.find(item => item.area_id === orderDetails.areastype_area_id)
                setcurrentAreaType(foundArea)
            })
    })

    return (
        <Container fluid className="p-0" dir="rtl">

            {/* ===== NAVIGATION ===== */}
            <div className="bg-[#121212] border-b border-white/10 sticky top-0 z-50">
                <Container>
                    <div className="flex items-center justify-center gap-2 py-3">
                        <button
                            className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 bg-orange-600 text-white shadow-lg shadow-orange-600/25"
                        >
                            <Gauge className="w-4 h-4" />
                            اختر بالمقاس
                        </button>

                        <button
                            onClick={() => router.push('shop/tyratyfinder')}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
                        >
                            <Car className="w-4 h-4" />
                            البحث بنوع السيارة
                            Tire Finder
                            <Sparkles className="w-3 h-3 text-yellow-400" />
                        </button>
                    </div>
                </Container>
            </div>

            {/* ===== HERO SECTION ===== */}
            <Row className="bg-[#0a0a0a] m-0">
                <div className="min-h-[580px] w-full relative flex items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s] hover:scale-105"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1583')`,
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
                    <div className="relative z-10 w-full max-w-2xl px-4 py-12">
                        {/* SOCIAL PROOF BAR */}
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full">
                                <div className="flex -space-x-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="w-5 h-5 rounded-full bg-orange-500/30 border border-orange-500/50 flex items-center justify-center text-[8px] text-orange-300 font-bold">{i}</div>
                                    ))}
                                </div>
                                <span className="text-orange-300 text-[10px] font-bold mr-1">4.9/5</span>
                                <span className="text-gray-400 text-[10px]">(1049 تقييم)</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-green-400 text-[10px] font-bold">
                                    تم اضافة {soldCount.toLocaleString('ar-SA')} مقاس جديد هذا الشهر
                                </span>
                            </div>
                        </div>

                        {/* HEADLINE */}
                        <div className="text-center mb-6">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-3">
                                اختر الإطار <span className="text-orange-500">الأفضل</span> لسيارتك
                            </h1>
                            <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                                مقارنة شاملة بين أفضل العلامات التجارية بأسعار تنافسية وضمان شامل
                            </p>
                        </div>

                        {/* GUIDANCE CARD */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 max-w-lg mx-auto mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-600/30">
                                    <Search className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-bold text-sm">ابدأ رحلتك الآن</p>
                                    <p className="text-gray-400 text-xs">اختر مقاس الإطار من القائمة أدناه</p>
                                </div>
                            </div>
                        </div>

                        {/* SELECT BOX */}
                        <div className="relative group/select mb-5">
                            <div className="absolute -inset-1 bg-orange-600/20 rounded-2xl blur-xl opacity-0 group-hover/select:opacity-100 transition duration-700" />
                            <div className="relative">
                                <label className="block text-white/70 text-xs font-bold mb-2 text-center tracking-wide">
                                    <span className="bg-orange-600/20 text-orange-400 px-2.5 py-1 rounded-md text-[10px] mr-1.5">الخطوة 1</span>
                                    حدد مقاس الإطار
                                </label>
                                <select
                                    value={tiresize}
                                    onChange={handleTireSizeChange}
                                    className="w-full bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white text-right pr-14 pl-12 py-4 rounded-2xl 
                               focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50
                               transition-all duration-500 appearance-none cursor-pointer 
                               hover:bg-white/15 hover:border-white/30 font-bold text-lg shadow-2xl"
                                >
                                    <option value="" className="bg-[#1a1a1a] text-gray-500">اختر من القائمة...</option>
                                    {availableSizes.map((size, index) => (
                                        <option key={index} value={size} className="bg-[#1a1a1a] py-4 text-white">
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* SELECTED SIZE + ACTION */}
                        {tiresize ? (
                            <div className="mb-5 bg-orange-600/15 border border-orange-500/30 rounded-2xl p-5 text-center animate-fade-in">
                                <p className="text-orange-400 text-xs font-bold mb-1 uppercase tracking-wider">المقاس المختار</p>
                                <p className="text-white text-3xl font-black tracking-wider mb-3">{tiresize}</p>
                                <Button
                                    className="bg-orange-600 hover:bg-orange-500 border-0 rounded-xl font-bold px-6 py-2.5 shadow-lg shadow-orange-600/30 transition-all duration-300 hover:scale-105"
                                >
                                    <span className="flex items-center gap-2"
                                        onClick={scrollToResults}
                                    >
                                        استعرض {orderDetails.length} إطار متاح
                                        <ChevronRight className="w-4 h-4" />
                                    </span>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-wrap justify-center gap-2 mb-5">
                                {[
                                    { icon: Shield, text: 'ضمان  سنة' },
                                    { icon: Truck, text: 'توصيل مجاني' },
                                    { icon: DollarSign, text: 'أفضل سعر مضمون' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-lg">
                                        <item.icon className="w-3.5 h-3.5 text-orange-400" />
                                        <span className="text-gray-400 text-[11px] font-bold">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* TIRE FINDER CTA */}
                        <div className="text-center mb-6">
                            <button
                                onClick={() => router.push('/tyratyfinder')}
                                className="group text-gray-500 text-sm hover:text-orange-400 transition-all duration-300 flex items-center justify-center gap-2 mx-auto bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/5 hover:border-orange-500/30"
                            >
                                <Car className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                لا تعرف مقاس الإطار؟ استخدم Tire Finder
                                <ChevronRight className="w-3 h-3 group-hover:translate-x-[-3px] transition-transform" />
                            </button>
                        </div>

                        {/* TRUST BADGES */}
                        <div className="flex items-center justify-center gap-3 mb-6">
                            {[
                                { icon: BadgeCheck, label: 'ضمان شامل' },
                                { icon: Clock, label: 'توصيل  سريع' },
                                { icon: ClipboardCheck, label: 'فحص المواصفات' },
                                { icon: CalendarDays, label: 'تاريخ جديد' },
                                { icon: FileText, label: 'بطاقة المواصفات' },
                                { icon: Users, label: '1,000+ عميل' }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-1">
                                    <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                                        <item.icon className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <span className="text-gray-500 text-[9px] font-bold">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* FOOTER */}
                        <div className="flex items-center justify-center gap-3 opacity-40">
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/30" />
                            <p className="text-white text-[8px] uppercase tracking-[0.3em] font-black">
                                امباير تايراتي — الجودة تبدأ من الإطار
                            </p>
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/30" />
                        </div>
                    </div>
                </div>
            </Row>

            <Row className='d-flex justify-content-center alexandria-p blogs-readmore '>
                <div className="bg-[#0f0f0f] border-t border-white/5 py-6">
                    <Container>
                        <p className="text-center text-gray-600 text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
                            العلامات التجارية المتاحة
                        </p>
                        <div className="flex items-center justify-center gap-6 md:gap-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                            {['ميشلان', 'بريدجستون', 'هانكوك', 'كومهو', 'جي تي'].map((brand) => (
                                <span key={brand} className="text-gray-400 text-sm font-bold hover:text-white transition-colors cursor-default">
                                    {brand}
                                </span>
                            ))}
                        </div>
                    </Container>
                </div>
            </Row>

            <div ref={resultsRef} id="results-section" className="flex justify-between items-center mb-6 px-4" dir="rtl">
                <h3 className="text-white text-lg font-bold">النتائج المتاحة ({orderDetails.length})</h3>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => setViewMode('detailed')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'detailed' ? 'bg-[#B85A45] text-white' : 'text-gray-500'}`}
                    >
                        <Layers size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#B85A45] text-white' : 'text-gray-500'}`}
                    >
                        <Activity size={20} />
                    </button>
                </div>
            </div>

            {tiresize && (
                <Row className="justify-content-md-center g-4 mt-8" dir="rtl">
                    {orderDetails.map((val, i) => {
                        const {
                            product_id, imageURL, tiresize, productName, brandName, pricesid, price,
                            brandNameAr, brandLogo, COO, madeDate, tireClassification, Maxload, MaxSpeed, payPointId, finalPrice, last_updated,
                            noiseClass, traction, temperature, treadwear, fuelEfficiency, asymmetrical, sports, handling, waterEvacuation,
                            tire_slug
                        } = val
                      // 1. تنظيف مقاس الإطار (تحويل المسافات والسلاش إلى شرطات، وجعل الحروف صغيرة)
// مثال: "225/45 R17" ستصبح "225-45-r17"
const formattedSize = tiresize.replace(/[\s/]+/g, '-').toLowerCase();

                        //const slug = `tireSize-${encodeURIComponent(tiresize)}-tireid-${product_id}-payPointId-${payPointId}`;
  
                        const tractionData = getTractionData('traction', traction)
                        const tempData = getTempData('temperature', temperature)
                        const treadwearData = getTreadwearBadge(treadwear)

                        const isHighPerf = (traction === 'A' || traction === 'AA') && (parseInt(MaxSpeed) > 210)
                        const isQuiet = noiseClass && parseInt(noiseClass) <= 71
                        const hasHighStability = (traction === 'A' || traction === 'AA') || (MaxSpeed && parseInt(MaxSpeed) > 240)
                        const isFuelEfficient = fuelEfficiency === 1 || fuelEfficiency === "1"

                        const profitMargin = 0
                        const originalPrice = Number(price)
                        const formattedPrice = new Intl.NumberFormat('en-US', {
                            style: 'currency', currency: 'SAR', minimumFractionDigits: 0,
                        }).format(originalPrice * (1 + profitMargin / 100))

                        const formattedYER = new Intl.NumberFormat('en-US', {
                            style: 'decimal',
                            maximumFractionDigits: 0,
                        }).format(finalPrice)
                        return (
                            <Col
                                key={i}
                                xs={viewMode === 'grid' ? 6 : 12}
                                md={viewMode === 'grid' ? 4 : 6}
                                lg={viewMode === 'grid' ? 3 : 4}
                            >
                                <motion.div
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full"
                                >
                                    <div className="relative group bg-[#0f0f0f] border border-white/10 rounded-[2rem] overflow-hidden hover:border-[#B85A45]/50 transition-all duration-300 h-full flex flex-col">
                                        {viewMode === 'grid' ? (
                                            <div className="p-4 flex flex-col h-full text-center">
                                                <img src={brandLogo} className="h-4 object-contain mb-2 self-center filter brightness-200 opacity-60" />
                                                <div className="relative mb-2 flex justify-center">
                                                    <img src={imageURL} className="w-32 h-32 object-contain z-10" />
                                                    <div className="absolute inset-0 bg-[#B85A45]/5 blur-xl rounded-full"></div>
                                                </div>
                                                <h4 className="text-white text-sm font-black mb-1 leading-tight">{tiresize}</h4>
                                                <p className="text-[#B85A45] text-xs font-bold mb-3">{formattedPrice}</p>
                                                <button
                                                    onClick={() => onPayment(pricesid)}
                                                    className="mt-auto w-full bg-[#B85A45] text-white text-[10px] py-2.5 rounded-xl font-bold"
                                                >
                                                    شراء الآن
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                           
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
     
        <TireCard 
          key={product_id} 
          tire={val} 
          viewMode={viewMode} 
           onPayment={onPayment} 
        //  onPayment={(pricesid) => {
            // منطق الدفع هنا
        //    console.log('Payment for:', pricesid)
         // }}
          
        />
    </motion.div>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
 
                            </Col>
                            
                        )
                    })}
         
                </Row>
            )}

            <SuggestedArticles suggestedPosts={suggestedPosts} />
            <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
           animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
</Container>
    )
  }



export default HomePage;