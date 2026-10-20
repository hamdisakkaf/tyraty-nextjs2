import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import io from "socket.io-client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Bootstrap Components
import { 
  Container, Row, Col, Button, Badge, Table, Form, Card, Stack, Alert, Spinner 
} from 'react-bootstrap';
import { X } from 'lucide-react';
import { Modal } from 'react-bootstrap';
// Redux Actions
import { 
  addToOrder, 
  exportOrder,
  updateOrderStatues, 
  fetchBrands, 
  fetchAgents, 
  fetchproductquantityInStore 
} from '../../redux/slices/basketSlice';
import { ShieldLock, PersonPlus, BoxArrowInRight, Telephone, Lock } from 'react-bootstrap-icons';

import '../../App.css';

// --- Configuration ---
const isLocalhostEnabled = process.env.REACT_APP_ISLOCALHOST === 'true';
// 2. استخدام متغيرات البيئة للرابطين (مع قيمة احتياطية للوكل هوست)
const localhost = process.env.REACT_APP_LOCAL_API_URL || 'http://localhost:5000';
// 3. إضافة قيمة احتياطية للسيرفر البعيد لتجنب الـ undefined
const remoteServer = process.env.REACT_APP_API_URL || 'https://server.tyraty.com';
// اختيار السيرفر
const server = isLocalhostEnabled ? localhost : remoteServer;

