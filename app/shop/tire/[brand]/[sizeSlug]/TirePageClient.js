// app/tire/[brand]/[sizeSlug]/page.js
// ═══════════════════════════════════════════════════════════
// Tire Product Page — with Social Sharing Integration
// ═══════════════════════════════════════════════════════════

"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useSearchParams } from 'next/navigation'
import { 
  FaWhatsapp, FaCreditCard, FaPrint, FaDownload, 
  FaAward, FaRoad, FaMountain, FaShareAlt
} from 'react-icons/fa'
import { 
  VolumeX, Layers, Wind, Grid3X3, Fuel, Zap,
  Weight, Gauge
} from 'lucide-react'
import { toPng } from 'html-to-image'
import axios from 'axios'
import Link from 'next/link'

// ── Components ──
import ShareButtons from '../../../../../components/helpers/ShareButtons'
import { parseSizeSlug } from '../../../../../components/Links/TireCheckoutLinks'





// ═══════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════

export default function TirePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  
  // ✅ Extract URL params
  const { brand: brandSlug, sizeSlug } = params || {}
  const tireid = searchParams.get('tid')
  const payPointId = searchParams.get('pp')
  
  // ✅ Parse tire size
  const tireSize = parseSizeSlug(sizeSlug?.split('-').slice(0, 2).join('-'))
  
  // ✅ Redux basket data
  const { lastOrderDetails } = useSelector((state) => state.basket)
  
  const cardRef = useRef()
  
  // States
  const [imageLoaded, setImageLoaded] = useState(false)
  const [tire, setTire] = useState({})
  const [brandLogo, setBrandLogo] = useState([])
  const [currentBrand, setCurrentBrand] = useState(null)
  const [areatypes, setAreatypes] = useState([])
  const [roadtypes, setRoadtypes] = useState([])
  const [currentAreaType, setCurrentAreaType] = useState(null)
  const [currentRoadType, setCurrentRoadtype] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ✅ Environment
  const isLocalhost = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true'
  const server = isLocalhost 
    ? (process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:5000')
    : (process.env.NEXT_PUBLIC_API_URL || 'https://server.tyraty.com')


  // ═══════════════════════════════════════════════════════════
  // Data Fetching
  // ═══════════════════════════════════════════════════════════
  const getFromTireId = useCallback(async () => {
    if (!tireid) {
      setError('معرف الإطار غير متوفر')
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      const cleanPayPointId = (payPointId === 'null' || !payPointId) ? null : payPointId
      
      const response = await axios.get(`${server}/api/getFromTireId`, {
        params: { producid: tireid, payPointId: cleanPayPointId }
      })
      
      const data = response.data
      console.log('Tire data:', data)
      
      setTire({
        id: data.product_id,
        tiresize: data.tiresize,
        productname: data.productName,
        tire_slug: data.tire_slug,
        brandname: data?.brandNameAr || data?.brandNameEN,
        imageUrl: data.imageURL,
        image: data.imageURL,
        Maxload: data.Maxload,
        MaxSpeed: data.MaxSpeed,
        Depthoftread: data.Depthoftread,
        Rollingresistance: data.Rollingresistance,
        Wetgripclass: data.Wetgripclass,
        noiseClass: data.noiseClass,
        price: data.priceSAR,
        madeDate: data.madeDate,
        paypointid: data.paypointid,
        paypointName: data.paypointName,
        madein: data.MadeIn,
        traction: data.traction,
        treadwear: data.treadwear,
        waterEvacuation: data.waterEvacuation,
        asymmetrical: data.asymmetrical,
        symmetrical: data.symmetrical,
        directional: data.directional,
        temperature: data.temperature,
        handling: data.handling,
        tireClassification: data.tireClassification,
        brandid: data.brands_brand_id,
        areastype_area_id: data.areastype_area_id,
        roadtype_road_type_id: data.roadtype_road_type_id,
        fuelEfficiency: data.fuelEfficiency
      })
      
      setLoading(false)
    } catch (err) {
      console.error('Error fetching tire:', err)
      setError('فشل تحميل بيانات الإطار')
      setLoading(false)
    }
  }, [tireid, payPointId, server])

  const getBrandLogo = useCallback(async () => {
    try {
      const response = await axios.get(`${server}/getbrandLogo`)
      setBrandLogo(response.data)
    } catch (err) {
      console.error('Error fetching brands:', err)
    }
  }, [server])

  const getAreatypes = useCallback(async () => {
    try {
      const response = await axios.get(`${server}/getAreatypes`)
      setAreatypes(response.data)
    } catch (err) {
      console.error('Error fetching area types:', err)
    }
  }, [server])

  const getRoadtypes = useCallback(async () => {
    try {
      const response = await axios.get(`${server}/getRoadtypes`)
      setRoadtypes(response.data)
    } catch (err) {
      console.error('Error fetching road types:', err)
    }
  }, [server])

  // ═══════════════════════════════════════════════════════════
  // Effects
  // ═══════════════════════════════════════════════════════════

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    if (tireid) {
      getFromTireId()
      getBrandLogo()
      getAreatypes()
      getRoadtypes()
    }
  }, [tireid, getFromTireId, getBrandLogo, getAreatypes, getRoadtypes])

  useEffect(() => {
    if (tire.brandid && brandLogo.length > 0) {
      const found = brandLogo.find(b => b.brand_id === tire.brandid)
      setCurrentBrand(found || null)
    }
  }, [tire.brandid, brandLogo])

  useEffect(() => {
    if (tire.areastype_area_id && areatypes.length > 0) {
      const found = areatypes.find(a => a.area_id === tire.areastype_area_id)
      setCurrentAreaType(found || null)
    }
  }, [tire.areastype_area_id, areatypes])

  useEffect(() => {
    if (tire.roadtype_road_type_id && roadtypes.length > 0) {
      const found = roadtypes.find(r => r.road_type_id === tire.roadtype_road_type_id)
      setCurrentRoadtype(found || null)
    }
  }, [tire.roadtype_road_type_id, roadtypes])

  useEffect(() => {
    if (!currentBrand?.brandNameAr) return
    const brand = currentBrand.brandNameAr || currentBrand.brandNameEn
    if (!brand || brand === 'undefined') return
    
    axios.get(`${server}/getRelatedPosts?brand=${encodeURIComponent(brand)}`)
      .then(res => setRelatedPosts(res.data))
      .catch(err => console.error("Error fetching related posts:", err))
  }, [currentBrand, server])

  // ═══════════════════════════════════════════════════════════
  // Handlers
  // ═══════════════════════════════════════════════════════════

  const handleDownloadImage = async () => {
    const element = cardRef.current
    if (!element) return

    try {
      await document.fonts.ready
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: '#ffffff',
        cacheBust: true,
        filter: (node) => node.className !== 'no-print',
        style: { direction: 'rtl' }
      })

      const link = document.createElement('a')
      link.download = `Tyraty.com-${tire.tiresize || 'tire'}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Download Error:', err)
      alert('نعتذر، حدث خطأ في معالجة الصورة.')
    }
  }

  const handlePrint = () => window.print()
  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد'
    return new Date(dateString).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  // ═══════════════════════════════════════════════════════════
  // Derived Data
  // ═══════════════════════════════════════════════════════════

  const getTreadType = () => {
    if (tire.asymmetrical) return { name: "نقشة غير متماثلة", en: "Asymmetrical", icon: <Layers className="w-5 h-5 text-purple-400" />, desc: "أداء فائق في المنعطفات وتشتيت المياه" }
    if (tire.directional) return { name: "نقشة اتجاهية", en: "Directional", icon: <Wind className="w-5 h-5 text-blue-400" />, desc: "ثبات ممتاز في السرعات العالية والأجواء الماطرة" }
    if (tire.symmetrical) return { name: "نقشة متماثلة", en: "Symmetrical", icon: <Grid3X3 className="w-5 h-5 text-gray-400" />, desc: "هدوء عالي وعمر افتراضي أطول للإطار" }
    return null
  }

  const tread = getTreadType()
  const isQuiet = tire.noiseClass && parseInt(tire.noiseClass) <= 71
  const hasHighStability = (tire.traction === 'A' || tire.traction === 'AA') || (tire.MaxSpeed && parseInt(tire.MaxSpeed) > 240)
  const isFuelEfficient = tire.fuelEfficiency === 1 || tire.fuelEfficiency === "1"

  // Links
  const whatsappLink = `https://wa.me/967775955150?text=` + 
    `من فضلك احتاج شراء اطار ماركة ${tire.brandname} المقاس: ${tire.tiresize} والمسعر بقيمة: ${tire.price} ريال`
  const checkoutUrl = `/shop/checkout/${brandSlug}/${sizeSlug}?tid=${tireid}&pp=${payPointId || '0'}`
  // ═══════════════════════════════════════════════════════════
  // Page URL for sharing (client-side)
  // ═══════════════════════════════════════════════════════════
  const [pageUrl, setPageUrl] = useState('')
  useEffect(() => {
    setPageUrl(window.location.href)
  }, [])

  // ═══════════════════════════════════════════════════════════
  // Loading & Error States
  // ═══════════════════════════════════════════════════════════

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B85A45] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">جاري تحميل بيانات الإطار...</p>
        </div>
      </div>
    )
  }

  if (error || !currentBrand) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white" dir="rtl">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'لم يتم العثور على البيانات'}</p>
          <Link href="/" className="text-[#B85A45] hover:underline">العودة للرئيسية</Link>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-[#050505] text-white font-alexandria pb-20" dir="rtl">
      
      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
          <Link href="/" className="hover:text-[#B85A45] transition-colors">الرئيسية</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#B85A45] transition-colors">المنتجات</Link>
          <span>/</span>
          <Link href={`/tire/${brandSlug}`} className="hover:text-[#B85A45] transition-colors">
            {currentBrand?.brandNameAr}
          </Link>
          <span>/</span>
          <span className="text-white font-bold">{tireSize}</span>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* ═══════════════════════════════════════
              Right Column: Image & Actions
              ═══════════════════════════════════════ */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Image */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#B85A45]/20 blur-[60px] rounded-full scale-75 group-hover:scale-90 transition-transform duration-700"></div>
              
              <div className="relative bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-2xl">
                <div className="absolute top-4 right-6 opacity-10 pointer-events-none">
                  <img src={currentBrand?.brandLogo} className="w-24 filter grayscale" alt="" />
                </div>

                <img 
                  src={tire.image} 
                  alt={`${tire.productname} ${tire.tiresize}`}
                  className="w-full h-auto object-contain relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Smart Features */}
            {(isQuiet || hasHighStability || isFuelEfficient) && (
              <div className="px-6 py-4 bg-white/[0.02] border-t border-b border-white/5">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 text-center tracking-[0.2em]">
                  المميزات المعتمدة
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {isQuiet && (
                    <div className="flex flex-col items-center p-3 rounded-2xl bg-black/40 border border-blue-500/20 w-24">
                      <VolumeX className="w-6 h-6 text-blue-400 mb-1 animate-pulse" />
                      <span className="text-[9px] font-bold text-gray-300">هدوء تام</span>
                    </div>
                  )}
                  {hasHighStability && (
                    <div className="flex flex-col items-center p-3 rounded-2xl bg-black/40 border border-red-500/20 w-24">
                      <Zap className="w-6 h-6 text-red-500 mb-1" />
                      <span className="text-[9px] font-bold text-gray-300 text-center leading-tight">ثبات رياضي عالي</span>
                    </div>
                  )}
                  {isFuelEfficient && (
                    <div className="flex flex-col items-center p-3 rounded-2xl bg-black/40 border border-green-500/20 w-24">
                      <Fuel className="w-6 h-6 text-green-500 mb-1" />
                      <span className="text-[9px] font-bold text-gray-300">موفر للوقود</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tread Type */}
            {tread && (
              <div className="mb-6 p-4 bg-white/5 rounded-[1.5rem] border border-white/5 relative overflow-hidden group/tread">
                <div className="absolute -left-4 -top-4 w-12 h-12 bg-[#B85A45]/10 rounded-full blur-xl group-hover/tread:bg-[#B85A45]/20 transition-colors"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="p-3 bg-black rounded-xl border border-white/10 shadow-inner">
                    {tread.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-black text-white">{tread.name}</span>
                      <span className="text-[10px] text-gray-500 font-mono uppercase tracking-tighter">({tread.en})</span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed italic">{tread.desc}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════
                Social Share Buttons — NEW SECTION
                ═══════════════════════════════════════════ */}
            <div className="bg-[#0f0f0f] border border-white/8 rounded-2xl p-5">
              <ShareButtons
                url={pageUrl}
                title={`${tire.tire_slug} ${tire.tiresize}`}
                description={`إطار ${tire.brandname} أصلي — ${tire.tiresize}${tire.price ? ` | السعر: ${tire.price} ر.س` : ''}`}
                image={tire.imageUrl}
                tire_slug={tire.tire_slug}
                tireSize={tire.tiresize}
                price={tire.price}
                brand={tire.brandname}
                layout="row"
                showLabel={true}
                showPreview={true}
                showTitle={true}
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
              <a 
                href={whatsappLink}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/20 py-4 rounded-xl transition-all duration-300 font-bold group"
              >
                <FaWhatsapp className="text-xl group-hover:scale-110 transition-transform" />
                <span>شراء عبر واتساب</span>
              </a>

              <Link 
                href={checkoutUrl}
                className="flex items-center justify-center gap-3 bg-[#B85A45] hover:bg-[#9C4836] text-white py-4 rounded-xl shadow-lg shadow-[#B85A45]/20 hover:shadow-[#B85A45]/40 transition-all duration-300 font-bold group"
              >
                <span>إتمام الدفع</span>
                <FaCreditCard className="text-lg group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* ═══════════════════════════════════════
              Left Column: Info & Specs
              ═══════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Header */}
            <header>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                {currentBrand && (
                  <img 
                    src={currentBrand.brandLogo} 
                    alt={currentBrand.brandName} 
                    className="h-12 object-contain brightness-125 bg-white/5 p-2 rounded-lg" 
                  />
                )}
                <div className="bg-[#B85A45]/10 text-[#B85A45] px-4 py-1 rounded-full border border-[#B85A45]/20 text-sm font-bold animate-pulse">
                  متوفر في المخزون
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">
                إطار {currentBrand?.brandNameAr}{' '}
                <span className="text-[#B85A45] block md:inline">{tire.tiresize}</span>
              </h1>
              <p className="text-gray-400 text-lg tracking-wide">{tire.productname} - الأداء العالي</p>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mt-6">
                {currentBrand?.BrandValueRanking && (
                  <div className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 px-4 py-2 rounded-full">
                    <FaAward className="text-yellow-500" />
                    <span className="text-xs text-gray-300">المركز {currentBrand.BrandValueRanking} عالمياً</span>
                  </div>
                )}
                {currentBrand?.COO && (
                  <div className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 px-4 py-2 rounded-full">
                    <FaAward className="text-yellow-500" />
                    <span className="text-xs text-gray-300">بلد المنشأ: {currentBrand.COO}</span>
                  </div>
                )}
                {currentBrand?.BSI && (
                  <div className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 px-4 py-2 rounded-full">
                    <span className="text-xs text-gray-300">BSI: {currentBrand.BSI}</span>
                  </div>
                )}
                {currentAreaType && (
                  <div className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 px-4 py-2 rounded-full">
                    <FaMountain className="text-blue-400" />
                    <span className="text-xs text-gray-300">{currentAreaType.area_name_ar}</span>
                  </div>
                )}
                {currentRoadType && (
                  <div className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 px-4 py-2 rounded-full">
                    <FaRoad className="text-gray-400" />
                    <span className="text-xs text-gray-300">{currentRoadType.road_type_Name}</span>
                  </div>
                )}
              </div>
            </header>

            {/* Specs Card */}
            <div ref={cardRef} className="bg-[#0f0f0f] border border-white/10 rounded-3xl overflow-hidden relative">
              <div className="bg-gradient-to-r from-[#B85A45] to-[#8f402e] p-4 flex justify-between items-center">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <FaAward /> المواصفات الفنية المعتمدة
                </h3>
                <img src="/لوجو تايراتي tyrate - Opject-09.svg" className="h-6 brightness-200 opacity-50" alt="tyraty.com" />
              </div>

              <div className="p-6 bg-[#0f0f0f] relative">
                {/* Key Specs Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 bg-black/40 border border-white/5 rounded-2xl flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <Weight className="w-4 h-4 text-[#B85A45]" />
                      <span className="text-[10px] font-bold text-gray-500 italic">الحمولة القصوى</span>
                    </div>
                    <span className="text-sm font-black text-white">
                      {tire.Maxload ? `${tire.Maxload} كجم` : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="p-3 bg-black/40 border border-white/5 rounded-2xl flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <Gauge className="w-4 h-4 text-[#B85A45]" />
                      <span className="text-[10px] font-bold text-gray-500 italic">مؤشر السرعة</span>
                    </div>
                    <span className="text-sm font-black text-white">
                      {tire.MaxSpeed ? `${tire.MaxSpeed} كم/س` : 'N/A'}
                    </span>
                  </div>
                </div>
                
                {/* Full Specs List */}
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    { label: 'مقاس الإطار', value: tire.tiresize, highlight: true },
                    { label: 'نقشة الإطار', value: tire.productname },
                    { label: 'أقصى حمولة', value: tire.Maxload },
                    { label: 'مؤشر السرعة', value: tire.MaxSpeed },
                    { label: 'عمق الدعسة', value: tire.Depthoftread ? `${tire.Depthoftread} ملم` : null },
                    { label: 'مقاومة الدوران', value: tire.Rollingresistance },
                    { label: 'التماسك على الرطب', value: tire.Wetgripclass },
                    { label: 'مستوى الضجيج', value: tire.noiseClass ? `${tire.noiseClass} dB` : null },
                    { label: 'Traction التماسك', value: tire.traction },
                    { label: 'Treadwear التآكل', value: tire.treadwear }, 
                    { label: 'Temperature تحمل الحرارة', value: tire.temperature },
                  ]
                    .filter(item => item.value)
                    .map((item, index) => (
                      <div 
                        key={index} 
                        className={`flex justify-between items-center py-3 border-b border-white/5 ${item.highlight ? 'text-[#B85A45]' : 'text-gray-300'}`}
                      >
                        <dt className="text-sm text-gray-500 font-medium">{item.label}</dt>
                        <dd className={`text-sm font-bold ${item.highlight ? 'text-lg' : ''}`}>{item.value}</dd>
                      </div>
                    ))}
                </dl>
                
                {/* Card Footer */}
                <footer className="mt-8 pt-4 border-t border-white/10 flex justify-between items-end opacity-50">
                  <div className="text-[10px] text-gray-500">
                    <p>تم استخراج هذه الوثيقة من موقع امباير تايراتي</p>
                    <p>Tyraty.com © {new Date().getFullYear()}</p>
                  </div>
                  <div className="text-[10px] text-[#B85A45] tracking-[0.3em] uppercase font-bold">Original Parts</div>
                </footer>
              </div>
            </div>

            {/* Download & Print */}
            <div className="flex gap-4 no-print mt-6">
              <button 
                onClick={handleDownloadImage} 
                className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#252525] text-white border border-white/10 hover:border-[#B85A45] py-4 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg group"
              >
                <FaDownload className="text-[#B85A45] group-hover:scale-110 transition-transform" /> 
                <span>حفظ المواصفات</span>
              </button>

              <button 
                onClick={handlePrint} 
                className="flex-1 flex items-center justify-center gap-2 bg-transparent hover:bg-[#B85A45]/10 text-gray-300 hover:text-white border border-white/10 hover:border-[#B85A45] py-4 rounded-xl text-sm font-bold transition-all duration-300 group"
              >
                <FaPrint className="text-gray-400 group-hover:text-[#B85A45] transition-colors" /> 
                <span>طباعة التقرير</span>
              </button>
            </div>

            {/* ═══════════════════════════════════════════
                Mobile Sticky Share Bar
                ═══════════════════════════════════════════ */}
            <div className="md:hidden">
              <ShareButtons
                url={pageUrl}
                title={`${tire.productname} ${tire.tiresize}`}
                description={`إطار ${tire.brandname} أصلي — ${tire.tiresize}`}
                image={tire.imageUrl}
                productName={tire.productname}
                tireSize={tire.tiresize}
                price={tire.price}
                brand={tire.brandname}
                layout="compact"
                showLabel={false}
                showPreview={false}
                showTitle={false}
                sticky={true}
              />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            Related Posts
            ═══════════════════════════════════════ */}
        {relatedPosts.length > 0 && (
          <section className="mt-24 border-t border-white/5 pt-12">
            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-[#B85A45] rounded-full block"></span>
              مقالات تهمك عن إطارات {currentBrand?.brandNameAr}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(post => (
                <article key={post.post_id} className="group bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden hover:border-[#B85A45]/30 transition-all duration-300">
                  <div className="h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all z-10"></div>
                    <img 
                      src={post.postImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-white font-bold mb-3 line-clamp-2 leading-relaxed group-hover:text-[#B85A45] transition-colors">
                      {post.title}
                    </h3>
                    <Link 
                      href={`/blog/${post.post_slug || post.post_id}`} 
                      className="text-gray-500 text-sm flex items-center gap-2 hover:gap-4 transition-all duration-300 hover:text-white"
                    >
                      اقرأ المزيد <span className="text-[#B85A45]">&larr;</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}