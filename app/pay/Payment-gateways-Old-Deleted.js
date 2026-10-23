import React,{useEffect, useState} from 'react';
import { alpha, styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
import Switch from '@mui/material/Switch';
import { FormGroup } from 'react-bootstrap';
import { FormControlLabel } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import ModalCashPaymenyWoutLogin from './CashTamkeen/PayByCashGatway';
import MahafathatiPayModal from './MAHAFATHATI/MahafathatiPay';
import KurimiPay from './BankingCards/KurimiPay';
import { PaymentApps } from './PaymentApps';

import PaymentModal from '../moduls/payments/customPaymentModal';

import axios from 'axios';
import cashTamkeen from '../assets/payments/CashTamkeen/cash-tamkeen.webp'
import { yemeniRials } from './methods/paymethods';
import { UserCheck, Wallet, Landmark, Banknote, ShieldCheck } from 'lucide-react';
const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: pink[600],
    '&:hover': {
      backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: pink[600],
  },
}));

const label = { inputProps: { 'aria-label': 'Color switch demo' } };
// 1. تصحيح الاسم
const isLocalhostEnabled = process.env.REACT_APP_ISLOCALHOST === 'false';

// 2. استخدام متغيرات البيئة للرابطين (مع قيمة احتياطية للوكل هوست)
const localhost = process.env.REACT_APP_LOCAL_API_URL || 'http://localhost:5000';

// 3. إضافة قيمة احتياطية للسيرفر البعيد لتجنب الـ undefined
const remoteServer = process.env.REACT_APP_API_URL || 'https://tyraty-server.onrender.com';

// اختيار السيرفر
const server = isLocalhostEnabled ? localhost : remoteServer;

console.log('Current API Server:', server); // مفيد جداً للتأكد أثناء التشغيل

