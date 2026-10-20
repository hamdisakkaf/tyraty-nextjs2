// app/pay/Payment-gateways-guest.js
"use client"

import React, { useEffect, useState } from 'react'
import { alpha, styled } from '@mui/material/styles'
import { pink } from '@mui/material/colors'
import Switch from '@mui/material/Switch'
import { FormGroup } from 'react-bootstrap'
import { FormControlLabel } from '@mui/material'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import PayByCashGatway from './CashTamkeen/PayByCashGatway'
import MahafathatiPayModal from './MAHAFATHATI/MahafathatiPay'
import KurimiPay from './BankingCards/KurimiPay'
import { PaymentApps } from './PaymentApps'
import PaymentModal from '../moduls/payments/customPaymentModal'
import axios from 'axios'
import cashTamkeen from '../../components/assets/payments/CashTamkeen/cash-tamkeen.webp'
import { yemeniRials } from './methods/paymethods'
import { UserCheck, Wallet, Landmark, Banknote, ShieldCheck } from 'lucide-react'

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
}))

const label = { inputProps: { 'aria-label': 'Color switch demo' } }

// Environment variables (Next.js style)
const isLocalhostEnabled = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true'
const localhost = process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:5000'
const remoteServer = process.env.NEXT_PUBLIC_API_URL || 'https://server.tyraty.com'
const server = isLocalhostEnabled ? localhost : remoteServer

console.log('Current API Server:', server)

