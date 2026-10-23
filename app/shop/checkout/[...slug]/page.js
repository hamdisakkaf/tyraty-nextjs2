// app/checkout/page.js
"use client"

import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaBoxOpen, FaUserCircle, FaMapMarkedAlt, FaUserLock, FaCreditCard, FaCheckCircle, FaExclamationTriangle, FaArrowRight, FaBlog } from 'react-icons/fa'
import axios from 'axios'
//import ModalCashTRCode from '../../../pay/CashTamkeen/ModalCashTRcodeode'
import ModalCashTRCode from '../../../pay/CashTamkeen/ModalCashTRcode'
import PaymentsGatewaysGuest from '../../../pay/Payment-gateways-guest'
//import PaymentsGatewaysGuest from '../../../pay/Payment-gateways-guestest'
//import { resetPaymentState } from '../../../redux/slices/payementSliceice'
import resetPaymentState from '../../../redux/slices/payementSlice'
import ModalUser from '../../../pay/CashTamkeen/ModalUser'
import { addToOrder } from '../../../redux/slices/basketSlice'
import Image from 'next/image'
import Link from 'next/link'

const Checkout = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const dispatch = useDispatch()
    const hasNavigated = useRef(false)

    // ✅ بيانات العميل من Redux
    const getCustomerInfo = useSelector((state) => state.CustomerAccount)
    const { SignIn, SCustID, CustomerId, CustomerToken, statusLogin, errorLogin, CustomerEmail, phoneNumber, CustomerName, AddressStreet, AddressCity } = getCustomerInfo

    // ✅ بيانات الدفع من Redux
    const getPaymentState = useSelector((state) => state.PaymentPaySlice)
    const { savedretailcustomerinvoicestate, toShoppingCart, isSuccess, paymentData, error, paymentSuccess, showTrCodeCashmodalstate, showTrCodeCashFastmodalstate, cashpayMESSAGEDESC, transactionCashRef, kurimipayMESSAGEDESC, paymentState, OperationStatusCashPayment } = getPaymentState

    // ✅ بيانات السلة من Redux - هذه هي البيانات التي نمررها لـ PaymentsGatewaysGuest
    const { localagents, orderBasketlist, lastOrderDetails, product_id, amount } = useSelector((state) => state.basket)
    console.log('lastOrderDetails in Checkout:', lastOrderDetails)

    // ✅ استخراج المعاملات من URL (Next.js App Router)
    const ppid = searchParams.get('ppid')
    const producid = searchParams.get('producid')
    const tireSize = searchParams.get('tireSize')
    const tireid = searchParams.get('tireid')
    const pricesid = searchParams.get('pricesid')

    // ✅ Environment variables
    const isIsLOCALHOSTEnabled = process.env.NEXT_PUBLIC_ISLOCALHOST === 'false'
    const localhost = 'http://localhost:5000'
    const remoteserver = process.env.NEXT_PUBLIC_API_URL
    const server = isIsLOCALHOSTEnabled ? localhost : remoteserver

    // ✅ States
    const [showmodalUser, setModalUser] = useState(false)
    const [disableminus, setDisableminus] = useState(false)
    const [date, setDate] = useState(new Date())
    const [maqaserror, setMaqaserror] = useState(false)

    const [producpriceSR, setProducPriceSR] = useState()
    const [productName, setProductName] = useState()
    const [tiresize, setTiresize] = useState()
    const [brandid, setBrandid] = useState(null)
    const [itemno, setItemNo] = useState()
    const [brandsinfo, setBrandinfo] = useState()
    const [currentBrand, setCurrentBrand] = useState()
    const [maxload, setMaxload] = useState()
    const [maxSpeed, setMaxSpeed] = useState()
    const [depthoftread, setDepthoftread] = useState()
    const [traction, setTraction] = useState()
    const [treadwear, setTreadwear] = useState()
    const [temperature, setTemperature] = useState()
    const [wetgripclass, setWetgripclass] = useState()
    const [noiseClass, setNoiseClass] = useState()
    const [tireClassification, setTireClassification] = useState()
    const [asymmetrical, setAsymmetrical] = useState()
    const [sports, setSports] = useState()
    const [waterEvacuation, setWaterEvacuation] = useState()
    const [handling, setHandling] = useState()
    const [madeDate, setMadeDate] = useState()
    const [madeIn, setMadeIn] = useState()
    const [rollingresistance, setRollingresistance] = useState()
    const [roadtyperoadtypeid, setRoadtyperoadtypeid] = useState()
    const [areastypeareaid, setAreastypeareaid] = useState()
    const [specialPropertiesId, setSpecialPropertiesId] = useState()
    const [paypointspaypoint_id, setPayPointspaypointId] = useState()
    const [tireSpec, setireSpec] = useState()

    const [DolarexchangeRial, setDolarexchangeRial] = useState()
    const [KSAxchangerial, setKSAxchangeRial] = useState()
    const [totalyYERprice, setTotalyYERPrice] = useState(0)
    const [productprice, setProductPrice] = useState()
    const [productrialprice, setProductRialPrice] = useState(productprice * DolarexchangeRial)

    const [paymentsgatways, setPaymentsgatways] = useState([])

    // ✅ Fetch payment gateways
    useEffect(() => {
        fetchpaymentsgatways()
    }, [])

    const fetchpaymentsgatways = async () => {
        try {
            const res = await axios.get(`${server}/fetchpaymentsgatways`)
            if (res.data) {
                setPaymentsgatways(res.data)
            }
        } catch (error) {
            console.error("Error fetching gateways:", error)
        }
    }

    // ✅ Get product price and details
    const getproductPriceandDetails = () => {
        console.log('get product info:', producid)
        console.log('get product info ppid:', ppid)

        axios.post(
            `${server}/getproductPrice`,
            { ppid, pricesid },
        ).then((res) => {
            console.log('getproductPrice data:', res.data)
            setireSpec(res.data)
            setProducPriceSR(res.data.price)
            setProductName(res.data.productName)
            setTiresize(res.data.tiresize)
            setBrandid(res.data.brands_brand_id)
            setItemNo(res.data.itemNo)

            setMaxload(res.data.Maxload)
            setMaxSpeed(res.data.MaxSpeed)
            setDepthoftread(res.data.Depthoftread)
            setTraction(res.data.traction)
            setTreadwear(res.data.treadwear)
            setTemperature(res.data.temperature)
            setWetgripclass(res.data.Wetgripclass)
            setNoiseClass(res.data.noiseClass)
            setTireClassification(res.data.tireClassification)
            setAsymmetrical(res.data.asymmetrical)
            setSports(res.data.asymmetrical)
            setWaterEvacuation(res.data.waterEvacuation)
            setHandling(res.data.handling)
            setMadeDate(res.data.madeDate)
            setMadeIn(res.data.MadeIn)
            setRollingresistance(res.data.Rollingresistance)
            setRoadtyperoadtypeid(res.data.roadtype_road_type_id)
            setAreastypeareaid(res.data.areastype_area_id)
            setSpecialPropertiesId(res.data.specialproperties_specialProperties_id)
            setPayPointspaypointId(res.data.valid_paypoint_id)
            setMaqaserror(false)
        }).catch(() => {
            setMaqaserror(true)
        })
    }

    // ✅ Get brands
    const getBrands = () => {
        try {
            axios.get(`${server}/fetchbrands`)
                .then((res) => {
                    console.log("✅ brandsinfo Response:", res.data)
                    setBrandinfo(res.data)
                    return res.data
                }).then((res) => {
                    console.log("✅ brandsinfo[0]:", res)
                    const brand_id = res[0]?.brand_id
                    console.log("✅ brand_id Response:", brand_id)
                })
        } catch (error) {
            console.log("✅ error getBrands:", error)
        }
    }

    // ✅ Set current brand when brandsinfo or brandid changes
    useEffect(() => {
        if (!brandsinfo || !Array.isArray(brandsinfo)) {
            setCurrentBrand(null)
            return
        }
        const found = brandsinfo.find(brand => brand.brand_id === brandid)
        setCurrentBrand(found || null)
    }, [brandsinfo, brandid])

    // ✅ Increase quantity
    const increase = () => {
        const quantity = lastOrderDetails.quantity
        const nextQty = quantity + 1
        dispatch(addToOrder({
            ...lastOrderDetails,
            quantity: nextQty,
            totalPrice: Number(lastOrderDetails.finalPrice) * nextQty
        }))
    }

    // ✅ Decrease quantity
    const decrease = () => {
        const quantity = lastOrderDetails.quantity
        if (quantity > 1) {
            const nextQty = quantity - 1
            dispatch(addToOrder({
                ...lastOrderDetails,
                quantity: nextQty,
                totalPrice: Number(lastOrderDetails.finalPrice) * nextQty
            }))
        }
    }

    // ✅ Generate unique ID
    function getUID() {
        return Date.now().toString(36)
    }

    let refNo = getUID()

    // ✅ Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // ✅ Fetch product details and brands on mount
    useEffect(() => {
        const timerId = setTimeout(getproductPriceandDetails, 1000)
        const timerId2 = setTimeout(getBrands, 2000)
        return () => {
            clearTimeout(timerId)
            clearTimeout(timerId2)
        }
    }, [])

    // ✅ Fetch exchange rates
    useEffect(() => {
        yemeniRials()
    }, [])

    // ✅ Go to shopping cart
    const gotoShoppingCart = () => {
        router.push('/shop/ShoppingCart')
    }

    // ✅ Get Yemeni Rials exchange rate
    const yemeniRials = () => {
        axios.get(`${server}/getexchangeDolar`).then((data) => {
            setKSAxchangeRial(data.data[0].KSAxchangeRial)
            setProductRialPrice(productprice * DolarexchangeRial)
        })
    }

    // ✅ Show login modal
    const loginModal = () => {
        setModalUser(true)
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-alexandria pb-20 overflow-hidden" dir="rtl">
            {showTrCodeCashFastmodalstate && <ModalCashTRCode showModal={showTrCodeCashFastmodalstate} />}

            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#B85A45]/10 blur-[150px] rounded-full"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center py-12">
                    <Link href="/" className="hover:scale-110 transition-transform mb-8">
                        <Image 
                            src="/لوجو تايراتي tyrate - Opject-09.svg" 
                            width={100} 
                            height={100} 
                            alt="الرئيسية"
                            priority
                        />
                    </Link>

                    <div className="text-center">
                        <h1 className="text-3xl md:text-5xl font-black mb-2">مراجعة <span className="text-[#B85A45]">الطلب</span></h1>
                        <p className="text-gray-500">أنت على بعد خطوة واحدة من تأمين قيادتك</p>
                    </div>
                </div>

                {isSuccess !== null && (
                    <div className={`mb-8 p-6 rounded-2xl border transition-all duration-500 ${isSuccess
                            ? 'bg-green-500/10 border-green-500/20 text-green-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        <div className="flex items-center gap-4">
                            {isSuccess ? (
                                <FaCheckCircle className="text-3xl animate-bounce" />
                            ) : (
                                <FaExclamationTriangle className="text-3xl" />
                            )}

                            <div className="flex-1">
                                <p className="font-bold text-lg">
                                    {isSuccess ? 'تمت العملية بنجاح' : 'فشلت العملية'}
                                </p>
                                <p className="text-sm opacity-90">
                                    {paymentState} {cashpayMESSAGEDESC}
                                </p>
                                {isSuccess && OperationStatusCashPayment && (
                                    <p className="text-[10px] opacity-70 mt-2 uppercase tracking-widest border-t border-green-500/20 pt-2">
                                        رقم العملية: <span className="font-mono text-white">{OperationStatusCashPayment}</span>
                                    </p>
                                )}
                                {!isSuccess && (
                                    <div className="mt-3 py-2 px-3 bg-red-500/20 rounded-lg border border-red-500/20">
                                        <p className="text-xs font-medium italic">
                                            ⚠️ يرجى التأكد من الرصيد أو مراجعة بيانات التحويل والمحاولة مرة أخرى.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 space-y-6">
                        {SCustID ? (
                            <div className="bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-2 h-full bg-[#B85A45] opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                                    <FaUserCircle className="text-[#B85A45]" /> معلومات التوصيل
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <small className="text-gray-500 block">الاسم والرمز</small>
                                        <p className="font-bold text-lg">{CustomerName} <span className="text-[#B85A45]">#{SCustID}</span></p>
                                    </div>
                                    <div className="space-y-1">
                                        <small className="text-gray-500 block">رقم التواصل</small>
                                        <p className="font-bold text-lg text-[#B85A45] tracking-widest">{phoneNumber}</p>
                                    </div>
                                    <div className="md:col-span-2 space-y-1 bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <small className="text-gray-500 block flex items-center gap-2"><FaMapMarkedAlt /> عنوان السكن</small>
                                        <p className="font-bold">{AddressCity} - {AddressStreet}</p>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className="lg:col-span-5 sticky top-8">
                        <div className="bg-[#0f0f0f] border border-[#B85A45]/20 rounded-[2.5rem] p-8 shadow-2xl relative">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#B85A45]/5 blur-3xl"></div>

                            <h3 className="text-xl font-black mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                                <FaBoxOpen className="text-[#B85A45]" /> ملخص الفاتورة
                            </h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-lg leading-tight">{lastOrderDetails?.tireSpec.productName}</h4>
                                        <span className="text-xs text-gray-500 tracking-tighter uppercase font-mono">{producid} | {lastOrderDetails?.tireSpec.tiresize}</span>
                                    </div>
                                    <div className="bg-white/5 px-3 py-1 rounded-lg border border-white/10 font-bold">
                                        × {lastOrderDetails?.quantity}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-black/50 p-3 rounded-2xl border border-white/5">
                                    <span className="text-sm text-gray-400 font-bold">تعديل الكمية</span>
                                    <div className="flex items-center gap-4">
                                        <button onClick={decrease} disabled={disableminus} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#B85A45] transition-all disabled:opacity-20">-</button>
                                        <span className="text-xl font-black">{lastOrderDetails?.quantity}</span>
                                        <button onClick={increase} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#B85A45] transition-all">+</button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 border-t border-white/5 pt-6">
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>سعر الوحدة:</span>
                                    <span className="font-bold">{lastOrderDetails?.finalPrice} ر.س</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>سعر الصرف (1 ر.س):</span>
                                    <span className="font-bold text-white">{KSAxchangerial} ر.ي</span>
                                </div>

                                <div className="!bg-gradient-to-br from-[#B85A45] to-[#8f402e] p-6 rounded-[2rem] mt-6 shadow-xl shadow-[#B85A45]/10 transform hover:scale-[1.02] transition-transform cursor-default">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-white/80 text-sm font-bold uppercase">الإجمالي النهائي</span>
                                        <FaCheckCircle className="text-white/40" />
                                    </div>
                                    <div className="text-2xl md:text-3xl font-black text-white">
                                        {lastOrderDetails?.totalPrice} <span className="text-sm font-light">ريال يمني</span>
                                    </div>
                                    <div className="text-xs text-white/60 mt-2 font-mono">
                                        ≈ {lastOrderDetails?.totalPrice?.toLocaleString()} SAR
                                    </div>
                                </div>

                                <div className="bg-[#0f0f0f] rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl mt-6 md:mt-0">
                                    <h3 className="text-lg md:text-xl font-black mb-6 flex items-center text-white border-b border-white/5">
                                        <div className="bg-[#B85A45]/10 p-2 rounded-xl flex items-center justify-center">
                                            <FaCreditCard className="text-[#B85A45] text-lg" />
                                        </div>
                                        <span>بوابات الدفع الآمنة</span>
                                    </h3>

                                    <div className="bg-black/40 rounded-2xl md:rounded-3xl shadow-inner">
                                        {/* ✅ تم إزالة جميع الـ props - PaymentsGatewaysGuest ستعتمد على Redux فقط */}
                                        <PaymentsGatewaysGuest />

                                        <div className="mt-4 flex justify-center items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                                            <i className="bi bi-shield-lock-fill text-gray-400 text-xs"></i>
                                            <span className="text-[10px] text-gray-500 tracking-wider">SSL SECURED PAYMENT</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br />

                            {toShoppingCart && (
                                <button onClick={gotoShoppingCart} className="w-full mt-6 py-4 rounded-2xl border border-[#B85A45]/30 text-[#B85A45] hover:bg-[#B85A45] hover:text-white transition-all font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                                    <FaArrowRight className="rotate-180" /> العودة لسلة التسوق
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-center gap-4 mt-20">
                    <Link
                        href="/blog"
                        className="px-10 py-4 rounded-full bg-white/5 border border-white/10 hover:border-[#B85A45] transition-all flex items-center gap-2 justify-center group"
                    >
                        <FaBlog className="text-gray-500 group-hover:text-[#B85A45]" /> <span>زيارة المدونة</span>
                    </Link>
                    <Link
                        href="/"
                        className="px-10 py-4 rounded-full bg-[#B85A45] text-white hover:bg-[#9C4836] shadow-lg shadow-[#B85A45]/20 transition-all font-black text-center"
                    >
                        العودة للرئيسية
                    </Link>
                </div>
            </div>

            {showmodalUser ? <ModalUser
                showModal={showmodalUser}
                onClose={() => setModalUser(false)}
            /> : null}
        </div>
    )
}

export default Checkout