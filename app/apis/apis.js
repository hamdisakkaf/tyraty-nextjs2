import axios from "axios";

// 1. تصحيح الاسم
const isLocalhostEnabled = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';
// 2. استخدام متغيرات البيئة للرابطين (مع قيمة احتياطية للوكل هوست)
const localhost = process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:5001';
// 3. إضافة قيمة احتياطية للسيرفر البعيد لتجنب الـ undefined
const remoteServer = process.env.NEXT_PUBLIC_API_URL || 'https://tyraty-server.onrender.com';
// اختيار السيرفر
const server = isLocalhostEnabled ? localhost : remoteServer;
 



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