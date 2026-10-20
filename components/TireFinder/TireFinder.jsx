"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Spinner, Badge } from 'react-bootstrap';
import { 
  Search, Car, ChevronDown, MapPin, Building2, Calendar, Tag, 
  CheckCircle2, AlertCircle, ArrowLeft, Gauge, Sparkles, Star,
  Ruler, Circle, Info, Fuel, Gauge as GaugeIcon, Weight, Wind
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image';

const TireFinder = () => {
  const API_KEY = '58e603d917eb28bfaa1f92a0f3a426a6'; 
  const BASE_URL = 'https://api.wheel-size.com/v2';
  const router = useRouter()
  const pathname = usePathname()

  const resultRef = useRef(null);

  const [region, setRegion] = useState('medm');
  const [makes, setMakes] = useState([]);
  const [years, setYears] = useState([]);
  const [models, setModels] = useState([]);

  const [selectedMake, setSelectedMake] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState(null); // ← بيانات السيارة الكاملة
  const [tireResults, setTireResults] = useState([]);
  const [error, setError] = useState('');

  const getProgress = () => {
    let progress = 0;
    if (region) progress += 20;
    if (selectedMake) progress += 20;
    if (selectedYear) progress += 20;
    if (selectedModel) progress += 20;
    if (tireResults.length > 0) progress += 20;
    return progress;
  };

  useEffect(() => {
    if (!region) return;
    setMakes([]); setYears([]); setModels([]);
    setSelectedMake(''); setSelectedYear(''); setSelectedModel('');
    setTireResults([]); setVehicleData(null); setError('');

    fetch(`${BASE_URL}/makes/?user_key=${API_KEY}&region=${region}`)
      .then(res => res.json())
      .then(data => { setMakes(Array.isArray(data) ? data : (data.data || [])); })
      .catch(err => { setMakes([]); setError('فشل في تحميل الماركات'); });
  }, [region]);

  const handleMakeChange = (e) => {
    const make = e.target.value;
    setSelectedMake(make);
    setYears([]); setModels([]); setSelectedYear(''); setSelectedModel('');
    setTireResults([]); setVehicleData(null); setError('');
    if (!make) return;

    fetch(`${BASE_URL}/years/?user_key=${API_KEY}&make=${make}&region=${region}`)
      .then(res => res.json())
      .then(data => { setYears(Array.isArray(data) ? data : (data.data || [])); })
      .catch(err => { setYears([]); setError('فشل في تحميل السنوات'); });
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    setModels([]); setSelectedModel(''); setTireResults([]); setVehicleData(null); setError('');
    if (!year) return;

    fetch(`${BASE_URL}/models/?user_key=${API_KEY}&make=${selectedMake}&year=${year}&region=${region}`)
      .then(res => res.json())
      .then(data => { setModels(Array.isArray(data) ? data : (data.data || [])); })
      .catch(err => { setModels([]); setError('فشل في تحميل الموديلات'); });
  };

  const handleModelChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);
    if (!model) { setTireResults([]); setVehicleData(null); return; }

    setLoading(true); setTireResults([]); setVehicleData(null); setError('');

    const url = `${BASE_URL}/search/by_model/?user_key=${API_KEY}&make=${selectedMake}&model=${model}&year=${selectedYear}&region=${region}`;

    fetch(url)
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then(data => {
        setLoading(false);
        const resultData = Array.isArray(data) ? data : (data.data || []);
        if (resultData.length === 0) { setError('لا توجد نتائج'); return; }

        const vehicle = resultData[0];
        console.log('vehicle resultData[0]:', resultData[0])
        // ✅ حفظ بيانات السيارة
        setVehicleData({
          name: vehicle.name,
          make: vehicle.make?.name,
          model: vehicle.model?.name,
          generation: vehicle.generation?.name,
          startYear: vehicle.start_year,
          endYear: vehicle.end_year,
          engine: vehicle.engine,
          bodyImage: vehicle.generation?.bodies?.[0]?.image,
          tireType: vehicle.tire_type,
          technical: vehicle.technical
        });

        // ✅ جمع كل المقاسات الفريدة
        const allSizes = [];
        if (vehicle.wheels && vehicle.wheels.length > 0) {
          vehicle.wheels.forEach((wheel, index) => {
            if (wheel.front && wheel.front.tire) {
              const exists = allSizes.find(s => s.tire === wheel.front.tire);
              if (!exists) {
                allSizes.push({
                  id: index,
                  tire: wheel.front.tire,
                  full: wheel.front.tire_full,
                  width: wheel.front.tire_width,
                  aspect: wheel.front.tire_aspect_ratio,
                  rim: wheel.front.rim_diameter,
                  loadIndex: wheel.front.load_index,
                  speedIndex: wheel.front.speed_index,
                  pressure: wheel.front.tire_pressure,
                  rimSpec: wheel.front.rim,
                  isStock: wheel.is_stock,
                  // ✅ تفاصيل إضافية للاختلاف
                  tireWeight: wheel.front.tire_weight_kg,
                  tireDiameter: wheel.front.tire_diameter_mm,
                  construction: wheel.front.tire_construction,
                  sizingSystem: wheel.front.tire_sizing_system
                });
              }
            }
          });
        }

        if (allSizes.length > 0) {
          setTireResults(allSizes);

          setTimeout(() => { resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300);
        } else {
          setError('لم يتم العثور على مقاسات');
        }
      })
      .catch(err => { setLoading(false); setError(`خطأ: ${err.message}`); });
  };

  const regionNames = { 'medm': 'الشرق الأوسط', 'usdm': 'أمريكا وكندا', 'eudm': 'أوروبا', 'jdm': 'اليابان' };

  return (
    <Container fluid className="p-0 min-h-screen bg-[#0a0a0a]" dir="rtl">

      <nav className="bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl bg-opacity-90">
        <Container>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push('/')}>
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center"><Gauge className="w-5 h-5 text-white" /></div>
              <span className="text-white font-bold text-sm hidden sm:block">امباير تايراتي</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => router.push('/')} className="px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer">
                <Search className="w-4 h-4" /><span className="hidden sm:inline">اختر بالمقاس</span>
              </button>
              <button className="px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 bg-orange-600 text-white shadow-lg shadow-orange-600/25">
                <Car className="w-4 h-4" /><span className="hidden sm:inline">Tire Finder</span><Sparkles className="w-3 h-3 text-yellow-400" />
              </button>
            </div>
          </div>
        </Container>
      </nav>

      <div className="relative overflow-hidden bg-[#0a0a0a] py-12 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-600/5 to-transparent" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-600/20 border border-orange-500/30 px-4 py-2 rounded-full mb-6">
            <Car className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-xs font-bold tracking-wide">Tire Finder</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
            اعرف مقاس <span className="text-orange-500">إطار سيارتك</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed mb-8">
            اختر سيارتك وسنعرض لك كل المقاسات المتاحة مع تفاصيلها
          </p>
          <div className="max-w-md mx-auto mb-2">
            <div className="flex justify-between text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-wider">
              <span className={region ? 'text-orange-400' : ''}>المنطقة</span>
              <span className={selectedMake ? 'text-orange-400' : ''}>الماركة</span>
              <span className={selectedYear ? 'text-orange-400' : ''}>السنة</span>
              <span className={selectedModel ? 'text-orange-400' : ''}>الموديل</span>
              <span className={tireResults.length > 0 ? 'text-orange-400' : ''}>النتيجة</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-orange-600 rounded-full transition-all duration-700 ease-out" style={{ width: `${getProgress()}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0a0a0a] px-4 pb-12">
        <div className="max-w-6xl mx-auto">

          {error && (
            <div className="mb-6 bg-red-600/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Form Steps */}
          <div className="max-w-xl mx-auto">
            <div className="mb-6">
              <label className="flex items-center gap-2 text-white font-bold mb-3">
                <span className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-sm font-black">1</span>
                <MapPin className="w-4 h-4 text-orange-400" />المنطقة الجغرافية
              </label>
              <div className="relative group/select">
                <div className="absolute -inset-1 bg-orange-600/10 rounded-2xl blur-xl opacity-0 group-hover/select:opacity-100 transition duration-500" />
                <select value={region} onChange={(e) => setRegion(e.target.value)}
                  className="relative w-full bg-white/5 backdrop-blur-xl border-2 border-white/10 text-white text-right pr-12 pl-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-500 appearance-none cursor-pointer hover:bg-white/10 hover:border-white/20 font-bold shadow-xl"
                  style={{ backgroundColor: '#121212' }}>
                  <option value="medm" className="bg-[#1a1a1a] text-white">الشرق الأوسط (MEDM)</option>
                  <option value="usdm" className="bg-[#1a1a1a] text-white">أمريكا وكندا (USDM)</option>
                  <option value="eudm" className="bg-[#1a1a1a] text-white">أوروبا (EUDM)</option>
                  <option value="jdm" className="bg-[#1a1a1a] text-white">اليابان (JDM)</option>
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-8 h-8 bg-orange-600/10 rounded-lg flex items-center justify-center"><ChevronDown className="w-4 h-4 text-orange-500" /></div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 text-white font-bold mb-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${selectedMake ? 'bg-orange-600' : 'bg-white/10'}`}>2</span>
                <Building2 className="w-4 h-4 text-orange-400" />الشركة المصنعة
              </label>
              <div className="relative group/select">
                <div className="absolute -inset-1 bg-orange-600/10 rounded-2xl blur-xl opacity-0 group-hover/select:opacity-100 transition duration-500" />
                <select value={selectedMake} onChange={handleMakeChange} disabled={makes.length === 0}
                  className="relative w-full bg-white/5 backdrop-blur-xl border-2 border-white/10 text-white text-right pr-12 pl-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-500 appearance-none cursor-pointer hover:bg-white/10 hover:border-white/20 font-bold shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#121212' }}>
                  <option value="" className="bg-[#1a1a1a] text-gray-500">{makes.length === 0 ? 'جاري التحميل...' : 'اختر الماركة...'}</option>
                  {makes.map(item => (<option key={item.slug} value={item.slug} className="bg-[#1a1a1a] text-white">{item.name}</option>))}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-8 h-8 bg-orange-600/10 rounded-lg flex items-center justify-center"><ChevronDown className="w-4 h-4 text-orange-500" /></div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 text-white font-bold mb-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${selectedYear ? 'bg-orange-600' : 'bg-white/10'}`}>3</span>
                <Calendar className="w-4 h-4 text-orange-400" />سنة الصنع
              </label>
              <div className="relative group/select">
                <div className="absolute -inset-1 bg-orange-600/10 rounded-2xl blur-xl opacity-0 group-hover/select:opacity-100 transition duration-500" />
                <select value={selectedYear} onChange={handleYearChange} disabled={years.length === 0}
                  className="relative w-full bg-white/5 backdrop-blur-xl border-2 border-white/10 text-white text-right pr-12 pl-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-500 appearance-none cursor-pointer hover:bg-white/10 hover:border-white/20 font-bold shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#121212' }}>
                  <option value="" className="bg-[#1a1a1a] text-gray-500">{selectedMake ? 'اختر السنة...' : 'اختر الماركة أولاً'}</option>
                  {years.map(item => (<option key={item.slug} value={item.slug} className="bg-[#1a1a1a] text-white">{item.name}</option>))}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-8 h-8 bg-orange-600/10 rounded-lg flex items-center justify-center"><ChevronDown className="w-4 h-4 text-orange-500" /></div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="flex items-center gap-2 text-white font-bold mb-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${selectedModel ? 'bg-orange-600' : 'bg-white/10'}`}>4</span>
                <Tag className="w-4 h-4 text-orange-400" />موديل السيارة
              </label>
              <div className="relative group/select">
                <div className="absolute -inset-1 bg-orange-600/10 rounded-2xl blur-xl opacity-0 group-hover/select:opacity-100 transition duration-500" />
                <select value={selectedModel} onChange={handleModelChange} disabled={models.length === 0}
                  className="relative w-full bg-white/5 backdrop-blur-xl border-2 border-white/10 text-white text-right pr-12 pl-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-500 appearance-none cursor-pointer hover:bg-white/10 hover:border-white/20 font-bold shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#121212' }}>
                  <option value="" className="bg-[#1a1a1a] text-gray-500">{selectedYear ? 'اختر الموديل...' : 'اختر السنة أولاً'}</option>
                  {models.map(item => (<option key={item.slug} value={item.slug} className="bg-[#1a1a1a] text-white">{item.name}</option>))}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-8 h-8 bg-orange-600/10 rounded-lg flex items-center justify-center"><ChevronDown className="w-4 h-4 text-orange-500" /></div>
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <div className="mb-6 flex items-center justify-center gap-3 py-8">
              <Spinner animation="border" variant="warning" size="sm" />
              <span className="text-orange-400 text-sm font-bold">جاري جلب البيانات...</span>
            </div>
          )}

          {/* ✅ Vehicle Info + Results */}
          {vehicleData && tireResults.length > 0 && (
            <div ref={resultRef} className="animate-fade-in">

              {/* Vehicle Header Card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 mb-6">
                <Row className="align-items-center">
                  {/* Car Image */}
                  <Col xs={12} md={4} className="mb-4 md:mb-0">
                    {vehicleData.bodyImage ? (
   <div className="flex justify-center">
  <div className="relative rounded-xl overflow-hidden bg-white/5 aspect-video w-full max-w-[600px]">
    <Image 
      src={vehicleData.bodyImage} 
      alt={`${vehicleData.make} ${vehicleData.model}`}
      fill
      className="object-cover"
      sizes="600px"
    />
  </div>
</div>
                    ) : (
                      <div className="rounded-xl bg-white/5 aspect-video flex items-center justify-center">
                        <Car className="w-16 h-16 text-gray-600" />
                      </div>
                    )}
                  </Col>

                  {/* Vehicle Details */}
                  <Col xs={12} md={8}>
                    <div className="text-right">
                      <h2 className="text-xl md:text-2xl font-black text-white mb-2">
                        {vehicleData.make} {vehicleData.model}
                      </h2>
                      <p className="text-orange-400 text-sm font-bold mb-3">
                        {vehicleData.generation} | {vehicleData.startYear}-{vehicleData.endYear}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                     {vehicleData.engine && (
                          <Badge bg="dark" className="bg-white/10 text-gray-300 border border-white/10 px-3 py-2">
                            <Fuel className="w-3 h-3 inline mr-1" />
                            {vehicleData.engine.fuel} {vehicleData.engine.capacity}L
                          </Badge>
                        )}
                        {vehicleData.engine?.power && (
                          <Badge bg="dark" className="bg-white/10 text-gray-300 border border-white/10 px-3 py-2">
                            <GaugeIcon className="w-3 h-3 inline mr-1" />
                            {vehicleData.engine.power.hp} HP
                          </Badge>
                        )}
                        <Badge bg="dark" className="bg-white/10 text-gray-300 border border-white/10 px-3 py-2">
                          <Car className="w-3 h-3 inline mr-1" />
                          {vehicleData.tireType || 'SUV'}
                        </Badge>
                      </div>

                      {vehicleData.technical && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div className="bg-white/5 rounded-lg p-2 text-center">
                            <p className="text-gray-500 text-[9px]">Bolt Pattern</p>
                            <p className="text-white text-xs font-bold">{vehicleData.technical.bolt_pattern}</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2 text-center">
                            <p className="text-gray-500 text-[9px]">PCD</p>
                            <p className="text-white text-xs font-bold">{vehicleData.technical.pcd}</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2 text-center">
                            <p className="text-gray-500 text-[9px]">Centre Bore</p>
                            <p className="text-white text-xs font-bold">{vehicleData.technical.centre_bore}</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2 text-center">
                            <p className="text-gray-500 text-[9px]">Torque</p>
                            <p className="text-white text-xs font-bold">{vehicleData.technical.wheel_tightening_torque}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Results Count */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-green-600/20 border border-green-500/30 px-4 py-2 rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-green-300 text-xs font-bold">
                    تم العثور على {tireResults.length} مقاسات للإطارات
                  </span>
                </div>
              </div>

              {/* Tire Cards - Responsive Grid */}
              <Row className="g-4">
                {tireResults.map((size, index) => (
                  <Col key={size.id} xs={12} md={6} lg={4}>
                    <div className="bg-orange-600/10 border border-orange-500/30 rounded-2xl p-4 md:p-5 h-full relative overflow-hidden hover:bg-orange-600/15 transition-all duration-300">
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-600/10 rounded-full blur-2xl" />

                      <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-orange-600/20 rounded-lg flex items-center justify-center">
                              <span className="text-orange-400 text-xs font-black">{index + 1}</span>
                            </div>
                            <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider">مقاس {index + 1}</span>
                          </div>
                          {size.isStock && (
                            <Badge bg="success" className="bg-green-600/20 text-green-400 border border-green-500/30 text-[10px]">
                              <Star className="w-2.5 h-2.5 inline mr-1" />الأساسي
                            </Badge>
                          )}
                        </div>

                        {/* Tire Size */}
                        <div className="bg-[#1a1a1a] border border-orange-500/30 rounded-xl p-3 mb-3 text-center">
                          <p className="text-white text-xl md:text-2xl font-black tracking-wider">{size.tire}</p>
                          <p className="text-gray-500 text-[10px] mt-1">{size.full}</p>
                        </div>

                        {/* Why Different? */}
                        <div className="mb-3">
                          <p className="text-gray-400 text-[10px] font-bold mb-2">تفاصيل المواصفات:</p>
                          <div className="space-y-1">
                            {size.rimSpec && (
                              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                <Ruler className="w-3 h-3 text-orange-400" />
                                <span>rim رنج: {size.rimSpec} </span>
                              </div>
                            )}
                            {size.tireDiameter && (
                              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                <Circle className="w-3 h-3 text-orange-400" />
                                <span>قطر الإطار: {size.tireDiameter}mm</span>
                              </div>
                            )}
                            {size.tireWeight && (
                              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                <Weight className="w-3 h-3 text-orange-400" />
                                <span>وزن: {size.tireWeight}kg</span>
                              </div>
                            )}
                            {size.construction && (
                              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                <Wind className="w-3 h-3 text-orange-400" />
                                <span>البناء: {size.construction} ({size.sizingSystem})</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-white/5 rounded-lg p-2 text-center">
                            <p className="text-gray-500 text-[8px]">العرض</p>
                            <p className="text-white text-xs font-bold">{size.width}mm</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2 text-center">
                            <p className="text-gray-500 text-[8px]">الارتفاع aspect</p>
                            <p className="text-white text-xs font-bold">{size.aspect}%</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2 text-center">
                            <p className="text-gray-500 text-[8px]">الرنج rim</p>
                            <p className="text-white text-xs font-bold">{size.rim}"</p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2 text-center">
                            <p className="text-gray-500 text-[8px]">السرعة</p>
                            <p className="text-white text-xs font-bold">{size.speedIndex}</p>
                          </div>
                        </div>

                        {size.pressure && (
                          <div className="bg-white/5 rounded-lg p-2 mb-3 text-center">
                            <p className="text-gray-500 text-[8px] mb-1">ضغط الإطار</p>
                            <p className="text-white text-[10px] font-bold">{size.pressure.bar} بار ({size.pressure.psi} PSI)</p>
                          </div>
                        )}

                        <div className="text-center">
                           <Button 
                            className="bg-orange-600 hover:bg-orange-500 border-0 rounded-xl font-bold px-4 py-2 shadow-lg shadow-orange-600/30 transition-all duration-300 hover:scale-105 w-100"
                            onClick={() => router.push(`/?tireSize=${encodeURIComponent(size.tire)}`)}>
                               <span className="flex items-center justify-center gap-2 text-xs">
                              ابحث عن هذا المقاس
                              <ArrowLeft className="w-3 h-3" />
                            </span>
                            </Button>
                  
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {!tireResults.length && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-xl mx-auto">
              {[
                { icon: Search, title: 'أين أجد المقاس؟', desc: 'ابحث على جانب الإطار، ستجد أرقام مثل 205/55 R16' },
                { icon: Info, title: 'مقاسات مختلفة', desc: 'بعض السيارات تأتي بمقاسات أمامية وخلفية مختلفة' },
                { icon: Car, title: 'استشر خبير', desc: 'غير متأكد؟ تواصل معنا للحصول على استشارة مجانية' }
              ].map((tip, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-300">
                  <tip.icon className="w-5 h-5 text-orange-400 mx-auto mb-2" />
                  <h4 className="text-white text-xs font-bold mb-1">{tip.title}</h4>
                  <p className="text-gray-500 text-[10px] leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      <div className="bg-[#0a0a0a] border-t border-white/5 py-8 px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 opacity-40">
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/30" />
            <p className="text-white text-[8px] uppercase tracking-[0.3em] font-black">امباير تايراتي — الجودة تبدأ من الإطار</p>
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/30" />
          </div>
        </div>
      </div>

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
  );
};

export default TireFinder;