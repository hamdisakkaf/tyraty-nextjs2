import axios from "axios";

 const isLocalhost = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';
const localhost = 'http://localhost:5000';
const remoteserver = process.env.NEXT_PUBLIC_API_URL;
const server = isLocalhost ? localhost : remoteserver;
 

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
  