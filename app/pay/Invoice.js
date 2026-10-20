import React, { useRef } from 'react';
import ElectronicSeal from './ElectronicSeal';

import { useReactToPrint } from 'react-to-print';

const Invoice = ({ orderDetails, onClose }) => {
  const printableRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
    documentTitle: `فاتورة-${orderDetails.id}`,
  });

  return (
    
    <div className="p-4 sm:p-8">
      {/* الأزرار - لن تُطبع */}
       <br /> <br />
         {/* الأزرار - خارج printableRef تماماً */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-end gap-3">
        <button 
          onClick={onClose} 
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
        >
          ✕ إغلاق
        </button>
        <button 
          onClick={handlePrint} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          🖨️ طباعة الفاتورة
        </button>
      </div>
      <div
        ref={printableRef}
        id="printable-invoice"
        className="max-w-4xl mx-auto bg-white p-8 shadow-2xl rounded-sm border border-gray-200"
        style={{ direction: 'rtl', backgroundColor: 'white' }}
      >
        {/* محتوى الفاتورة كما هو، بدون أي تغيير في البنية */}
        <div className="flex justify-between items-start border-b-2 border-blue-600 pb-6 mb-8">
           {/* وضعه هنا يجعله يظهر فوق التذييل مباشرة */}
 
          <div>
            <div className="mt-4 text-sm text-gray-600">
              <p>رقم الفاتورة: <span className="font-bold text-gray-900">#{orderDetails.id}</span></p>
              <p>التاريخ: {new Date(Number(orderDetails.date)).toLocaleDateString('ar-YE')}</p>
            </div>
             
          </div>
          <div className="text-left flex flex-col items-end">
            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
              {orderDetails.status}
            </span>
            <h2 className="text-xl font-bold text-gray-800">فاتورة شراء</h2>
            <p className="text-xs text-gray-500 mt-1">{orderDetails.paymentMethod}</p>
          </div>
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2 bg-gray-50 p-4 rounded-lg">
          <div>
            <h3 className="text-blue-700 font-bold text-sm mb-3 border-b pb-1">👤 بيانات المستلم</h3>
            <p className="text-gray-800"><span className="text-gray-500 ml-2">الاسم:</span> {orderDetails.customer.name}</p>
            <p className="text-gray-800"><span className="text-gray-500 ml-2">الجوال:</span> {orderDetails.customer.phone}</p>
          </div>
          <div>
            <h3 className="text-blue-700 font-bold text-sm mb-3 border-b pb-1">📍 عنوان التوصيل</h3>
            <p className="text-gray-800">{orderDetails.customer.address}</p>
          </div>
        </div>

        <div className="overflow-x-auto mb-2">
          <table className="w-full text-sm text-right border-collapse">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="p-3">المنتج</th>
                <th className="p-3">الماركة</th>
                <th className="p-3 text-center">الكمية</th>
                <th className="p-3 text-left">الإجمالي</th>
              </tr>
            </thead>
        <tbody className="divide-y divide-gray-200">
  {orderDetails.items.map((item, index) => (
    <tr key={index} className="border-b border-gray-100">
      <td className="p-3 text-right">
        {/* نستخدم text-gray-900 لضمان السواد و print:text-black للطباعة */}
        <div className="font-bold text-gray-900 print:text-black">{item.name}</div>
        <div className="text-xs text-gray-500 print:text-gray-600">{item.tireSize}</div>
      </td>
      
      <td className="p-3 text-gray-700 print:text-black">
        {orderDetails.brand?.brandName || orderDetails.brand}
      </td>
      
      <td className="p-3 text-center text-gray-700 print:text-black">
        {item.quantity}
      </td>
      
      <td className="p-3 text-left font-bold text-gray-900 print:text-black">
        {(item.quantity * item.price).toFixed(2)} ر.س
      </td>
    </tr>
  ))}
</tbody>
          </table>
          <div className="flex justify-between p-2 bg-green-50 rounded border border-green-200">
              <span className="text-green-800 text-xs font-bold">بالريال اليمني:</span>
              <span className="font-black text-green-700">{orderDetails.totalAmountYE} YER</span>
            </div>
        </div>

                    
           
 {/* تذييل الفاتورة المطور */}
<div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center justify-center text-center relative">  
<div className="absolute -top-10 left-4 sm:left-10">
      <ElectronicSeal />
  </div>
  {/* حاوية الشعار والنص المركزية */}
  <div className="flex flex-col items-center gap-2 mb-4">
    <img 
      src="/لوجو تايراتي tyrate - Opject-09.svg" 
      alt="تايـراتي"
      className="h-16 w-auto mb-1 print:h-20" /* تكبير بسيط للطباعة */
      style={{ maxWidth: '200px' }}
    />
    <h1 className="text-2xl font-black text-blue-700 tracking-tight">Tyraty.com</h1>
    {/* الختم الإلكتروني - يظهر فوق الفاتورة بشكل مائل */}
   
  </div>

 
  {/* رسالة الختام */}
  <div className="text-gray-400 text-xs">
    <p className="mb-2 italic font-medium text-gray-500 print:text-black">
      شكراً لاختياركم تايـراتي - نتمنى لكم رحلة آمنة 🚗
    </p>
    <p className="font-mono uppercase tracking-[0.2em] text-[10px] opacity-70">
      © {new Date().getFullYear()} ALL RIGHTS RESERVED
    </p>
  </div>
</div>
          
 
      </div>

      {/* أنماط الطباعة - بسيطة وآمنة */}

    </div>
  );
};

export default Invoice;