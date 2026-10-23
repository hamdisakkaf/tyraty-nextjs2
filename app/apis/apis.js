import axios from "axios";

// 1. تصحيح الاسم
const isLocalhost = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';

const localhost = 'http://localhost:5000';
const remoteserver = process.env.NEXT_PUBLIC_API_URL;

const server = isLocalhost ? localhost : remoteserver;
 



export async function addRequestToDB (buyerReq)  {
  try {
    await axios.post(`${server}/addrequest`,
    //await axios.post('https://server.tyraty.com/addrequest',
      buyerReq 
    ).then((response)=> {
    console.log(response.data);
    //setMsg('تم اضافة الإطار بنجاح ')
    console.log('Sucsess add product')
      //emptyFilds()
    })
    .catch( (error) => {
    console.log('addRequestToDB error', error)
    // setMsg('حصلت مشكلة في الادخال')
    })
    } catch (error) {
      console.log('addRequestToDB error:', error)
    }
 }


 export async function addUserRegister(user) {
    console.log('Sending customer data:', user);

    // 1. استخدام axios وانتظار الرد
    // لاحظ: لا نستخدم .catch هنا، نترك الخطأ يذهب لـ Redux ليعالجه في .rejected
    const response = await axios.post(`${server}/usersRegister`, user);

    // 2. طباعة النتيجة للتأكد (اختياري)
    console.log('Server response:', response.data);

    // 3. أهم خطوة: إرجاع البيانات (response.data)
    // هذا ما سيظهر داخل action.payload في Redux
    return response.data; 
}

 export async function addUNewAdminUser(user) {
    console.log('Sending customer data:', user);

    // 1. استخدام axios وانتظار الرد
    // لاحظ: لا نستخدم .catch هنا، نترك الخطأ يذهب لـ Redux ليعالجه في .rejected
    const response = await axios.post(`${server}/addUNewAdminUser`, user);

    // 2. طباعة النتيجة للتأكد (اختياري)
    console.log('Server response:', response.data);

    // 3. أهم خطوة: إرجاع البيانات (response.data)
    // هذا ما سيظهر داخل action.payload في Redux
    return response.data; 
}