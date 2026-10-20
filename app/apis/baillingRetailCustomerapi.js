import axios from "axios";

const isLocalhostEnabled = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';
// 2. استخدام متغيرات البيئة للرابطين (مع قيمة احتياطية للوكل هوست)
const localhost = process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:5001';
// 3. إضافة قيمة احتياطية للسيرفر البعيد لتجنب الـ undefined
const remoteServer = process.env.NEXT_PUBLIC_API_URL || 'https://tyraty-server.onrender.com';
// اختيار السيرفر
const server = isLocalhostEnabled ? localhost : remoteServer;
 

 // حفظ الفاتورة في قاعدة البيانات
 export async function saveRetailInvoice (data)  {
    console.log('saveRetailInvoice:', data)
    //const res = await axios.post('https://server.alhamditires.com/saveRetailInvoice',data)
      const res = await axios.post(`${server}/saveRetailInvoice`,data)

    return res.data
  }

   export async function saveRetailInvoiceByCashwoutlogin (data)  {
    console.log('saveRetailInvoiceByCashwoutlogin:', data)
    //const res = await axios.post('https://server.alhamditires.com/saveRetailInvoice',data)
      const res = await axios.post(`${server}/saveRetailInvoiceCashwoutlogin`,data)

    return res.data
  }
  