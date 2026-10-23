import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { Truck, Store, MapPin, Search, ChevronRight, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation'

import Select from 'react-select';
import Swal from 'sweetalert2';
import TawseelInformationCustomer from './TawseelInformationCustomer';

const InstallationChoice = ({ orderId, customerCityId, customerCityName, customerphone, custName }) => {
    const router = useRouter()
    const [cities, setCities] = useState([]); 
    const [selectedCityName, setSelectedCityName] = useState(customerCityName);
    const [selectedCityId, setSelectedCityId] = useState(customerCityId || null);
    const [installations, setInstallations] = useState([]);
    const [choice, setChoice] = useState(null); 
    const [selectedInstallationTypeId, setSelectedInstallationTypeId] = useState(null);
    const [centers, setCenters] = useState([]);
    const [selectedCenterId, setSelectedCenterId] = useState(null);
    const [userLocationUrl, setUserLocationUrl] = useState('');
    const [addressText, setAddressText] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingCenters, setFetchingCenters] = useState(false);

    const isLOCALHOST = process.env.NEXT_PUBLIC_ISLOCALHOST === 'false';
    const server = isLOCALHOST ? 'http://localhost:5000' : process.env.NEXT_PUBLIC_API_URL;

        const { orderBasketlist, lastOrderDetails, product_id,amount, } = useSelector((state) => state.basket);
    console.log('lastOrderDetails in InstallationChoice:',lastOrderDetails)


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
                console.log('formattedCities', formattedCities)
            } catch (err) { console.error("خطأ في جلب المدن", err); }
        };
        fetchCities();
    }, [server]);

    useEffect(() => {
        const fetchInstallations = async () => {
            try {
                const res = await axios.get(`${server}/api/installations`);
                setInstallations(res.data);
            } catch (err) { console.error("خطأ في جلب طرق التوصيل", err); }
        };
        fetchInstallations();
    }, [server]);

    useEffect(() => {
        if (selectedCityId && choice === 'مركز خدمة معتمد') {
            const fetchCenters = async () => {
                setFetchingCenters(true);
                try {
                    const res = await axios.get(`${server}/api/service-centers/${selectedCityId}`);
                    setCenters(res.data);
                } catch (err) { setCenters([]); }
                finally { setFetchingCenters(false); }
            };
            fetchCenters();
        } 
    }, [selectedCityId, choice, server]);

    const isFormValid = Boolean(selectedCenterId && selectedCityId);

    const orderDetails = {
    date: Date.now(),
    status: "قيد التجهيز",
    customer: {
        name: custName,
        custphonumber: customerphone 
    },
   
    brandname: lastOrderDetails?.items[0]?.brandName, 
    brandnamear: lastOrderDetails?.items[0]?.brandNameAr,
    COO: lastOrderDetails?.items[0].COO, 
    productname: lastOrderDetails?.items[0]?.productName, 
    quantity: lastOrderDetails?.quantity, 
    tiresize: lastOrderDetails?.tiresize
};

    const handleConfirm = async () => { 
        if (!selectedCityId) return Swal.fire("تنبيه", "يرجى تحديد المدينة أولاً", "warning");
        if (choice === 'مركز خدمة معتمد' && !selectedCenterId) return Swal.fire("تنبيه", "يرجى اختيار مركز خدمة معتمد", "warning");
        
        setLoading(true);
        try {
            await axios.post(`${server}/api/update-delivery-choice`, {
                city_id: selectedCityId,
                installation_type_id: selectedInstallationTypeId,
                service_center_id: selectedCenterId, 
                orderId: orderId,
                ordersdetail: orderDetails,
                customerphone: customerphone
            });

            Swal.fire({
                title: "تم اعتماد طلبك",
                text: "سيقوم فريق تيراتي بالتواصل معك لتأكيد الموعد",
                icon: "success",
                confirmButtonColor: "#B85A45"
            });
            router.push('/ShoppingCart');
        } catch (err) {
            Swal.fire("خطأ", "فشل في حفظ البيانات", "error");
        } finally { setLoading(false); }
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: '#111',
            borderColor: 'rgba(255,255,255,0.1)',
            padding: '8px',
            borderRadius: '15px',
            color: '#fff',
            boxShadow: 'none',
            '&:hover': { borderColor: '#B85A45' }
        }),
        menu: (provided) => ({ ...provided, backgroundColor: '#1a1a1a', borderRadius: '15px', overflow: 'hidden' }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#B85A45' : 'transparent',
            color: '#fff',
            padding: '12px'
        }),
        singleValue: (provided) => ({ ...provided, color: '#fff' }),
        input: (provided) => ({ ...provided, color: '#fff' }),
    };

    return (
        <Container className="py-5" dir="rtl" style={{ maxWidth: '900px' }}>
            <div className="mb-5 text-center">
                <Badge bg="none" className="mb-3 px-3 py-2 border border-white/10 text-white/50 rounded-pill">
                    طلب رقم: #{orderId}
                </Badge>
                <h2 className="display-6 fw-black text-white">كيف ترغب باستلام إطاراتك؟</h2>
                <p className="text-gray-400">اختر الطريقة الأنسب لك لضمان أفضل خدمة تركيب</p>
            </div>

            {/* المرحلة الأولى: اختيار النوع */}
            {!selectedInstallationTypeId ? (
                <Row className="g-4 animate-fade-in">
                    {installations.map((item) => (
                        <Col md={6} key={item.type_id}>
                            <Card 
                                onClick={() => {
                                    setChoice(item.type_name_ar);
                                    setSelectedInstallationTypeId(item.type_id);
                                }}
                                className="h-100 bg-[#151515] border-white/5 hover:border-[#B85A45]/50 transition-all cursor-pointer group rounded-4"
                            >
                                <Card.Body className="p-4 text-center">
                                    <div className="mb-3 d-inline-flex p-3 bg-white/5 rounded-circle group-hover:bg-[#B85A45]/20 transition-all text-[#B85A45]">
                                        {item.type_name_ar === 'مركز خدمة معتمد' ? <Store size={40} /> : <Truck size={40} />}
                                    </div>
                                    <h4 className="text-white fw-bold mb-2">{item.type_name_ar}</h4>
                                    <p className="text-gray-500 small px-3">{item.type_description}</p>
                                    <div className="mt-3 text-[#B85A45] opacity-0 group-hover:opacity-100 transition-all">
                                        <ArrowRight size={20} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                /* المرحلة الثانية: تفاصيل الاختيار */
                <Card className="bg-[#151515] border-white/5 rounded-4 overflow-hidden animate-fade-in">
                    <div className="p-3 bg-white/5 d-flex justify-content-between align-items-center border-b border-white/5">
                        <div className="d-flex align-items-center gap-2">
                            <CheckCircle2 size={18} className="text-[#B85A45]" />
                            <span className="text-white fw-bold">الطريقة المختارة: {choice}</span>
                        </div>
                        <Button 
                            variant="link" 
                            className="text-gray-500 text-decoration-none hover:text-white"
                            onClick={() => {
                                setSelectedInstallationTypeId(null);
                                setChoice(null);
                                setSelectedCityId(null);
                            }}
                        >
                            تغيير الطريقة
                        </Button>
                    </div>

                    <Card.Body className="p-4 p-md-5">
                        {choice === 'توصيل الى اقرب مركز لك' ? (
                            <TawseelInformationCustomer 
                                orderId={orderId} 
                                selectedInstallationTypeId={selectedInstallationTypeId} 
                                choice={choice} 
                                customerphone={customerphone} 
                            />
                        ) : (
                            <div className="space-y-4">
                                {/* اختيار المدينة */}
                                <Form.Group className="mb-4">
                                    <Form.Label className="text-gray-400 small mb-2 d-block">1. حدد مدينة التوصيل</Form.Label>
                                    <Select 
                                        options={cities}
                                        styles={customStyles}
                                        placeholder="ابحث عن مدينتك..."
                                        isRtl={true}
                                        onChange={(opt) => {
                                            setSelectedCityName(opt.value);
                                            setSelectedCityId(opt.id);
                                        }}
                                    />
                                </Form.Group>

                                {/* اختيار المركز */}
                                {selectedCityId && (
                                    <div className="animate-fade-in mt-4">
                                        <Form.Label className="text-gray-400 small mb-2 d-block">2. اختر مركز الخدمة الأقرب لك</Form.Label>
                                        {fetchingCenters ? (
                                            <div className="p-4 text-center bg-white/5 rounded-3">
                                                <div className="spinner-border spinner-border-sm text-[#B85A45]" role="status"></div>
                                                <span className="ms-2 text-white/50">جاري البحث عن المراكز...</span>
                                            </div>
                                        ) : centers.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-3">
                                                {centers.map(center => (
                                                    <div 
                                                        key={center.center_id}
                                                        onClick={() => setSelectedCenterId(center.center_id)}
                                                        className={`p-3 rounded-4 border-2 transition-all cursor-pointer d-flex align-items-center justify-content-between ${selectedCenterId === center.center_id ? 'border-[#B85A45] bg-[#B85A45]/10' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
                                                    >
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className={`p-2 rounded-lg ${selectedCenterId === center.center_id ? 'bg-[#B85A45] text-white' : 'bg-white/5 text-gray-500'}`}>
                                                                <MapPin size={18} />
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-white fw-bold">{center.center_name_ar}</div>
                                                                <div className="text-gray-500 small">{center.address_details}</div>
                                                            </div>
                                                        </div>
                                                        {selectedCenterId === center.center_id && <CheckCircle2 size={20} className="text-[#B85A45]" />}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 rounded-4 bg-orange-500/10 border border-orange-500/20 text-orange-200 d-flex gap-3">
                                                <AlertCircle className="shrink-0" />
                                                <p className="mb-0 small">عذراً، لا تتوفر مراكز معتمدة في {selectedCityName} حالياً. يرجى اختيار "التركيب المتنقل" من القائمة السابقة.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* زر التأكيد النهائي */}
                                <div className="mt-5 border-t border-white/5 pt-4">
                                    <Button 
                                        onClick={handleConfirm}
                                        disabled={!isFormValid || loading}
                                        className={`w-100 py-3 rounded-3 fw-black text-uppercase tracking-wide transition-all ${isFormValid ? 'bg-[#B85A45] border-0 shadow-lg' : 'bg-white/5 border-white/10 text-gray-600'}`}
                                    >
                                        {loading ? 'جاري الحفظ...' : 'تأكيد وحفظ الاختيارات'}
                                    </Button>
                                    {!isFormValid && (
                                        <p className="text-center text-gray-600 mt-3 small italic">
                                            <AlertCircle size={12} className="me-1" />
                                            يجب إكمال الخطوات أعلاه لتتمكن من المتابعة
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default InstallationChoice;