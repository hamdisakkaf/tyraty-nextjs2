// مكون جديد: PaymentSection.js
import { CreditCard } from "lucide-react"
import { PaymentAppAccounts } from "./PaymentApps"

const PaymentSection = ({ orderId, total }) => {
  return (
    <div className="bg-[#0f0f0f] text-white p-6 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden" dir="rtl">
      <div className="order-items-section mb-6">
        <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">
          <CreditCard className="inline-block ml-2 text-[#B85A45]" />
          حسابات التحويل البنكي
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          يمكنك التحويل المباشر عبر التطبيقات المالية التالية:
        </p>
      </div>
      <PaymentAppAccounts id={orderId} totaly={total} /> 

    </div>
  )
}

export default PaymentSection