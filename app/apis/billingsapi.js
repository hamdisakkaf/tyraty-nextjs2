import axios from "axios";

const isLocalhost = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';

const localhost = 'http://localhost:5000';
const remoteserver = process.env.NEXT_PUBLIC_API_URL;

const server = isLocalhost ? localhost : remoteserver;
 

export async function updateOrderStateFunction(request_id) {
  try {
    await axios.post(`${server}/updateOrder`,[request_id])
    
    } catch (error) {
      console.log('updateOrderStateFunction  error:', error)
    }

}

export async function updateOrderStateFunctionReqWoutlog(request_id) {
  try {
    await axios.post(`${server}/updateOrderReqWoutlog`,[request_id])
    
    } catch (error) {
      console.log('updateOrderStateFunctionReqWoutlog error:', error)
    }

}

export async function undoOrderStat(request_id) {
  console.log('request_id:', request_id)

    await axios.post(`${server}/undoOrderState`,[request_id]
    ).then((res)=>{
      console.log('undoOrderStater')
      return res
    })
    .catch( (error) => {
    console.log('update Order State error', error)
    return error
    // setMsg('حصلت مشكلة في الادخال')
    }) 
}



export const undoProductQuantityapi = async (product_id) =>{ 
  console.log('product_id:', product_id)
  console.log('q api:', product_id.approvedQuantity)

   const res = await axios.post(`${server}/undoProductQuantity`,[product_id])
    return res.data
    .catch( (error) => {
    console.log('undoProductQuantity error', error)
    return error
    // setMsg('حصلت مشكلة في الادخال')
    }) 
}
 // حفظ فاتورة عميل التجزئة في قاعدة البيانات
 export async function saveInvoice (data)  {
  console.log('saveInvoice:', data)
      await axios.post(`${server}/saveretailinvoice`,data)
     

 // return res.data
}
 // حفظ فاتورة عميل التجزئة في قاعدة البيانات وتحديث حالة الطلب الى مكتمل
export async function ConfirmeandsaveInvoice(data) {
   console.log('confirmeandsaveinvoice:', data)
      //await axios.post(`${server}/confirmeandsaveinvoice`,data)
      await axios.post(`${server}/api/confirm-invoice`,data)
}
