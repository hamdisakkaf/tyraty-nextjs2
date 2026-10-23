// app/pay/Cash-on-delivery/page.js  أو  app/pay/CashTamkeen/Cash_on_delivery.js
"use client"

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { nanoid } from 'nanoid'
import { payByCashonDelivery, resetPaymentStatus } from '../../app/redux/slices/payementSlice'
import Link from 'next/link'

const Cash_on_delivery = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const searchParams = useSearchParams()

    // ✅ جلب بيانات العميل من Redux
    const getCustomerInfo = useSelector((state) => state.CustomerAccount)
    const { SignIn, SCustID, CustomerId, CustomerToken, statusLogin, errorLogin, CustomerEmail, phoneNumber, CustomerName, AddressStreet, AddressCity } = getCustomerInfo

    // ✅ جلب بيانات الدفع من Redux
    const getPaymentState = useSelector((state) => state.PaymentPaySlice)
    const { paymentSuccess, payByCashonDeliveryModal, cashpayMESSAGEDESC } = getPaymentState

    // ✅ جلب بيانات السلة من Redux (بدلاً من الـ props)
    const { localagents, lastOrderDetails } = useSelector((state) => state.basket)

    // ✅ استخراج المعاملات من URL إذا كانت متوفرة (fallback)
    const queryProducid = searchParams.get('producid')

    // ✅ Environment variables (Next.js style)
    const isIsLOCALHOSTEnabled = process.env.NEXT_PUBLIC_ISLOCALHOST === 'false'
    const localhost = 'http://localhost:5000'
    const remoteserver = process.env.NEXT_PUBLIC_API_URL
    const server = isIsLOCALHOSTEnabled ? localhost : remoteserver

    // ✅ States
    const [currentView, setCurrentView] = useState('orderconfirmation')
    const [date, setDate] = useState(new Date())
    const [errors, setErrors] = useState({})
    const [showmodalUser, setModalUser] = useState(false)
    const [showGuestForm, setShowGuestForm] = useState(false)
    const [validated, setValidated] = useState(false)
    const [done, setDone] = useState(false)
    const [paymentcards_paymentcard_id, setPayment_method_id] = useState(3)

    const [Id, setId] = useState(null)
    const [mobileNumber, setMobileNumber] = useState('')
    const [showCashPaymentWotLogModal, setShowCashPaymentWotLogModal] = useState(false)
    const [msg, setMsg] = useState('')
    const [city, setCity] = useState(null)
    const [customerName, setCustomerName] = useState(null)
    const [delivery_address, setDelivery_address] = useState(null)
    const [valisateerror, setError] = useState(' ')

    const [total, setTotal] = useState(0)
    const [disableminus, setDisableminus] = useState(false)
    const [maqaserror, setMaqaserror] = useState(false)

    // ✅ بيانات المنتج من Redux (بدلاً من props)
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
    const [valid_paypoint_id, setPayPointspaypointId] = useState()
    const [tireSpec, setireSpec] = useState()

    // ✅ استخراج البيانات المالية من Redux (بدلاً من props)
    const subtotal = Number(lastOrderDetails?.amount || 0)
    const totalyye = Number(lastOrderDetails?.totalPrice || 0)
    const vatAmount = Number(0)
    const totalAmount = Number((subtotal + vatAmount).toFixed(2))
    const totalAmountYE = Number((totalyye + vatAmount).toFixed(2))

    // ✅ Form Data & Validation
    const [fieldStatus, setFieldStatus] = useState({
        fullName: null,
        phoneNumber: null,
        city: true,
    })

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        city: 'صنعاء',
        latitude: null,
        longitude: null
    })

    const [isLocating, setIsLocating] = useState(false)

    // ✅ استخراج producid من Redux أو URL
    const producid = lastOrderDetails?.items?.[0]?.product_id || queryProducid

    // ✅ useEffects
    useEffect(() => {
        if (formData.city) {
            validateField('city', formData.city)
        }
        const timer = setTimeout(() => {
            if (formData.fullName) validateField('fullName', formData.fullName)
            if (formData.phoneNumber) validateField('phoneNumber', formData.phoneNumber)
        }, 500)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        const timerId = setTimeout(getPrice, 1000)
        const timerId2 = setTimeout(getBrands, 2000)
        return () => {
            clearTimeout(timerId)
            clearTimeout(timerId2)
        }
    }, [producid])

    useEffect(() => {
        if (!brandsinfo || !Array.isArray(brandsinfo)) {
            setCurrentBrand(null)
            return
        }
        const found = brandsinfo.find(brand => brand.brand_id === brandid)
        setCurrentBrand(found || null)
    }, [brandsinfo, brandid])

    useEffect(() => {
        const uniqueId = nanoid(6)
        setId(uniqueId)
    }, [showCashPaymentWotLogModal])

    // ✅ Validation
    const validateField = (name, value) => {
        let isValid = false
        const cleanValue = value ? value.trim() : ""

        switch (name) {
            case 'fullName':
                isValid = cleanValue.length >= 5 && cleanValue.includes(' ')
                break
            case 'phoneNumber':
                const yemenPhoneRegex = /^(77|73|71|70|78)[0-9]{7}$/
                isValid = yemenPhoneRegex.test(cleanValue.replace(/[\s\-\(\)]/g, ''))
                break
            case 'city':
                isValid = cleanValue.length >= 3
                break
            default:
                isValid = cleanValue.length > 0
        }

        setFieldStatus(prev => ({ ...prev, [name]: isValid }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (typeof validateField === "function") {
            validateField(name, value)
        }
    }

    const isFormValid = Boolean(
        fieldStatus.fullName && 
        fieldStatus.phoneNumber
    )

    // ✅ Fetch product price
    const getPrice = () => {
        if (!producid) return
        axios.post(`${server}/getproductPrice`, { producid })
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data[0] : res.data
                if (!data) return

                setireSpec(data)
                setProducPriceSR(data.price)
                setProductName(data.productName)
                setTiresize(data.tiresize)
                setBrandid(data.brands_brand_id)
                setItemNo(data.itemNo)
                setMaxload(data.Maxload)
                setMaxSpeed(data.MaxSpeed)
                setDepthoftread(data.Depthoftread)
                setTraction(data.traction)
                setTreadwear(data.treadwear)
                setTemperature(data.temperature)
                setWetgripclass(data.Wetgripclass)
                setNoiseClass(data.noiseClass)
                setTireClassification(data.tireClassification)
                setAsymmetrical(data.asymmetrical)
                setSports(data.asymmetrical)
                setWaterEvacuation(data.waterEvacuation)
                setHandling(data.handling)
                setMadeDate(data.madeDate)
                setMadeIn(data.MadeIn)
                setRollingresistance(data.Rollingresistance)
                setRoadtyperoadtypeid(data.roadtype_road_type_id)
                setAreastypeareaid(data.areastype_area_id)
                setSpecialPropertiesId(data.specialproperties_specialProperties_id)
                if (data.valid_paypoint_id) {
                    setPayPointspaypointId(data.valid_paypoint_id)
                }
                setMaqaserror(false)
            }).catch(() => {
                setMaqaserror(true)
            })
    }

    // ✅ Fetch brands
    const getBrands = () => {
        try {
            axios.get(`${server}/fetchbrands`)
                .then((res) => {
                    console.log("✅ brandsinfo Response:", res.data)
                    setBrandinfo(res.data)
                })
        } catch (error) {
            console.log("✅ error getBrands:", error)
        }
    }

    // ✅ Handle Guest Checkout (بدون slug - باستخدام query params)
    const handleGuestCheckout = async (event) => {
        event.preventDefault()

        const isNameValid = formData.fullName.trim().length >= 5
        const isPhoneValid = /^(77|73|71|70|78)[0-9]{7}$/.test(formData.phoneNumber.replace(/\s/g, ''))
        const isCityValid = formData.city.trim().length >= 3
        const isFormValidNow = isNameValid && isPhoneValid && isCityValid

        if (!isFormValidNow) {
            setValidated(true)
            setFieldStatus({
                fullName: isNameValid,
                phoneNumber: isPhoneValid,
                city: isCityValid,
            })
            return
        }

        try {
            const orderDetails = {
                product: {
                    REFNO: Id,
                    producid: lastOrderDetails?.tireSpec?.product_id || tireSpec?.product_id,
                    brandid: lastOrderDetails?.brand?.[0]?.brand_id || brandid,
                    size: lastOrderDetails?.tiresize || tiresize,
                    qty: Number(lastOrderDetails?.quantity || 1),
                    paymentcards_paymentcard_id: 3,
                    paypointspaypoint_id: lastOrderDetails?.items?.[0]?.payPointId || valid_paypoint_id
                },
                financials: {
                    unitPrice: Number(lastOrderDetails?.amount || subtotal),
                    totalNet: Number(lastOrderDetails?.totalPrice || totalyye),
                    currency: lastOrderDetails?.currency || 'YER',
                    CurrencyId: lastOrderDetails?.currency || 'YER'
                },
                customer: formData
            }

            console.log('orderDetails CashonDelivery:', orderDetails)

            await dispatch(payByCashonDelivery(orderDetails)).unwrap()

            // ✅ Build query string (no slug - no state)
            const queryParams = new URLSearchParams({
                type: 'GuestOnDelevery',
                orderId: Id,
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                Guest_city: formData.city,
                tireSize: lastOrderDetails?.tiresize || tiresize || '',
                productName: lastOrderDetails?.items?.[0]?.productName || productName || '',
                total: String(lastOrderDetails?.totalPrice || totalyye || 0),
            })

            // Navigate to order confirmation with query params
            router.push(`/shop/orderconfirmation?${queryParams.toString()}`)

        } catch (error) {
            console.error("خطأ في نظام تايراتي:", error)
            alert("عذرا، تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.")
        }
    }

    // ✅ Cities data
    const cityDistricts = {
        "صنعاء": ["السبعين", "التحرير", "حدة", "شعوب", "بني الحارث", "أزال", "الصافية", "الثورة", "هائل", "الدائري", "الستين", "اخرى"],
        "عدن": ["كريتر", "المنصورة", "الشيخ عثمان", "خور مكسر", "المعلا", "التواهي", "البريقة", "اخرى"],
        "تعز": ["المظفر", "القاهرة", "صالة", "الحوبان", "بير باشا", "اخرى"],
        "المكلا": [],
        "إب": ["الظهار", "المشنة", "الكهرباء", "العدين", "جبل ربي", "الصلبة", "الدليل", "المرور", "الجامعة", "السحول", "المخادر", "شارع تعز", "شارع العدين", "باجل", "حي المحمول", "اخرى"]
    }

    return (
        <div className="tyraty-checkout-container min-h-screen bg-[#0f0f0f] py-6 px-3 md:py-10 md:px-4" dir="rtl">
            <div className="mx-auto max-w-[550px]">
                
                {/* رأس النموذج */}
                <div className="text-center mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl font-black text-white mb-2 flex items-center justify-center gap-2">
                        <span className="text-[#B85A45]">📋</span> بيانات إتمام الطلب
                    </h2>
                    <p className="text-gray-500 text-[12px] md:text-sm italic">خطوة واحدة وتصلك إطاراتك إلى باب منزلك</p>
                </div>

                <form noValidate validated={validated.toString()} onSubmit={handleGuestCheckout} className="space-y-4 md:space-y-6">
                    
                    {/* قسم البيانات الشخصية */}
                    <div className="bg-[#1a1a1a] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 shadow-2xl relative overflow-hidden">
                        <h5 className="text-white text-sm md:text-base font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                            معلومات التواصل
                        </h5>
                        
                        <div className="space-y-4">
                            {/* الاسم الكامل */}
                            <div className="flex flex-col">
                                <label className="block text-gray-400 text-[11px] mb-1.5 mr-1 font-medium">الاسم الكامل</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        name="fullName" 
                                        className={`w-full bg-black/40 border rounded-xl py-3.5 px-4 text-white outline-none transition-all pl-10 ${
                                            fieldStatus.fullName === false ? 'border-red-500/50 bg-red-500/5' : 
                                            fieldStatus.fullName === true ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 focus:border-[#B85A45]'
                                        }`} 
                                        placeholder="أدخل اسمك الكامل" 
                                        onChange={handleChange} 
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                                        {fieldStatus.fullName === true && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                        {fieldStatus.fullName === false && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                {fieldStatus.fullName === false && (
                                    <span className="text-[10px] text-red-500 mt-1 block mr-1">⚠️ الاسم يجب أن يكون ثنائياً على الأقل</span>
                                )}
                            </div>

                            {/* المدينة */}
                            <div className="relative">
                                <label className="block text-gray-400 text-[11px] mb-1.5 font-medium">المدينة</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        name="city" 
                                        list="cities-list"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-white pl-10 outline-none focus:border-[#B85A45]" 
                                        placeholder="اختر المدينة..."
                                        onInput={handleChange}
                                        onChange={handleChange}
                                    />
                                    <datalist id="cities-list">
                                        {Object.keys(cityDistricts).map(city => <option key={city} value={city} />)}
                                    </datalist>
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* رقم الجوال */}
                            <div className="flex flex-col">
                                <label className="block text-gray-400 text-[11px] mb-1.5 mr-1 font-medium">رقم الجوال</label>
                                <div className="relative">
                                    <input 
                                        type="tel" 
                                        name="phoneNumber" 
                                        className={`w-full bg-black/40 border rounded-xl py-3.5 px-4 text-white text-left pl-10 outline-none transition-all ${
                                            fieldStatus.phoneNumber === false ? 'border-red-500/50 bg-red-500/5' : 
                                            fieldStatus.phoneNumber === true ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 focus:border-[#B85A45]'
                                        }`} 
                                        placeholder="77xxxxxxx"
                                        onChange={handleChange} 
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                                        {fieldStatus.phoneNumber === true && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                        {fieldStatus.phoneNumber === false && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ملخص الفاتورة - من Redux */}
                    <div className="bg-[#B85A45]/5 border border-[#B85A45]/20 rounded-[1.5rem] p-4 md:p-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">الإجمالي (ر.س):</span>
                                <span className="text-white font-bold">{lastOrderDetails?.totalPrice || subtotal}</span>
                            </div>
                            <div className="pt-2 mt-2 border-t border-white/10 flex justify-between items-center">
                                <span className="text-white font-bold text-sm">المطلوب باليمني:</span>
                                <div className="text-left">
                                    <span className="text-xl md:text-2xl font-black text-[#B85A45]">
                                        {lastOrderDetails?.totalPrice || totalyye}
                                    </span>
                                    <span className="text-[10px] text-[#B85A45] block">ريال يمني</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* زر التأكيد */}
                    <div className="mt-4">
                        <button 
                            type="submit" 
                            disabled={!isFormValid}
                            className={`w-full py-4 rounded-xl font-black transition-all ${
                                isFormValid 
                                ? "bg-[#B85A45] text-white shadow-xl hover:scale-[1.02]" 
                                : "bg-gray-800 text-gray-500 cursor-not-allowed opacity-70"
                            }`}
                        >
                            تأكيد الطلب الآن
                        </button>

                        {!isFormValid && (
                            <p className="text-center text-[10px] text-gray-500 mt-2 italic">
                                يرجى إكمال الحقول التالية لتفعيل الطلب: 
                                {!fieldStatus.fullName && " [ الاسم ]"}
                                {!fieldStatus.phoneNumber && " [ رقم الهاتف ]"}
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Cash_on_delivery