export default function PaymentsGateways({ paypointspaypoint_id,amount,producid,productName,brandid,tiresize,crcy,quantity, paymentdate,total,tireSpec,brand }) {
   
  const navigate = useNavigate();      
  const getAdminInfo = useSelector((state) => state.AdminAccount)
    const { userToken,branchId,branchName, SignInAdmin,adminEmail,statusAdminLogin,permissionAdmin } = getAdminInfo
    const [date, setDate] = useState(new Date());
    const [checked, setChecked] = React.useState(true);
    let [KSAxchangerial, setKSAxchangeRial] = useState(null)
    let [DolarexchangeRial, setDolarexchangeRial] = useState()

  const [showPaymentModal, setShowPaymentModal] = useState(false);

const togglePaymentModal = () => {
    setShowPaymentModal(false); // وظيفتها فقط تحويل الحالة لـ false
  };

   useEffect(() => {
    const getRates = async () => {
        try {
            const res = await yemeniRials();
            setKSAxchangeRial(res.data[0].KSAxchangeRial); // نأخذ السجل الأول مباشرة
            setDolarexchangeRial(res.data[0].DolarexchangeRial)
        } catch (error) {
            console.log(error);
        }
    };
    getRates();
}, []);

    console.log("yemeniRials KSAxchangerial:", KSAxchangerial)
    console.log("yemeniRials DolarexchangeRial:", DolarexchangeRial)
    const [paymentsgatways, setPaymentsgatways]=useState([]);
        useEffect(()=>{
        fetchpaymentsgatways()
        // ✅ الحل: مصفوفة فارغة تعني نفذ الكود مرة واحدة عند بداية التشغيل فقط
      },[])

   const fetchpaymentsgatways = async () => {
        try {
            // ✅ تحسين: استخدام await مباشرة يجعل الكود أنظف وأسهل في القراءة
            const res = await axios.get(`${server}/fetchpaymentsgatways`);
            
            if (res.data) {
                setPaymentsgatways(res.data);
            }
        } catch (error) {
            console.error("Error fetching gateways:", error);
        }
    };

    // ترتيب ظهور بوابات الدفع: المصفوفة: المفضل أولاً، ثم ترتيب مخصص لأسماء الدفع
    // 1. تحديد ترتيب الأولوية (الأقل رقماً يظهر أولاً)

  return (
    <div fluid="md">
            
       <div>
        {/* 1. أولاً: عرض "Cash" فقط (Login) */}
    {paymentsgatways.filter(item => item.PaymentCardName === 'Cash').map(item => (
      <div key={item.paymentcard_id}>
        {/* ضع كود الـ HTML الخاص بـ Cash هنا */}
        {item.activation == 1 && (
           <div className="position-relative w-100">
               {/* 2. أيقونة التاج "المفضل" العائمة فوق الزر */}
      {(item.preferable == 1 || item.preferable == "1") && (
        <div 
          className="position-absolute z-3 flex items-center justify-center animate-pulse"
          style={{ 
            top: '-15px', 
            right: '15px', 
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #FFD700 0%, #B85A45 100%)', // تدرج ذهبي نحاسي
            borderRadius: '12px', // حواف ناعمة جداً
            boxShadow: '0 4px 15px rgba(184, 90, 69, 0.4)', // توهج نحاسي خافت
            border: '2px solid rgba(255, 255, 255, 0.9)', // إطار أبيض ناعم جداً
          }}
          title="خيار دفع مفضل لدى تايراتي"
        >
          {/* أيقونة التاج الذهبي الناعمة */}
          <i className="bi bi-crown-fill text-white" style={{ fontSize: '16px' }}>مميز</i>
        </div>
      )}

      {/* 3. حاوية المودال مع تأثير "التوهج النحاسي الخافت" */}
      <div 
        className={`w-100 transition-all duration-300 p-2 ${item.preferable == 1 ? 'rounded-4' : ''}`}
        style={item.preferable == 1 ? { 
          /* إزالة الإطار واستبداله بتوهج داخلي خافت جداً */
          boxShadow: 'inset 0 0 20px rgba(184, 90, 69, 0.05), 0 10px 30px rgba(184, 90, 69, 0.1)', 
          background: 'linear-gradient(160deg, rgba(184, 90, 69, 0.03) 0%, transparent 100%)'
        } : {}}
      >
 
            </div>
    </div>
        )}
      </div>
    ))}

        {
        paymentsgatways.slice(0, paymentsgatways.length).map(item => (  
       <div >   
    {
       (item.activation == 1 & item.PaymentCardName == 'MAHAFATHATI') ? 
     <div className="position-relative w-100" >
      {/* 2. أيقونة التاج "المفضل" العائمة فوق الزر */}
      {(item.preferable == 1 || item.preferable == "1") && (
        <div 
          className="position-absolute z-3 flex items-center justify-center animate-pulse"
          style={{ 
            top: '-15px', 
            right: '15px', 
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #FFD700 0%, #B85A45 100%)', // تدرج ذهبي نحاسي
            borderRadius: '12px', // حواف ناعمة جداً
            boxShadow: '0 4px 15px rgba(184, 90, 69, 0.4)', // توهج نحاسي خافت
            border: '2px solid rgba(255, 255, 255, 0.9)', // إطار أبيض ناعم جداً
          }}
          title="خيار دفع مفضل لدى تايراتي"
        >
          {/* أيقونة التاج الذهبي الناعمة */}
          <i className="bi bi-crown-fill text-white" style={{ fontSize: '16px' }}>مميز</i>
        </div>
      )}
        {/* 3. حاوية المودال مع تأثير "التوهج النحاسي الخافت" */}
      <div 
        className={`w-100 transition-all duration-300 p-2 ${item.preferable == 1 ? 'rounded-4' : ''}`}
        style={item.preferable == 1 ? { 
          /* إزالة الإطار واستبداله بتوهج داخلي خافت جداً */
          boxShadow: 'inset 0 0 20px rgba(184, 90, 69, 0.05), 0 10px 30px rgba(184, 90, 69, 0.1)', 
          background: 'linear-gradient(160deg, rgba(184, 90, 69, 0.03) 0%, transparent 100%)'
        } : {}}
      >
            <MahafathatiPayModal paymentcard_id = {item.paymentcard_id} paypointspaypoint_id= {paypointspaypoint_id} amount = {amount} producid = {producid} brandid= {brandid} tiresize = {tiresize} crcy = {crcy} quantity = {quantity} paymentdate = {date.toLocaleDateString()} total = {total} tireSpec= {tireSpec} brand={brand} KSAxchange= {KSAxchangerial} />

          </div>
    </div>
       : null
       }


 <div>
        {
       (item.activation == 1 & item.PaymentCardName == 'Kurimi') ? 
     <div class="d-flex align-items-center">
  <div class="flex-shrink-0">
       <div className="d-flex align-items-center">
       <KurimiPay producid={producid} brandId={brandid}  amount={amount}  productName={productName} tiresize={tiresize} quantity={quantity} crcy= {crcy}  paymentdate={date.toLocaleDateString()  } />

    </div> 
  </div>
</div>
       : null
       }
    </div>
</div>       
    ))}
  </div>
  
    </div>
  );
}