// --- Sub-Component: Request Row ---
const RequestRow = ({ val, brandLogos, localagent, onCheckStock, onProcessOrder, server }) => {

  const [approvedQty, setApprovedQty] = useState('');
  // حالة لتخزين رقم هاتف مندوب المبيعات/التوصيل داخل المودال
  const [deliveryPhone, setDeliveryPhone] = useState('');

  const {
    rci_id, CustomerName,
    SCustID, customers_SCustID, tiresize, itemNo, 
    quantity, purchaseordercircle, AMOUNT, 
    invoiceDate, brands_brand_id,
    pay_point_Name,
    payPointLocation,
    installation_types_type_id,
    type_name_ar,
    service_fee,
    center_name_ar,
    address_details,
    contact_number,
    installation_map_url
  } = val;

  const agentsList = localagent?.flat() || [];
  const brandsList = brandLogos?.flat() || [];
  const currentBrand = brandsList.find(b => String(b.brand_id) === String(brands_brand_id));
  const currentAgent = agentsList.find(a => String(a.agentid) === String(currentBrand?.agents_agentid));

  // 1. دالة إرسال الطلب الأساسية للوكيل (بقيت كما هي دون تغيير) 🏢
  const handleWhatsAppOrder = () => {
    const phone = currentAgent?.saleswatsappphone;
    if (!phone) {
      alert("رقم الواتساب غير متوفر لهذا الوكيل.");
      return;
    }
    const message = `*طلب جديد من تايراتي*%0A` +
                    `*رقم الفاتورة:* ${val.rci_id}%0A` +
                    `*الماركة:* ${currentBrand?.brandNameAr || 'غير محدد'}%0A` +
                    `*المقاس:* ${val.tiresize}%0A` +
                    `*الكمية:* ${val.quantity}`;

    const finalPhone = phone.startsWith('7') ? `967${phone}` : phone;
    window.open(`https://wa.me/${finalPhone}?text=${message}`, '_blank');
  };

  // 2. الدالة الجديدة المخصصة لإرسال موقع العميل وتفاصيله لمندوب المبيعات/التوصيل فقط 🚚📍
  const handleSendToDeliveryRep = (e) => {
    if (e) e.preventDefault();

    if (!deliveryPhone) {
      alert("الرجاء إدخال رقم هاتف مندوب المبيعات أولاً.");
      return;
    }

    // تجهيز نص الرسالة الخاص بالمندوب (يحتوي على اسم العميل ورابط الموقع بدقة)
    const message = `*بيانات توصيل طلب من تايراتي* 📍%0A%0A` +
                    `*رقم الطلب:* ${rci_id}%0A` +
                    `*اسم العميل:* ${CustomerName || 'غير معروف'}%0A` +
                    `*نوع الخدمة:* ${type_name_ar || 'غير محدد'}%0A` +
                    `*المقاس:* ${tiresize}%0A` +
                    `*الكمية:* ${quantity}%0A` +
                    `*رابط الموقع الجغرافي (Google Maps):* ${installation_map_url || 'لم يحدد العميل موقعه عبر الـ GPS'}`;

    // تهيئة الرقم بكود اليمن 967
    const finalPhone = deliveryPhone.startsWith('7') ? `967${deliveryPhone}` : deliveryPhone;
    window.open(`https://wa.me/${finalPhone}?text=${message}`, '_blank');
  };
  
  const [showModal, setShowPrompt] = useState(false);

  return (
    <>
      <tr className="align-middle text-dark">
        <td><Badge bg="secondary">#{rci_id}</Badge></td>
        <td className="p-3 text-black fw-bold" style={{ minWidth: '150px' }}>
          <div className="d-flex flex-column">
            <span>{customers_SCustID + ' ' + CustomerName || 'عميل غير معروف'}</span>
            <small className="text-muted" style={{ fontSize: '0.7rem' }}>{SCustID}</small>
          </div>
        </td>
        <td>
          <div className="d-flex align-items-center gap-2 text-dark">
            {currentBrand ? (
              <>
                {currentBrand.brandLogo && (
                  <img src={currentBrand.brandLogo} alt="" style={{ width: '35px' }} />
                )}
                <div className="d-flex flex-column">
                  <span className="fw-bold small">{currentBrand.brandNameAr}</span>
                  {currentAgent ? (
                    <div className="d-flex align-items-center gap-1 mt-1">
                      <Badge bg="info" text="dark" style={{ fontSize: '0.65rem' }}>
                        الوكيل: {currentAgent.agentARname}
                      </Badge>
                      <Button 
                        variant="success" 
                        size="sm" 
                        className="p-0 px-1 border-0" 
                        onClick={handleWhatsAppOrder}
                      >إرسال 
                        <i className="bi bi-whatsapp"></i>
                      </Button>
                    </div>
                  ) : (
                    <small className="text-danger" style={{ fontSize: '0.6rem' }}>الوكيل غير مربوط</small>
                  )}
                </div>
              </>
            ) : (
              <Badge bg="light">ماركة غير معرفة</Badge>
            )}
          </div>
        </td>
        <td className="p-3 text-dark">
          <div className="d-flex flex-column">
            <span className="fw-semibold">{pay_point_Name}</span>
            <small className="text-muted small">{payPointLocation}</small>
          </div>
        </td>
        <td className="p-3 text-dark">
          <div className="d-flex align-items-center gap-2 text-dark">
            <span>{installation_types_type_id + ' ' + type_name_ar }</span>
            <small className="text-muted" style={{ fontSize: '0.7rem' }}>{service_fee}</small> 
            <small className="text-muted" style={{ fontSize: '0.7rem' }}>{center_name_ar} {address_details}  {contact_number}</small> 
            <Button onClick={()=> setShowPrompt(true)} variant="primary" size="sm">
                  استعلام
            </Button>
          </div>
        </td>
        <td className="p-3 text-dark font-monospace">{val.tiresize}</td>
        <td className="p-3 text-center fw-bold text-primary">{val.quantity}</td>
        <td className="p-3 text-dark fw-semibold">{Number(val.AMOUNT).toLocaleString()}</td>
        <td className="p-3 text-success fw-bold">{(val.AMOUNT * val.quantity).toLocaleString()}</td>
        <td className='text-black'><small>{invoiceDate}</small></td>
        <td className="p-3" style={{ minWidth: '180px' }}>
          <div className="d-flex flex-column gap-2">
            <Form.Control 
               size="sm" type="number" placeholder="الكمية" className="text-center border-secondary text-dark" 
               style={{ backgroundColor: '#f8f9fa' }}
            />
            <div className="d-flex gap-1">
              <Button variant="outline-primary" size="sm" className="w-50" onClick={() => onCheckStock(val)}>فحص</Button>
              <Button variant="primary" size="sm" className="w-50" onClick={() => onProcessOrder(val)}>إصدار</Button>
            </div>
          </div>
        </td>
      </tr>

      {/* المودال المعدل المخصص لإدخال رقم المندوب وإرسال الموقع له */}
      <Modal 
          show={showModal} 
          onHide={() => setShowPrompt(false)}
          centered
          backdrop="static"
          contentClassName="bg-[#0f0f0f] border border-white/10 rounded-[2rem] overflow-hidden"
      >
          <Modal.Header closeButton closeVariant="white" className="border-b border-white/5 bg-[#151515]">
              <Modal.Title className="text-white font-bold w-100 text-center">طريقة التوصيل والموقع</Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-6" dir="rtl">
              <div className="text-center mb-4">
                  <div className="inline-block p-3 rounded-full bg-[#B85A45]/10 mb-2 text-[#B85A45]">
                      <i className="bi bi-geo-alt" style={{ fontSize: '24px' }}></i>
                  </div>
                  <p className="text-white font-semibold text-sm mb-1">طريقة التوصيل: { type_name_ar }</p>
                  <p className="text-gray-400 text-xs">التكلفة على العميل: {service_fee} ريال</p>
                  
                  {/* عرض الرابط الجغرافي الحقيقي للتأكد منه قبل الإرسال */}
                  <div className="mt-3 p-2 bg-white/5 rounded-xl border border-white/5 text-right text-xs">
                    <span className="text-gray-400">📍 رابط موقع العميل: </span>
                    {installation_map_url ? (
                      <a href={installation_map_url} target="_blank" rel="noreferrer" className="text-info break-all d-block mt-1">
                        {installation_map_url}
                      </a>
                    ) : (
                      <span className="text-warning italic d-block mt-1">لم يتم التقاط إحداثيات GPS لهذا الطلب</span>
                    )}
                  </div>
              </div>

              {/* فورم الإرسال إلى المندوب */}
              <Form onSubmit={handleSendToDeliveryRep}>
                  <Form.Group className="mb-4">
                      <Form.Label className="text-gray-300 text-xs font-bold">رقم هاتف مندوب المبيعات / التوصيل</Form.Label>
                      <div className="relative">
                          <Form.Control 
                            required 
                            type="tel" 
                            placeholder="77x xxx xxx" 
                            className="bg-black border-white/10 text-white rounded-xl py-3 text-center font-bold" 
                            style={{ direction: 'ltr' }}
                            value={deliveryPhone}
                            onChange={(e) => setDeliveryPhone(e.target.value)}
                          />
                      </div>
                  </Form.Group>

                  <Button type="submit" className="w-100 bg-[#B85A45] border-0 py-3 rounded-xl font-bold mb-3 shadow-lg flex align-items-center justify-content-center gap-2">
                     إرسال تفاصيل الموقع للمندوب عبر الواتساب
                     <i className="bi bi-whatsapp"></i>
                  </Button>
              </Form>

              <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="mx-4 text-gray-500 text-[10px]">أو</span>
                  <div className="flex-grow border-t border-white/10"></div>
              </div>

              <Button className="w-100 bg-white/5 border-white/5 text-gray-300 py-3 rounded-xl mt-2 text-sm" onClick={() => window.print()}>
                  طباعة
              </Button>
          </Modal.Body>
      </Modal>
    </>
  );
};

