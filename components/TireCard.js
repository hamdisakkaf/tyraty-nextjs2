// components/TireCard.js - تصميم محسّن للبطاقة (متوافق مع Next.js)

import Image from 'next/image'
import { 
  Weight, Gauge, VolumeX, TrendingUp, Fuel, Droplets, 
  Zap, ThermometerSnowflake, Flame, ArrowLeft, Layers,
  ChevronLeft, CreditCard, Globe, Calendar, Tag
} from 'lucide-react'
import { getTractionData, getTreadwearBadge, getTempData } from './helpers/utils'
import TireDetailLink from './Links/TireCheckoutLinks'

export default function TireCard({ tire, onPayment, viewMode = 'detailed' }) {
  const {
    product_id,
    brandName,
    brandNameAr,
    productName,
    tiresize,
    price,
    finalPrice,
    imageURL,
    brandLogo,
    Maxload,
    MaxSpeed,
    noiseClass,
    handling,
    fuelEfficiency,
    waterEvacuation,
    traction,
    temperature,
    treadwear,
    payPointId,
    pricesid,
    COO,
    madeDate
  } = tire

  const tractionData = getTractionData('traction', traction)
  const tempData = getTempData(temperature)
  const treadwearData = getTreadwearBadge(treadwear)

  // منطق الأداء العالي
  const isHighPerf = (traction === 'A' || traction === 'AA') && (parseInt(MaxSpeed) > 210)

  // تنسيق الأسعار
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'SAR', minimumFractionDigits: 0,
  }).format(Number(price))

  const formattedYER = new Intl.NumberFormat('en-US', {
    style: 'decimal', 
    maximumFractionDigits: 0,
  }).format(finalPrice)

  // ── وضع العرض المصغر (Grid Mode) ──
  if (viewMode === 'grid') {
    return (
      <div className="group bg-[#0f0f0f] border border-white/10 rounded-[2rem] overflow-hidden hover:border-[#B85A45]/50 transition-all duration-300 h-full flex flex-col relative">
        {/* سعر بارز في الركن */}
        <div className="absolute top-3 right-3 z-20">
          <div className="bg-[#B85A45] text-white px-3 py-1.5 rounded-xl font-black text-sm shadow-lg shadow-[#B85A45]/40 border border-[#B85A45]/50 flex items-center gap-1.5">
            <Tag size={12} />
            {formattedPrice.replace('SAR', '').trim()}
            <span className="text-[9px] opacity-80">ر.س</span>
          </div>
        </div>

        <div className="p-4 flex flex-col h-full text-center pt-12">
          <div className="relative h-4 mb-2 self-center">
            <Image 
              src={brandLogo || '/assests/tires/tire-placeholder.webp'} 
              alt={brandName || ''}
              fill
              className="object-contain filter brightness-200 opacity-60"
              unoptimized
            />
          </div>
          <div className="relative mb-2 flex justify-center h-32">
            <Image 
              src={imageURL || '/assests/tires/tire-placeholder.webp'}
              alt={productName || ''}
              fill
              className="object-contain z-10"
              unoptimized
            />
            <div className="absolute inset-0 bg-[#B85A45]/5 blur-xl rounded-full"></div>
          </div>
          <h4 className="text-white text-sm font-black mb-1 leading-tight">{tiresize}</h4>
          <p className="text-gray-400 text-xs mb-2">{productName}</p>
          <button 
            onClick={() => onPayment && onPayment(pricesid)}
            className="mt-auto w-full bg-[#B85A45] text-white text-[10px] py-2.5 rounded-xl font-bold hover:bg-[#a04d3a] transition-colors"
          >
            شراء الآن
          </button>
        </div>
      </div>
    )
  }

  // ── وضع العرض التفصيلي (Detailed Mode) ──
  return (
    <div className="group bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden hover:border-[#B85A45]/30 transition-all duration-300 h-full flex flex-col relative">

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* شارة السعر العاملة والبارزة - ركن القسم الأيمن العلوي */}
      {/* ═══════════════════════════════════════════════════════════ */}
{/* ═══════════════════════════════════════════════════════════ */}
{/* إعادة تصميم شارة السعر: تصميم "الزجاج المطفأ" فائق الاحترافية */}
{/* ═══════════════════════════════════════════════════════════ */}
<div className="absolute top-5 right-5 z-30">
  <div className="relative group/price opacity-70">
    {/* تأثير التوهج الخلفي (Glow) */}
    <div className="absolute -inset-1 bg-[#d4a843]/20 blur-md rounded-2xl opacity-0 group-hover/price:opacity-100 transition-all duration-500"></div>

    {/* الحاوية الأساسية للشارة */}
    <div className="relative backdrop-blur-xl bg-black/40  p-3 rounded-2xl shadow-2xl flex flex-col items-center min-w-[110px]">
      
      {/* صف السعر الرئيسي */}
      <div className="flex items-center gap-1.5 mb-1">
        <Tag size={12} className="text-[#d4a843]" />
        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">Price</span>
      </div>

      <div className="flex items-baseline gap-0.5">
        <span className="text-2xl font-black text-white tracking-tighter leading-none">
          {formattedPrice.replace('SAR', '').replace(',', '').trim()}
        </span>
        <span className="text-[10px] font-bold text-[#d4a843]">ر.س</span>
      </div>

      {/* خط فاصل أنيق */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-2"></div>

      {/* السعر المحلي (YER) - تصميم نصي أنيق */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-black text-gray-100">{formattedYER}</span>
        <span className="text-[10px] font-bold text-gray-500">ر.ي</span>
      </div>
      
      {/* حافة زخرفية إضافية */}
      <div className="absolute top-0 left-0 w-full h-full  rounded-2xl pointer-events-none"></div>
    </div>
  </div>
</div>

      {/* رأس البطاقة: شعار البراند مع الاسم */}
      <div className="p-5 flex justify-center items-center bg-black/30 border-b border-white/5 group/brand">
        <div className="flex flex-col items-center gap-2">
          <span className="text-gray-600 text-[8px] font-bold uppercase tracking-[0.3em] leading-none mb-1 opacity-60 group-hover/brand:opacity-100 transition-opacity">
            Premium Selection
          </span>
          <div className="flex items-center gap-3">
            <div className="relative h-5 w-20">
              <Image 
                src={brandLogo || '/assests/tires/tire-placeholder.webp'}
                alt={brandName || ''}
                fill
                className="object-contain filter brightness-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                unoptimized
              />
            </div>
            <div className="w-[1px] h-3 bg-white/10"></div>
            <span className="text-white text-[13px] font-black uppercase tracking-tight font-sans">
              {brandName}
            </span>
          </div>
        </div>
      </div>

      {/* صورة المنتج مع توهج خلفي */}
      <div className="relative flex justify-center py-2 group-hover:scale-105 transition-transform duration-500">
        <div className="absolute inset-0 bg-white/5 blur-[40px] rounded-full scale-75"></div>
        <div className="relative z-10 w-48 h-48">
          <Image 
            src={imageURL || '/assests/tires/tire-placeholder.webp'}
            alt={productName || ''}
            fill
            className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)]"
            unoptimized
            onError={(e) => { e.target.src = "/assests/tires/tire-placeholder.webp"; }}
          />
        </div>
      </div>

      {/* منطقة المقاس التقنية */}
      <div className="px-6 py-3 flex justify-center items-center z-10">
        <div className="relative group cursor-help" title="مقاس الإطار المعتمد">
          <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full transition-all duration-700 group-hover:bg-[#B85A45]/10"></div>
          <div className="relative bg-gradient-to-b from-[#1a1a1a] to-black border border-white/20 px-6 py-3 rounded-2xl backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_30px_-5px_rgba(0,0,0,0.8)] flex flex-col items-center transition-transform duration-500 group-hover:translate-y-[-2px]">
            <div className="flex items-center gap-1.5 mb-1.5 opacity-50">
              <Layers size={11} className="text-gray-500" />
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em]">Size</span>
            </div>
            <h4 className="text-white font-black text-3xl tracking-tighter font-sans m-0 leading-none drop-shadow-[0_2px_0_rgba(255,255,255,0.2),0_4px_1px_rgba(0,0,0,0.9),0_10px_10px_rgba(184,90,69,0.2)]">
              {tiresize}
            </h4>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#B85A45] shadow-[0_0_10px_2px_#B85A45] opacity-80 group-hover:opacity-100"></div>
          </div>
        </div>
      </div>

      {/* تفاصيل المنتج (Body) */}
      <div className="px-6 py-4 flex-grow flex flex-col text-right">
        <h3 className="text-2xl font-black text-white mb-1">{brandNameAr}</h3>
        <p className="text-gray-400 text-sm mb-4">{productName}</p>

        <div className="space-y-3 mt-4">

          {/* تصنيف التماسك (Traction) */}
          {tractionData && (
            <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl cursor-default transition-all duration-300 hover:bg-white/[0.05] hover:border-blue-500/50 hover:shadow-[0_0_20px_-10px_rgba(59,130,246,0.3)] group">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                <Zap className="text-blue-400" size={18} />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">قوة التماسك</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black transition-colors" style={{ color: tractionData.color }}>
                    {tractionData.label}
                  </span>
                  <span className="text-[10px] text-white/40 bg-white/5 px-1.5 rounded border border-white/10 group-hover:border-blue-500/30">
                    {traction}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* تصنيف درجة الحرارة (Temperature) */}
          {tempData && (
            <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl cursor-default transition-all duration-300 hover:bg-white/[0.05] hover:border-orange-500/50 hover:shadow-[0_0_20px_-10px_rgba(249,115,22,0.3)] group">
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
                <ThermometerSnowflake className="text-orange-400" size={18} />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">مقاومة الحرارة</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black transition-colors" style={{ color: tempData.color }}>
                    {tempData.label}
                  </span>
                  <span className="text-[10px] text-white/40 bg-white/5 px-1.5 rounded border border-white/10 group-hover:border-orange-500/30">
                    {temperature}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Treadwear */}
          {treadwearData && (
            <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
              <span style={{ fontSize: '1.2rem' }}>{treadwearData.icon}</span>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">جودة التحمل (Treadwear)</span>
                <span className="text-sm font-black" style={{ color: treadwearData.color }}>
                  {treadwearData.label} ({treadwear}) 
                </span>
              </div>
            </div>
          )}

          {/* وسم الأداء العالي */}
          {isHighPerf && (
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#B85A45]/10 to-transparent border border-[#B85A45]/20 rounded-2xl relative overflow-hidden transition-all duration-500 hover:from-[#B85A45]/20 group">
              <div className="p-2 rounded-lg bg-[#B85A45]/20 border border-[#B85A45]/30 group-hover:rotate-12 transition-transform">
                <Flame className="text-[#B85A45]" size={18} />
              </div>
              <div className="flex flex-col text-right z-10">
                <span className="text-[11px] font-black text-white tracking-tight">إطار ذو أداء رياضي خارق</span>
                <span className="text-[9px] text-[#B85A45] font-bold">High Performance Grade</span>
              </div>
            </div>
          )}
        </div>

        {/* المميزات بشكل طولي */}
        <div className="space-y-4 mb-6 border-t border-b border-white/5 py-4 text-right mt-4">

          {/* الحمولة والسرعة */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 bg-white/[0.03] p-3 rounded-xl border border-white/5">
              <div className="p-2 rounded-lg bg-[#B85A45]/10 border border-[#B85A45]/20">
                <Weight className="text-[#B85A45]" size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-[9px] font-bold">قدرة الحمولة</span>
                <span className="text-white text-sm font-black"> kg {Maxload} </span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.03] p-3 rounded-xl border border-white/5">
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <Gauge className="text-orange-500" size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-[9px] font-bold">رمز السرعة</span>
                <span className="text-white text-sm font-black"> km/h {MaxSpeed}</span>
              </div>
            </div>
          </div>

          {/* أيقونة الهدوء */}
          {Number(noiseClass) <= 70 && (
            <div className="flex items-center gap-3 animate-in fade-in duration-500">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <VolumeX className="text-blue-400" size={18} />
              </div>
              <div>
                <span className="text-white text-xs font-bold block">هدوء (اقل من 70 ديسيبل)</span>
                <span className="text-gray-500 text-[10px]">تقنية تقليل الضجيج مفعلة</span>
              </div>
            </div>
          )}

          {/* أيقونة الثبات */}
          {Number(handling) === 1 && (
            <div className="flex items-center gap-3 animate-in fade-in duration-500">
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <TrendingUp className="text-red-500" size={18} />
              </div>
              <div>
                <span className="text-white text-xs font-bold block">ثبات وتحكم عالٍ</span>
                <span className="text-gray-500 text-[10px]">استقرار عالي في المنعطفات</span>
              </div>
            </div>
          )}

          {/* أيقونة توفير الوقود */}
          {Number(fuelEfficiency) === 1 && (
            <div className="flex items-center gap-3 animate-in fade-in duration-500">
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <Fuel className="text-green-500" size={18} />
              </div>
              <div>
                <span className="text-white text-xs font-bold block">توفير الوقود</span>
                <span className="text-gray-500 text-[10px]">كفاءة طاقة فئة ممتازة</span>
              </div>
            </div>
          )}

          {/* أيقونة تصريف المياه */}
          {Number(waterEvacuation) === 1 && (
            <div className="flex items-center gap-3 animate-in fade-in duration-500">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <Droplets className="text-cyan-400" size={18} />
              </div>
              <div>
                <span className="text-white text-xs font-bold block">تصريف سريع للمياه</span>
                <span className="text-gray-500 text-[10px]">أمان عالي على الطرق المبللة</span>
              </div>
            </div>
          )}

          {/* رابط المواصفات التفصيلية */}
          <TireDetailLink
            key={product_id}
            tireSize={tiresize}
            tireid={product_id}
            payPointId={payPointId}
            brandName={brandName}
            productName={productName}
            className="flex items-center justify-between group/link bg-white/[0.03] hover:bg-[#B85A45]/10 p-3 rounded-xl border border-white/5 hover:border-[#B85A45]/30 transition-all mt-4"
          >
            <div className="flex items-center gap-3">
              <Image src={imageURL} 
                className="w-12 h-12 object-contain" alt={productName} 
                 sizes="600px"
                />
              <div>
                <p className="font-bold text-white">{productName}</p>
                <p className="text-sm text-gray-400">{tiresize}</p>
              </div>
            </div>
            <span className="text-[#B85A45] font-bold">{formattedPrice} ر.س</span>
          </TireDetailLink>
        </div>

        {/* بيانات المنشأ */}
        <div className="flex justify-between items-center bg-white/[0.03] p-3 rounded-xl mb-4 text-[11px] text-gray-400 border border-white/5">
          <div className="flex items-center gap-1">
            <Globe size={13} className="text-[#B85A45]" />
            <span>{COO}</span>
          </div>
          <div className="flex items-center gap-1 border-x border-white/10 px-3">
            <Calendar size={13} className="text-[#B85A45]" />
            <span>{madeDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge size={13} className="text-[#B85A45]" />
            <span>{MaxSpeed}</span>
          </div>
        </div>

        {/* منطقة الدفع السفلية */}
        <div className="p-6 bg-gradient-to-t from-black to-[#0a0a0a] border-t border-white/10 mt-auto rounded-b-[2rem] -mx-6 -mb-4">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-baseline justify-between">
              <div className="text-right">
                <span className="text-[10px] text-gray-500 block font-bold mb-1 mr-1 uppercase tracking-wider">السعر الإجمالي</span>
                <div className="flex items-baseline gap-1">
                  <h4 className="text-4xl font-black text-white m-0 tracking-tighter">
                    {formattedYER}
                  </h4>
                  <span className="text-sm text-[#F59E0B] font-bold">ر.ي</span>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
                <span className="text-[9px] text-gray-500 block text-center mb-0.5">بالسعودي</span>
                <span className="text-xs font-bold text-gray-200">
                  {formattedPrice.replace('SAR', '').trim()} <span className="text-[9px] text-[#F59E0B]">ر.س</span>
                </span>
              </div>
            </div>
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => onPayment && onPayment(pricesid)} 
              className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#D97706] hover:to-[#B45309] text-black font-black text-sm py-4 rounded-2xl transition-all active:scale-[0.96] flex justify-center items-center gap-2 shadow-[0_15px_30px_-10px_rgba(217,119,6,0.4)]"
            >
              <CreditCard size={20} />
              <span>إتمام عملية الشراء والدفع</span>
            </button>
            <p className="text-center text-gray-600 text-[9px] font-medium">
              جميع الأسعار تشمل خدمة فحص المواصفات والتوصيل
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}