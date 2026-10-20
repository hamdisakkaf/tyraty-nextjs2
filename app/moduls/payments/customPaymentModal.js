// app/moduls/payments/customPaymentModal.js
"use client"

import React from "react";
import Cash_on_delivery from "../../pay/Cash_on_delivery";
 
const PaymentModal = ({ show, handleClose, amount, KSAxchangerial, producid, crcY, quantity, paymentdatE, paymentcardid}) => {
  
  // إذا كانت show false لا ترسم أي شيء (لحماية الأداء)
  if (!show) return null;

  return (
    <div className="modal-overlay fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={handleClose}>
      <div 
        className="modal-content relative w-full max-w-lg bg-[#121212] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300" 
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* رأس المودال - Header */}
        <div className="relative p-6 border-b border-white/5 bg-gradient-to-r from-[#B85A45]/10 to-transparent">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-white m-0">إتمام عملية الدفع</h3>
              <p className="text-[11px] text-gray-400 mt-1">يرجى مراجعة البيانات قبل التأكيد</p>
            </div>
            <button 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-[#B85A45] hover:text-white transition-all shadow-inner" 
              onClick={handleClose}
            >
              &times;
            </button>
          </div>
        </div>

        {/* جسم المودال - Body */}
        <div className="modal-body max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="bg-white/5 rounded-2xl mb-6 border border-white/5">
            <Cash_on_delivery 
              amount={amount} 
              totaly={amount * KSAxchangerial} 
              producid={producid} 
              crcY={crcY} 
              KSAxchangerial={KSAxchangerial} 
              quantity={quantity} 
              paymentcardid={paymentcardid}
            />
          </div>
        </div>

        {/* التذييل - Footer */}
        <div className="modal-footer p-6 bg-black/20 border-t border-white/5">
          <button 
            type="button" 
            className="w-full py-3 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
            onClick={handleClose}
          >
            إلغاء والعودة للمتجر
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;