const notificationSound = new Audio("sounds/ding.mp3");
const socket = io.connect("https://server.tyraty.com");

// --- Main Component ---
const CustomersRetailRequests = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getCustomerInfo = useSelector((state) => state.CustomerAccount);
  const { SignIn, CustomerToken, statusLogin, errorLogin, CustomerEmail, phoneNumber } = getCustomerInfo;

  const { userToken, adminEmail, branchName, storeAddress, SignInAdmin } = useSelector((state) => state.AdminAccount);
  const { localagents, orderBasketlist, productQuantityInStore } = useSelector((state) => state.basket);
  const [notifications, setNotifications] = useState([]);

  // دالة إشعار سطح المكتب
  const displayDesktopNotification = (message) => {
    console.log("حالة الإذن الحالية:", Notification.permission);

    if (!("Notification" in window)) {
        alert("هذا المتصفح لا يدعم إشعارات سطح المكتب");
    } 
    else if (Notification.permission === "granted") {
        const notify = new Notification("طلب شراء جديد 🛒", {
            body: message,
            icon: "/logo_tyrate.svg",
        });
        
        notify.onclick = () => {
            window.focus();
        };
        if ("vibrate" in navigator) {
            navigator.vibrate(500);
        }
    } 
    else {
        console.log("الإذن مرفوض أو لم يتم طلبه بعد");
    }
  };

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }

    socket.on("receive_order_notification", (data) => {
      notificationSound.play().catch(error => {
        console.log("فشل تشغيل الصوت بسبب سياسة المتصفح: ", error);
      });
      console.log("إشعار جديد:", data);
      toast.success(data.message, {
        position: "top-right",
        autoClose: 5000,
      });
      displayDesktopNotification(data.message);
      setNotifications((list) => [data, ...list]);
    });

    return () => {
      socket.off("receive_order_notification");
    };
  }, []);
  
  const [requestsList, setRequestsList] = useState([]);
  const [brandLogos, setBrandLogos] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({ usd: 0, sar: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!SignInAdmin) navigate('/adminlogin');
  }, [SignInAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
       dispatch(fetchBrands());
       dispatch(fetchAgents());
      await getBrandLogo();
      await fetchRequests();
      await fetchExchangeRates();
    } catch (err) {
      console.error("Error fetching initial data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const getBrandLogo = async () => {
    try {
      const res = await axios.get(`${server}/getbrandLogo`);
      setBrandLogos(res.data);
      console.log("Brands fetched:", res.data);
    } catch (error) {
      console.error("Error fetching brand logos:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${userToken}` };
      const res = await axios.get(`${server}/fetch-customers-retail-requests`, { headers });
      setRequestsList(res.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const fetchExchangeRates = async () => {
    try {
      const res = await axios.get(`${server}/getexchangeDolar`);
      if (res.data && res.data[0]) {
        setExchangeRates({
          usd: res.data?.[0]?.DolarexchangeRial,
          sar: res.data?.[0]?.KSAxchangeRial
        });
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  };

  const handleCheckStock = (productData) => {
    dispatch(fetchproductquantityInStore(productData));
  };

  const handleProcessOrder = (request, approvedQty) => {
    const finalQty = Number(approvedQty) || request.quantity;
    const updatedList = requestsList.filter(item => item.rci_id !== request.rci_id);
    setRequestsList(updatedList);
    dispatch(updateOrderStatues(request.rci_id));
    dispatch(exportOrder({ ...request, quantity: finalQty }));
  };

  return (
    <div className="bg-light min-vh-100 py-4 text-dark" dir="rtl">
      <Container fluid="lg">
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 text-dark">
          <div>
            <h2 className="fw-bold text-dark">📦 إدارة طلبات التجزئة</h2>
            <p className="text-muted mb-0">
              {branchName} - {storeAddress} | <span className="text-primary">{adminEmail}</span>
            </p>
          </div>
          <Button variant="dark" onClick={() => navigate('/cusomerRequestsys')}>
               Anasayfa / الفاتورة <i className="bi bi-arrow-left"></i>
          </Button>
        </div>

        {/* سجل الإشعارات */}
        <h3>سجل الإشعارات:</h3>
        <ul>
          {notifications.map((notif, index) => (
            <li key={index} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
              <strong>{notif.message}</strong> <br />
              <small>رقم الطلب: {notif.orderId} | الوقت: {new Date(notif.timestamp).toLocaleTimeString()}</small>
            </li>
          ))}
        </ul>

        <ToastContainer />

        <h1>لوحة تحكم الموظفين 👨‍💻</h1>
        <p>حالة الاتصال: <span style={{color: 'green'}}>متصل بالسيرفر لاستقبال الطلبات</span></p>

        {/* Stats */}
        <Row className="mb-4 g-3">
          <Col md={3} xs={6}>
            <Card className="border-success shadow-sm h-100 text-center">
                <Card.Body><h6 className="text-muted">سعر الدولار</h6><h4 className="text-success">{exchangeRates.usd}</h4></Card.Body>
            </Card>
          </Col>
          <Col md={3} xs={6}>
             <Card className="border-success shadow-sm h-100 text-center">
                <Card.Body><h6 className="text-muted">سعر السعودي</h6><h4 className="text-success">{exchangeRates.sar}</h4></Card.Body>
            </Card>
          </Col>
          <Col md={3} xs={6}>
             <Card className="border-warning shadow-sm h-100 text-center">
                <Card.Body><h6 className="text-muted">الطلبات المعلقة</h6><h4 className="text-warning">{requestsList.length}</h4></Card.Body>
            </Card>
          </Col>
          <Col md={3} xs={6}>
             <Card className="border-info shadow-sm h-100 text-center">
                <Card.Body><h6 className="text-muted">المخزون (فحص)</h6><h4 className="text-info">{productQuantityInStore || '-'}</h4></Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-white py-3 border-bottom">
            <h5 className="mb-0 fw-bold text-primary">قائمة الطلبات الواردة</h5>
          </Card.Header>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5 text-dark">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-dark">جاري تحميل البيانات...</p>
              </div>
            ) : (
              <Table responsive hover className="table table-hover align-middle bg-white">
                <thead className="bg-light text-dark border-bottom ">
                  <tr className="text-dark">
                    <th className="py-3 text-dark">#</th>
                    <th className="py-3 text-dark">العميل</th>
                    <th className="py-3 text-dark" style={{minWidth: '220px'}}>تفاصيل المنتج</th>
                    <th className="py-3 text-dark">نقطة البيع</th>
                    <th className="py-3 text-dark">طريقة التوصيل</th>
                    <th className="py-3 text-dark">المقاس</th>
                    <th className="py-3 text-dark">الكمية</th>
                    <th className="py-3 text-dark">سعر الوحدة</th>
                    <th className="py-3 text-dark">الإجمالي</th>
                    <th className="py-3 text-dark">التاريخ</th>
                    <th className="py-3 text-dark">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {requestsList.length > 0 ? (
                    requestsList.map((val) => (
                      <RequestRow 
                        key={val.rci_id}
                        val={val}
                        brandLogos={brandLogos}
                        localagent={localagents}
                        onCheckStock={handleCheckStock}
                        onProcessOrder={handleProcessOrder}
                        server={server}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center py-5 text-muted">
                        لا توجد طلبات جديدة حالياً
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

      </Container>
    </div>
  );
};

export default CustomersRetailRequests;