export default function PaymentsGatewaysGuest() {
  const router = useRouter()

  // ✅ بيانات الأدمن من Redux
  const getAdminInfo = useSelector((state) => state.AdminAccount)
  const { userToken, branchId, branchName, SignInAdmin, adminEmail, statusAdminLogin, permissionAdmin } = getAdminInfo

  // ✅ بيانات السلة من Redux (بدلاً من الـ props)
  const { lastOrderDetails } = useSelector((state) => state.basket)

  // ✅ استخراج جميع البيانات من Redux مع fallback values
  const {
    pricesid = null,
    amount = 0,
    finalPrice = 0,
    quantity = 1,
    totalPrice = 0,
    tiresize = '',
    currency: crcy = 'SAR',
    items = [],
    brand = [],
    tireSpec = {},
    date: orderDate = new Date().toISOString(),
    paymentMethod = '',
  } = lastOrderDetails || {}

  // ✅ استخراج بيانات المنتج الأول من items
  const firstItem = items[0] || {}
  const {
    product_id: producid = null,
    productName = '',
    brands_brand_id: brandid = null,
    payPointId: paypointspaypoint_id = null, 
    payPointName = '',
    payPointstel = '',
    brandName = '',
    brandNameAr = '',
    brandLogo = '',
    COO = '',
  } = firstItem

  // ✅ استخراج مواصفات الإطار من tireSpec أو firstItem
  const {
    tire_slug = '',
    imageURL = '',
    Maxload = '',
    MaxSpeed = '',
    itemNo = '',
  } = tireSpec || firstItem

  const [date, setDate] = useState(new Date(orderDate))
  const [checked, setChecked] = useState(true)
  const [KSAxchangerial, setKSAxchangeRial] = useState(null)
  const [DolarexchangeRial, setDolarexchangeRial] = useState()

  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const togglePaymentModal = () => {
    setShowPaymentModal(false)
  }

  // Fetch exchange rates
  useEffect(() => {
    const getRates = async () => {
      try {
        const res = await yemeniRials()
        setKSAxchangeRial(res.data[0].KSAxchangeRial)
        setDolarexchangeRial(res.data[0].DolarexchangeRial)
      } catch (error) {
        console.log(error)
      }
    }
    getRates()
  }, [])

  console.log("yemeniRials KSAxchangerial:", KSAxchangerial)
  console.log("yemeniRials DolarexchangeRial:", DolarexchangeRial)

  const [paymentsgatways, setPaymentsgatways] = useState([])

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

  // ✅ حماية: إذا لم تتوفر بيانات السلة
  if (!lastOrderDetails || !pricesid) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-cart-x fs-1 d-block mb-3"></i>
          <h4 className="alert-heading">السلة فارغة!</h4>
          <p>لم يتم العثور على بيانات الطلب. يرجى العودة لاختيار المنتجات أولاً.</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => router.push('/shop')}
          >
            <i className="bi bi-shop me-2"></i>
            تصفح المنتجات
          </button>
        </div>
      </div>
    )
  }

  return (
    <div fluid="md">
      <div>
        {/* 1. أولاً: عرض "Cash" فقط */}
        {paymentsgatways.filter(item => item.PaymentCardName === 'Cash').map(item => (
          <div key={item.paymentcard_id}>
            <br /><br />
            {item.activation == 1 && (
              <div className="position-relative w-100">
                {(item.preferable == 1 || item.preferable == "1") && (
                  <div
                    className="position-absolute z-3 flex items-center justify-center animate-pulse"
                    style={{ 
                      top: '-15px', 
                      right: '15px', 
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #FFD700 0%, #B85A45 100%)',
                      borderRadius: '12px',
                      boxShadow: '0 4px 15px rgba(184, 90, 69, 0.4)',
                      border: '2px solid rgba(255, 255, 255, 0.9)',
                    }}
                    title="خيار دفع مفضل لدى تايراتي"
                  >
                    <i className="bi bi-crown-fill text-white" style={{ fontSize: '16px' }}>مميز</i>
                  </div>
                )}

                <div 
                  className={`w-100 transition-all duration-300 p-2 ${item.preferable == 1 ? 'rounded-4' : ''}`}
                  style={item.preferable == 1 ? { 
                    boxShadow: 'inset 0 0 20px rgba(184, 90, 69, 0.05), 0 10px 30px rgba(184, 90, 69, 0.1)', 
                    background: 'linear-gradient(160deg, rgba(184, 90, 69, 0.03) 0%, transparent 100%)'
                  } : {}}
                >
                  <PayByCashGatway 
                    paymentcardid={item.paymentcard_id} 
                    logo={cashTamkeen} 
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* 2. ثانياً: عرض باقي بوابات الدفع */}
        {paymentsgatways.slice(0, paymentsgatways.length).map(item => (  
          <div key={item.paymentcard_id}>   
            {(item.activation == 1 && item.PaymentCardName == 'MAHAFATHATI') ? 
              <div className="position-relative w-100">
                {(item.preferable == 1 || item.preferable == "1") && (
                  <div 
                    className="position-absolute z-3 flex items-center justify-center animate-pulse"
                    style={{ 
                      top: '-15px', 
                      right: '15px', 
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #FFD700 0%, #B85A45 100%)',
                      borderRadius: '12px',
                      boxShadow: '0 4px 15px rgba(184, 90, 69, 0.4)',
                      border: '2px solid rgba(255, 255, 255, 0.9)',
                    }}
                    title="خيار دفع مفضل لدى تايراتي"
                  >
                    <i className="bi bi-crown-fill text-white" style={{ fontSize: '16px' }}>مميز</i>
                  </div>
                )}
                
                <div 
                  className={`w-100 transition-all duration-300 p-2 ${item.preferable == 1 ? 'rounded-4' : ''}`}
                  style={item.preferable == 1 ? { 
                    boxShadow: 'inset 0 0 20px rgba(184, 90, 69, 0.05), 0 10px 30px rgba(184, 90, 69, 0.1)', 
                    background: 'linear-gradient(160deg, rgba(184, 90, 69, 0.03) 0%, transparent 100%)'
                  } : {}}
                >
                  <MahafathatiPayModal 
                    paymentcard_id={item.paymentcard_id} 
                    paypointspaypoint_id={paypointspaypoint_id} 
                    amount={amount} 
                    producid={producid} 
                    brandid={brandid} 
                    tiresize={tiresize} 
                    crcy={crcy} 
                    quantity={quantity} 
                    paymentdate={date.toLocaleDateString()} 
                    tireSpec={tireSpec} 
                    brand={brand} 
                    KSAxchange={KSAxchangerial}  
                  />
                </div>
              </div>
            : null}

            {/* Guest Payment */}
            <div className="mt-0 pt-4 text-center">
              {item.activation == 1 && item.PaymentCardName === 'Guest' ? (
                <div className="guest-card-container d-inline-block p-1 rounded-[2.5rem] shadow-sm bg-light">
                  <div className="mb-2 p-3">
                    <h3 className="badge bg-warning text-dark shadow-sm p-2 font-black text-xl alexandria-h2 tracking-tight">
                      <i className="bi bi-info-circle me-1"></i> التحويلات المالية | الايداع للحساب 
                    </h3>
                  </div>

                  <div className="flex flex-col flex-wrap items-center justify-center p-8 bg-[#1a1a1a] border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#B85A45]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-[#B85A45] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    </div>
                    
                    <div className="text-center relative z-10">
                      <h5 className="mb-2 text-white font-black text-xl alexandria-h2 tracking-tight">
                        {item.PaymentCardNameAr}
                      </h5>
                      <div>
                        <p className="text-gray-400 text-[14px] mb-6 leading-relaxed text-center">
                          يمكنك التحويل لحساب الشركة عبر تطبيقات (كريمي، جيب،ون كاش، جوالي، موبايل موني) وغيرها لإكمال طلبك
                        </p>
                      </div>

                      <PaymentApps />
                        
                      <button 
                        className="group/btn flex items-center justify-center gap-3 bg-gradient-to-r from-[#B85A45] to-[#8a3d2d] text-white border-0 py-3 px-8 rounded-xl font-bold text-sm shadow-lg shadow-[#B85A45]/20 hover:shadow-[#B85A45]/40 hover:-translate-y-1 transition-all duration-300 w-full"
                        onClick={() => setShowPaymentModal(true)}
                      >
                        <i className="bi bi-wallet2 text-lg"></i>
                        <span> ابدأ الدفع الآن </span>
                        <i className="bi bi-arrow-left-short text-xl group-hover/btn:-translate-x-1 transition-transform"></i>
                      </button>
                    </div>
                  </div>
                  
                  <PaymentModal 
                    show={showPaymentModal} 
                    handleClose={togglePaymentModal}
                    amount={amount}
                    KSAxchangerial={KSAxchangerial}
                    producid={producid}
                    brandid={brandid} 
                    tiresize={tiresize} 
                    crcY={crcy} 
                    quantity={quantity} 
                    paymentdatE={date.toLocaleDateString()}
                  />
                </div>
              ) : null}
            </div>
          </div>       
        ))}
      </div>
    </div>
  )
}