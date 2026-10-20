// app/shop/invoice/page.jsx
"use client"

import { useSelector } from 'react-redux'
import Invoice from '../../pay/Invoice'
import { useRouter } from 'next/navigation'

export default function InvoicePage() {
  const router = useRouter()
  
  // ✅ جلب البيانات من Redux مباشرة
  const getCustomerInfo = useSelector((state) => state.CustomerAccount)
  const { 
    CustomerName, CustomerEmail, phoneNumber, 
    AddressCity, AddressStreet 
  } = getCustomerInfo

  const { lastOrderDetails } = useSelector((state) => state.basket)
  const getPaymentState = useSelector((state) => state.PaymentPaySlice)
  const { currentOrderId } = getPaymentState

  console.log('lastOrderDetails:', lastOrderDetails)

  // ✅ بناء orderDetails من Redux (مثل الكود الأصلي)
  const orderDetails = {
    id: currentOrderId || Date.now().toString(),
    date: Date.now(),
    status: "قيد التجهيز",
    amount: lastOrderDetails?.finalPrice || 0,
    total: lastOrderDetails?.totalPrice || 0,
    paymentMethod: "دفع عبر المحفظة",
    customer: {
      name: CustomerName || 'زائر',
      email: CustomerEmail || '',
      address: `${AddressCity || ''}، ${AddressStreet || ''}`,
      phone: phoneNumber || ''
    },
    items: [
      { 
        id: lastOrderDetails?.items?.[0]?.product_id,
        name: `${lastOrderDetails?.items?.[0]?.productName || ''} ${lastOrderDetails?.tiresize || ''}`, 
        quantity: lastOrderDetails?.quantity || 1, 
        price: lastOrderDetails?.finalPrice || 0,
        total: lastOrderDetails?.totalPrice || 0,
      },
    ],
    brand: lastOrderDetails?.brand?.[0] || null,
    tireSpec: lastOrderDetails?.tireSpec || null
  }

  const handleClose = () => {
    router.push('/')
  }

  // ✅ التحقق من وجود بيانات
  if (!lastOrderDetails || !lastOrderDetails.items) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white" dir="rtl">
        <div className="text-center">
          <p className="text-gray-400 mb-4">لا يوجد طلبات حالية</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-[#B85A45] text-white px-6 py-3 rounded-xl font-bold"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-10 px-4" dir="rtl">
      <Invoice orderDetails={orderDetails} onClose={handleClose} />
    </div>
  )
}