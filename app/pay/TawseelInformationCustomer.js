// app/pay/TawseelInformationCustomer.jsx
"use client"

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation'; // ✅ Next.js App Router
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { Truck, Store, MapPin, Search } from 'lucide-react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { nanoid } from 'nanoid';
import { handleGetCurrentLocation } from './methods/GPS';

export default function TawseelInformationCustomer({ orderId, selectedInstallationTypeId, choice, customerphone }) {
    const dispatch = useDispatch();
    const router = useRouter(); // ✅ Next.js App Router

    const getCustomerInfo = useSelector((state) => state.CustomerAccount);
    const { SignIn, SCustID, CustomerId, CustomerToken, statusLogin, errorLogin, CustomerEmail, phoneNumber, CustomerName, AddressStreet, AddressCity } = getCustomerInfo;
    
    const getPaymentState = useSelector((state) => state.PaymentPaySlice);
    const { localagents, lastOrderDetails } = useSelector((state) => state.basket);

     const isLocalhost = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';
const localhost = 'http://localhost:5000';
const remoteserver = process.env.NEXT_PUBLIC_API_URL;
const server = isLocalhost ? localhost : remoteserver;

    const [selectedCityName, setSelectedCityName] = useState();
    const [selectedCityId, setSelectedCityId] = useState();
    const [loading, setLoading] = useState(false);
    const [currentView, setCurrentView] = useState('orderconfirmation');
    const [date, setDate] = useState(new Date());
    const [errors, setErrors] = useState({});
    const [showmodalUser, setModalUser] = useState(false);
    const [showGuestForm, setShowGuestForm] = useState(false);
    const [validated, setValidated] = useState(false);
    const [done, setDone] = useState(false);
    const [paymentcards_paymentcard_id, setPayment_method_id] = useState(3);
    const [Id, setId] = useState(null);
    const [mobileNumber, setMobileNumber] = useState('');
    const [showCashPaymentWotLogModal, setShowCashPaymentWotLogModal] = useState(false);
    const [msg, setMsg] = useState('');
    const [cities, setCities] = useState([]);
    const [city, setCity] = useState(null);
    const [customerName, setCustomerName] = useState(null);
    const [delivery_address, setDelivery_address] = useState(null);
    const [valisateerror, setError] = useState(' ');

    const [total, setTotal] = useState(0);
    const [disableminus, setDisableminus] = useState(false);
    let [maqaserror, setMaqaserror] = useState(false);

    let [producpriceSR, setProducPriceSR] = useState();
    let [productName, setProductName] = useState();
    let [tiresize, setTiresize] = useState();
    let [brandid, setBrandid] = useState(null);
    let [itemno, setItemNo] = useState();
    let [brandsinfo, setBrandinfo] = useState();
    let [currentBrand, setCurrentBrand] = useState();
    let [maxload, setMaxload] = useState();
    let [maxSpeed, setMaxSpeed] = useState();
    let [depthoftread, setDepthoftread] = useState();
    let [traction, setTraction] = useState();
    let [treadwear, setTreadwear] = useState();
    let [temperature, setTemperature] = useState();
    let [wetgripclass, setWetgripclass] = useState();
    let [noiseClass, setNoiseClass] = useState();
    let [tireClassification, setTireClassification] = useState();
    let [asymmetrical, setAsymmetrical] = useState();
    let [sports, setSports] = useState();
    let [waterEvacuation, setWaterEvacuation] = useState();
    let [handling, setHandling] = useState();
    let [madeDate, setMadeDate] = useState();
    let [madeIn, setMadeIn] = useState();
    let [rollingresistance, setRollingresistance] = useState();
    let [roadtyperoadtypeid, setRoadtyperoadtypeid] = useState();
    let [areastypeareaid, setAreastypeareaid] = useState();
    let [specialPropertiesId, setSpecialPropertiesId] = useState();
    let [valid_paypoint_id, setPayPointspaypointId] = useState();
    let [tireSpec, setireSpec] = useState();

    // جلب المدن
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await axios.get(`${server}/api/cities`);
                const formattedCities = res.data.map(city => ({
                    value: city.city_name_ar,
                    label: city.city_name_ar,
                    id: city.city_id
                }));
                setCities(formattedCities);
            } catch (err) {
                console.error("خطأ في جلب المدن", err);
            }
        };
        fetchCities();
    }, [server]);

    useEffect(() => {
        if (formData.city) {
            validateField('city', formData.city);
        }
        const timer = setTimeout(() => {
            if (formData.fullName) validateField('fullName', formData.fullName);
            if (formData.phoneNumber) validateField('phoneNumber', formData.phoneNumber);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const [fieldStatus, setFieldStatus] = useState({
        fullName: null,
        phoneNumber: null,
        city: true,
        district: null,
        streetName: null,
        landmark: true
    });

    const [formData, setFormData] = useState({
        city: 'صنعاء',
        district: '',
        streetName: '',
        landmark: '',
        latitude: null,
        longitude: null
    });

    const [isLocating, setIsLocating] = useState(false);

    const validateField = (name, value) => {
        let isValid = false;
        const cleanValue = value ? value.trim() : "";

        switch (name) {
            case 'city':
            case 'district':
            case 'streetName':
                isValid = cleanValue.length >= 3;
                break;
            case 'landmark':
                isValid = true;
                break;
            default:
                isValid = cleanValue.length > 0;
        }

        setFieldStatus(prev => ({ ...prev, [name]: isValid }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === 'city') {
                newData.district = '';
                newData.streetName = '';
                setFieldStatus(f => ({ ...f, district: null, streetName: null }));
            }
            return newData;
        });
        if (typeof validateField === "function") {
            validateField(name, value);
        }
    };

    const isFormValid = Boolean(
        fieldStatus.district &&
        fieldStatus.streetName
    );

    const cityDistricts = {
        "صنعاء": ["السبعين", "التحرير", "حدة", "شعوب", "بني الحارث", "أزال", "الصافية", "الثورة", "هائل", "الدائري", "الستين", "اخرى"],
        "عدن": ["كريتر", "المنصورة", "الشيخ عثمان", "خور مكسر", "المعلا", "التواهي", "البريقة", "اخرى"],
        "تعز": ["المظفر", "القاهرة", "صالة", "الحوبان", "بير باشا", "اخرى"],
        "إب": [
            "الظهار", "المشنة", "الكهرباء", "العدين", "جبل ربي", "الصلبة",
            "الدليل", "المرور", "الجامعة", "السحول", "المخادر", "شارع تعز",
            "شارع العدين", "باجل", "حي المحمول", "اخرى"
        ]
    };

    const handleConfirm = async () => {
        if (!selectedCityName) return Swal.fire("تنبيه", "يرجى تحديد المدينة أولاً", "warning");

        setLoading(true);
        try {
            await axios.post(`${server}/api/update-delivery-choice`, {
                orderId: orderId,
                city_id: selectedCityId,
                installation_type_id: selectedInstallationTypeId,
                customerphone: customerphone,
                customer: formData
            });
            console.log('customerphone', customerphone, formData);
         Swal.fire({
    title: "تم اعتماد طلبك",
    text: "سيقوم فريق تيراتي بالتواصل معك لتأكيد الموعد",
    icon: "success",
    confirmButtonColor: "#B85A45",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false
});

// الانتقال بعد 3 ثواني
/*
setTimeout(() => {
    router.push('/ShoppingCart');
}, 3000);
*/
// ✅ الانتقال لصفحة Invoice
// ✅ الانتقال المباشر (بدون slug)
setTimeout(() => {
    router.push('/shop/invoice');
}, 3000);
            
        } catch (err) {
            console.error(err);
            Swal.fire("خطأ", "فشل في حفظ البيانات، يرجى المحاولة لاحقاً", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tyraty-checkout-container min-h-screen bg-[#0f0f0f] py-6 px-3 md:py-10 md:px-4" dir="rtl">
            <div className="mx-auto max-w-[550px]">
                <div className="text-center mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl font-black text-white mb-2 flex items-center justify-center gap-2">
                        <span className="text-[#B85A45]">📋</span> بيانات إتمام الطلب
                    </h2>
                    <p className="text-gray-500 text-[12px] md:text-sm italic">خطوة واحدة وتصلك إطاراتك إلى باب منزلك</p>
                </div>

                <div className="bg-[#1a1a1a] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
                        <h5 className="text-white text-sm md:text-base font-bold flex items-center gap-2 m-0">
                            📍 عنوان التوصيل
                        </h5>
                        <button
                            type="button"
                            disabled={isLocating}
                            onClick={() => handleGetCurrentLocation(formData, setFormData, setIsLocating)}
                            className={`flex items-center gap-2 text-[10px] md:text-xs border px-4 py-2 rounded-full transition-all shadow-lg ${isLocating
                                    ? "bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed"
                                    : "bg-[#B85A45]/10 text-[#B85A45] border-[#B85A45]/20 hover:bg-[#B85A45] hover:text-white"
                                }`}
                        >
                            {isLocating ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-[#B85A45]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    جاري تحديد موقعك...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-geo-alt-fill"></i>
                                    تحديد موقعي التلقائي
                                </>
                            )}
                        </button>
                    </div>

                    <div className="space-y-4 mt-6">
                        <h5 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                            📍 تفاصيل العنوان
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-gray-400 text-[11px] mb-1.5 font-medium">المدينة</label>
                                <Select
                                    options={cities}
                                    styles={customStyles}
                                    placeholder="اكتب اسم المدينة (صنعاء، عدن...)"
                                    noOptionsMessage={() => "عذراً، المدينة غير موجودة"}
                                    onChange={(option) => {
                                        setSelectedCityName(option.value);
                                        setSelectedCityId(option.id);
                                    }}
                                    onInput={handleChange}
                                    isRtl={true}
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-gray-400 text-[11px] mb-1.5 font-medium">الحي / المنطقة</label>
                                <div className="relative">
                                    <input
                                        type="text" name="district" list="districts-list"
                                        className={`w-full bg-black/40 border rounded-xl py-3.5 px-4 text-white pl-10 outline-none transition-all ${fieldStatus.district === true ? 'border-green-500/50' : 'border-white/10 focus:border-[#B85A45]'
                                            }`}
                                        placeholder="اختر الحي..."
                                        onInput={handleChange}
                                        onChange={handleChange}
                                    />
                                    <datalist id="districts-list">
                                        {formData.city && cityDistricts[selectedCityName]?.map(d => <option key={d} value={d} />)}
                                    </datalist>
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                        {fieldStatus.district === true && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-gray-400 text-[11px] mb-1.5 font-medium">اسم الشارع</label>
                            <div className="relative">
                                <input
                                    type="text" name="streetName"
                                    className={`w-full bg-black/40 border rounded-xl py-3.5 px-4 text-white pl-10 outline-none transition-all ${fieldStatus.streetName === true ? 'border-green-500/50' : 'border-white/10 focus:border-[#B85A45]'
                                        }`}
                                    placeholder="أدخل اسم الشارع..."
                                    onChange={handleChange}
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    {fieldStatus.streetName === true && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-gray-400 text-[11px] mb-1.5 font-medium">أقرب معلم (اختياري)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="landmark"
                                    value={formData.landmark}
                                    className={`w-full bg-black/40 border rounded-xl py-3.5 px-4 text-white pl-10 outline-none transition-all ${formData.landmark.trim().length > 2 ? 'border-green-500/50' : 'border-white/10 focus:border-[#B85A45]'
                                        }`}
                                    placeholder="مثال: بجانب مستشفى الثورة، خلف سوبر ماركت..."
                                    onChange={handleChange}
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                                    {formData.landmark.trim().length > 2 && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 animate-fade-in" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <p className="text-[9px] text-gray-500 mt-1 mr-1">يساعد هذا الحقل السائق في الوصول إليك بسرعة أكبر في إب.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        onClick={handleConfirm}
                        disabled={!isFormValid}
                        className={`w-full py-4 rounded-xl font-black transition-all ${isFormValid
                                ? "bg-[#B85A45] text-white shadow-xl hover:scale-[1.02]"
                                : "bg-gray-800 text-gray-500 cursor-not-allowed opacity-70"
                            }`}
                    >
                        تأكيد موقع التوصيل
                    </button>

                    {!isFormValid && (
                        <p className="text-center text-[10px] text-gray-500 mt-2 italic">
                            يرجى إكمال الحقول التالية لتفعيل الطلب:
                            {!fieldStatus.district && " [ الحي ]"}
                            {!fieldStatus.streetName && " [ اسم الشارع ]"}
                        </p>
                    )}
                </div>

                {!isFormValid && (
                    <p className="text-center text-[10px] text-gray-500 mt-2 italic">
                        يرجى إكمال التحقق من الحقول التالية لتفعيل الطلب:
                        {!fieldStatus.district && " [ الحي ]"}
                        {!fieldStatus.streetName && " [ اسم الشارع ]"}
                    </p>
                )}
            </div>
        </div>
    )
}

// تنسيق react-select
const customStyles = {
    control: (provided) => ({
        ...provided,
        backgroundColor: '#000',
        borderColor: 'rgba(255,255,255,0.2)',
        padding: '5px',
        borderRadius: '12px',
        color: '#fff',
        textAlign: 'right'
    }),
    menu: (provided) => ({ ...provided, backgroundColor: '#1a1a1a', textAlign: 'right', zIndex: 9999 }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#B85A45' : '#1a1a1a',
        color: '#fff',
        cursor: 'pointer'
    }),
    singleValue: (provided) => ({ ...provided, color: '#fff' }),
    input: (provided) => ({ ...provided, color: '#fff' }),
    placeholder: (provided) => ({ ...provided, color: 'rgba(255,255,255,0.5)' })
};