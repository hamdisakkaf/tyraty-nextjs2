"use client"
import  React, { useState,useEffect } from 'react';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from 'axios'
import md5 from "md5";
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { v1 as uuidv1 } from 'uuid';
import { v4 } from 'uuid';

import { saveRetailInvoice, saveRetailInvoiceByCashwoutlogin } from '../../../app/apis/baillingRetailCustomerapi';

const initialState = {
    paymentData: null,      // لتخزين بيانات العملية الناجحة
  isLoading: false,       // للتحكم في ظهور الـ Loader
  error: null,            // لتخزين رسالة الخطأ وعرضها
  isSuccess: null,  
  paymentsgatways: [], // تأكد من وجود هذا السطر
    cashpayState: '',     // لمعرفة هل تمت العملية بنجاح (مفيد للتوجيه لصفحة أخرى)
    gatwaypayCheckState:false,
    toShoppingCart: false,
    paymentId: null,
    kurimipayMESSAGEDESC: null,
    paymentSuccess: false,
    statepaymentSuccessvalue: 0,
    paymentField: null,
    paymentState: null,
    ThankYouPage: false,
    savedretailcustomerinvoicestate: null,
    payByCashonDeliveryModal: false,
    cashpayMESSAGEDESC: null,
    showTrCodeCashmodalstate: false,
    showTrCodeCashFastmodalstate: false,
    transactionCashRef: null,
    requestIDCashref: null,
    RequestId: null,
    OperationStatusCashPayment: null,
    OperationResultCodeCashPayment: null

    }
    
    //const [date, setDate] = useState(new Date());
       // قارن القيمة بالنص 'true' لتتأكد
const isIsLOCALHOSTEnabled = process.env.NEXT_PUBLIC_ISLOCALHOST === 'false';

const localhost = 'http://localhost:5001'
const remoteserver = process.env.NEXT_PUBLIC_API_URL

// الآن سيعمل المنطق بشكل سليم 100%
const server = isIsLOCALHOSTEnabled ? localhost : remoteserver

// دالة مساعدة لمعالجة الأخطاء بشكل موحد ونظيف
const getErrorMessage = (error) => {
  if (error.response) {
    // الخادم استجاب برمز خطأ (4xx, 5xx)
    console.error("Server Error:", error.response.data);
    return error.response.data?.message || "حدث خطأ من الخادم";
  } else if (error.request) {
    // تم إرسال الطلب ولم يصل رد
    console.error("Network Error:", error.request);
    return "لا يوجد اتصال بالخادم، يرجى التحقق من الإنترنت";
  } else {
    // خطأ أثناء إعداد الطلب
    console.error("Request Setup Error:", error.message);
    return error.message;
  }
};

    export const saveRetailCustomerInvoices = createAsyncThunk(
      "payment/saveRetailCustomerInvoices",
      async (data, thunkAPI) => {
        try {
          //const requstProduct = data
         // console.log('payment/saveRetailCustomerInvoices data:',data)
  
            const res = await saveRetailInvoice(data)
            return true
        } catch (error) {
          //console.error('error updateOrder on server',error)
         // return thunkAPI.rejectWithValue({ error: error.message })
         return error
        }
      }
    );

    // الدفع باستخدام محفظة كاش بدون تسجيل دخول العميل على موقع امباير تايراتي
        export const saveRetailCustomerInvoiceswoutlog = createAsyncThunk(
      "payment/saveRetailCustomerInvoiceswoutlog",
      async (data, thunkAPI) => {
        try {
          //const requstProduct = data
          console.log('payment/saveRetailCustomerInvoiceswoutlog data:',data)
  
            const res = await saveRetailInvoiceByCashwoutlogin(data)
            return true
        } catch (error) {
          //console.error('error updateOrder on server',error)
         // return thunkAPI.rejectWithValue({ error: error.message })
         return error
        }
      }
    );

    export const resetPaymentState = createAsyncThunk(
      'payment/resetPaymentState',
      async () => {
        console.log('resetPaymentState dispatch')
       
          return 
        
             
      }
    )
  
    export const showPayByCashonDeliveryModal = createAsyncThunk(
      'payment/showPayByCashonDeliveryModal',
      async () => {
        console.log('showPayByCashonDeliveryModal dispatch')
       
          return        
      }
    )

   export const hidePayByCashonDeliveryModal = createAsyncThunk(
      'payment/hidePayByCashonDeliveryModal',
      async () => {
        console.log('hidePayByCashonDeliveryModal dispatch')
       
          return        
      }
    )
    // ايقاف او تشغيل بوابة الدفع  

    export const paymentgatewaySwitch = createAsyncThunk(
  'payment/switch',
  async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${server}/updategatewaypaystate`, data);
        return response.data; // السيرفر يجب أن يعيد نجاح
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
  }
);


    // الدفع باستخدام بوابة الكريمي
export const payBykurimipay = createAsyncThunk(
  'payment/kurimipay', 
  async (customerRequest,{rejectWithValue }) => {
  //console.log('customer request data:', customerRequest['CustomerEmail'] + customerRequest['phoneNumber'])
  // نموذج طلب العميل الى بنك الكريمي
  const request = {
    SCustID: customerRequest['SCustID'],
    REFNO: customerRequest['REFNO'],
    AMOUNT: customerRequest['SCustID'],
    CRCY: "YER",
    MRCHNTNAME: 'الحمدي للتجارة',
    PINPASS: '3344'
  }
  const invoiceElement = {
    REFNO: customerRequest['REFNO'],
    SCustID:customerRequest['SCustID'],
    producid:customerRequest['producid'],
    itemNo: customerRequest['itemNo'],
    productName: customerRequest['productName'],
    quantity:customerRequest['quantity'],
    AMOUNT:customerRequest['AMOUNT'],
    CRCY: 'YER',
    invoiceDate: customerRequest['invoiceDate'],
}
  //console.log('request to Kuraimi pay:', request)

  // الاوصل الصالح مع try
    // configure header's Content-Type as JSON
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    //axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = axios.post(`${server}/SendPayment`,
        request,
        config,
        { withCredentials: true }
      )
   
      return response
      .catch(error => {
        console.error('Error fetching data:', error);
        /*
        return {
          CODE : response3.data.CODE,
          MESSAGE: response3.data.MESSAGE,
          MESSAGEDESC: response3.data.MESSAGEDESC,
          DATE : response3.data.DATE,
          ResultSet: response3.data.ResultSet
        }
        */
      });
 
    })

    // الدفع عبر التطبيقات - تعبئة طلب الشراء
export const payByCashonDelivery = createAsyncThunk(
    'payment/payByCashonDelivery',
    async (data, { rejectWithValue }) => {
        try {
          console.log('pay By CashOnDelivery on Delivery data', data) 
            const result = await axios.post(`${server}/paycashondelivery`, { data })
            return result.data;
        } catch (err) {
            console.error('error pay cash on delivery :', err)
            return rejectWithValue(err.message)
        }
    }
)


    // الدفع باستخدام كاش تمكين بدون تسجيل الدخول
export const payByCashpayfast = createAsyncThunk(
    'payment/payByCashpayfast',
    async (Request, { rejectWithValue }) => {
// طباعة البيانات للتأكد
        console.log('🚀 Sending payByCashpayfast Request:', Request);
        
        //const myToken = customerRequest['CustomerToken']
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                //'Authorization': `Bearer ${myToken}`
            }
        }

        try {
    
             const response = await axios.post(`${server}/cash-initPayment-fast`, Request);

            console.log('✅ Response payByCashpayfast:', response.data);
            return response.data;

       // ... داخل الـ try/catch
} catch (error) {
    console.error("❌ Error in payByCashpayfast:", error);

    // التحقق من وجود بيانات الرد من السيرفر
    const serverData = error.response?.data;

    if (serverData) {
        // إذا أرسل البنك رسالةResultMessage (مثل مشكلة الرصيد)
        if (serverData.ResultMessage) {
            return rejectWithValue(serverData.ResultMessage);
        }
        
        // إذا أرسل السيرفر رسالة خطأ عامة
        if (serverData.message) {
            return rejectWithValue(serverData.message);
        }

        // في حال وجود بيانات أخرى، نرسلها كنص JSON لتجنب [object Object]
        return rejectWithValue(JSON.stringify(serverData));
    }

    // أخطاء الشبكة أو السيرفر المتوقف
    return rejectWithValue(error.message || "فشل الاتصال بالخادم");
}
    }
)

// ارسال طلب الشراء الى سيرفر تايراتي
export const payByCashpay = createAsyncThunk(
    'payment/payByCashpay',
    async (customerRequest, { rejectWithValue }) => {
// طباعة البيانات للتأكد
        console.log('🚀 Sending Payment Request:', customerRequest);
        
        const myToken = customerRequest['CustomerToken']
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myToken}`
            }
        }

        try {
            const response = await axios.post(`${server}/cash-initPayment`,
                {
                    "totaly": customerRequest.totaly,
                    "CurrencyId": customerRequest.CurrencyId,
                    "CustomerCashPayCode": customerRequest.CustomerCashPayCode,
                    "Desc": 'طلب شراء من محفظة كاش',
                },
                config
            );
            
            console.log('✅ Response payByCashpay:', response.data);
            return response.data;

        } catch (error) {
          // ✅ حتى لو كان الخطأ 500، بوابة كاش ترسل كود الخطأ في الـ data
      const serverError = error.response?.data;
      if (serverError && serverError.ResultCode === -1) {
        // نرسل رسالة الخطأ (مثل 9999 أو 6000) للـ Reducer
        return rejectWithValue(serverError.ResultMessage);
      }
            console.error("❌ Error in payByCashpay:", error);
            // استخراج رسالة الخطأ بدقة لتجنب [object Object]
            let errorMessage = "حدث خطأ غير معروف";
            
            if (error.response && error.response.data) {
                // إذا كان السيرفر أرسل ResultMessage (مثل كاش)
                if (error.response.data.ResultMessage) {
                    errorMessage = `خطأ كاش: ${error.response.data.ResultMessage}`;
                } 
                // رسالة خطأ عامة
                else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
                // تحويل الكائن لنص إذا فشل كل شيء
                else {
                    errorMessage = JSON.stringify(error.response.data);
                }
            } else {
                errorMessage = error.message;
            }
            /*
        // ✅ هذا مهم جداً لعدم انهيار التطبيق
            const message = error.response?.data?.message || "فشل الاتصال بالخادم";
            return thunkAPI.rejectWithValue(message);
            */
            // إرجاع نص فقط (String) وليس كائن
            return rejectWithValue(errorMessage);
        }
    }
)

    //  دالة التحقق من رمز التحقق لتأكيد الدفع المرسل
export const ConfirmCashPayment = createAsyncThunk(
    'payment/ConfirmCashPayment', // التحقق من طلب عملية الدفع
  async (payload,{ rejectWithValue }) => {
  // 1. استخراج البيانات بشكل نظيف (Destructuring)
    const { 
      CustomerToken, 
      RequestID, 
      TransactionRef, 
      CashOTP 
    } = payload;

 console.log('🚀 Confirm Cash Payment Request:', payload);
      
 // 2. إعداد الـ Headers مرة واحدة
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CustomerToken}`
      }
    };

    try {
      // --- الخطوة الأولى: تأكيد الدفع ---
      const confirmResponse = await axios.post(
        `${server}/cash-ConfirmPayment`,
        { RequestID, TransactionRef, CashOTP },
        config
      );
      console.log("✅ ConfirmPayment Response:", confirmResponse.data);
       // إرجاع النتيجة النهائية
      return confirmResponse.data;

/* // نقل فحص حالة الطلب الى السيرفر، بعد حدث تايم اوت 
      // التأكد من وجود البيانات المطلوبة للخطوة التالية
      const requestIdOfNeededOperation = confirmResponse.data?.RequestId;
      
      if (!requestIdOfNeededOperation) {
        throw new Error("لم يتم العثور على RequestId في استجابة العملية الأولى");
      }
      
      // --- الخطوة الثانية: التحقق من حالة العملية ---
      const statusResponse = await axios.post(
        `${server}/cash-OperationStatus`,
        {
          "RequestIDOfNeededOperation": requestIdOfNeededOperation,
          "Type": "PayOP",
        },
        // ملاحظة: عادة لا نحتاج لإرسال التوكن في الطلبات العامة، ولكن إذا كان مطلوباً أضف config هنا
        config
      );

      console.log("✅ OperationStatus Response:", statusResponse.data);
      // إرجاع النتيجة النهائية
      return statusResponse.data;
*/
    } catch (error) {
      // 3. معالجة الأخطاء وإرجاعها للـ Redux
      const errorMsg = getErrorMessage(error);
      return rejectWithValue(errorMsg);
    }
    /*
    const  ConfirmPayment =  (async()=>{
      try {
          const response = await axios
            .post(`${server}/cash-ConfirmPayment`, 

            { 
              "RequestID": ConfirmCashRequest['RequestID'],
              "TransactionRef": ConfirmCashRequest['TransactionRef'],
              "CashOTP": ConfirmCashRequest['CashOTP'],
              },
            config,
            //{ withCredentials: true }
        )
        return response.data;
      } catch {

      }
         
    })
*/
      
     
  });
  export const ConfirmCashPaymentfast = createAsyncThunk(
    'payment/ConfirmCashPaymentfast', // التحقق من طلب عملية الدفع
  async (payload,{ rejectWithValue }) => {
  // 1. استخراج البيانات بشكل نظيف (Destructuring)
    const { 
      RequestID, 
      TransactionRef, 
      CashOTP 
    } = payload;

 console.log('🚀 Confirm Cash Payment Fast Request:', payload);
      
 // 2. إعداد الـ Headers مرة واحدة
    const config = {
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${CustomerToken}`
      }
    };

    try {
      // --- الخطوة الأولى: تأكيد الدفع ---
      const ConfirmCashPaymentfast = await axios.post(
        `${server}/cash-ConfirmPayment-fast`,
        { RequestID, TransactionRef, CashOTP },
        config
      );
      console.log("✅ ConfirmPayment Response:", ConfirmCashPaymentfast.data);
       // إرجاع النتيجة النهائية
      return ConfirmCashPaymentfast.data;

    } catch (error) {
      // 3. معالجة الأخطاء وإرجاعها للـ Redux
      const errorMsg = getErrorMessage(error);
      return rejectWithValue(errorMsg);
    }

  });
  // تغيير كلمة سر حساب كاش للتاجر
  export const CashTamkeenChangePass = createAsyncThunk(
    'payment/cashTamkeenChangePass', // ارسال طلب دفع الكتروني الى بوابة دفع كاش
  async (newCashPass,{ rejectWithValue }) => {
  //console.log('customer request data:', customerRequest['CustomerEmail'] + customerRequest['phoneNumber'])
      //const [md5Hash, setMd5Hash] = useState("");

 //  const config = {
     // headers: {
      //  'Content-Type': 'application/json',
       // 'encPassword': encPassword,
       // 'unixtimestamp':timestamp
     // }
   // }
console.log('newCashPass:', newCashPass)
   const myToken = newCashPass['auth_token']
   console.log('myToken:', myToken)

   // استخراج التوكن (يمكن جلبه من المعاملات أو من الـ State مباشرة)
        //const myToken = customerRequest.CustomerToken;
   // 1. دمج الإعدادات بشكل صحيح
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myToken}` // ضروري جداً للميدل وير!
        },
       // withCredentials: true // يوضع هنا داخل الكونفج وليس كمتغير منفصل
    };
   const payload = {
        // تأكد من أسماء المفاتيح
       // "oldPassword": newCashPass['oldPassword'], 
        "NewPass": newCashPass['newPassword'],
    };
   
        try {  
          const response = await axios
            .post(`${server}/cash-ChangePass`, 
              payload,
            config
        )
        
           console.log('response.data:', response.data);
          return response.data
      
        }
      catch (error) {
          if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("error.response.data",error.response.data);
      console.log("error.response.status", error.response.status);
      console.log("error.response.headers", error.response.headers);
      
      
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log("error.request",error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error message', error.message);
    }
    console.log("error.config",error.config);
    // Use `err.response.data` as `action.payload` for a `rejected` action,
      // by explicitly returning it using the `rejectWithValue()` utility
      return rejectWithValue(error.response.data)
     }
 })

  
  //const KurimiSlice = createSlice({
  const PaymentPaySlice = createSlice({
    name: 'payment',
    initialState,
    // 1. الـ Reducers العادية (لتصفير الحالة مثلاً عند الخروج من الصفحة)
  reducers: {
    // دالة لتصفير حالات الدفع
   // دالة لتصفير حالات الدفع وإغلاق المودالات
    resetPaymentStatus: (state) => {
        state.isSuccess = null;
        state.paymentSuccess = false;
        state.cashpayMESSAGEDESC = null;
        state.paymentState = null;
        state.error = null;
        
        // 🟢 الأهم: إغلاق مودالات الـ OTP للمسجل والزائر لتجنب بقائها مفتوحة
        state.showTrCodeCashmodalstate = false;
        state.showTrCodeCashFastmodalstate = false;
        
        // تصفير المراجع لتجنب تداخل العمليات الجديدة مع القديمة
        state.RequestId = null;
        state.transactionCashRef = null;
    },
  },
    // 2. الـ ExtraReducers للتعامل مع الـ Async Thunk
    extraReducers: (builder) => {
        builder
          .addCase(payBykurimipay.pending, (state, action) => {
            // When data is being fetched
            //state.SignIn = false
            state.kurimipayMESSAGEDESC = 'انتظر قليلاً...'
            state.paymentSuccess = false

          })
          //.addCase(adminlogin.fulfilled, (state, action) => {
            .addCase(payBykurimipay.fulfilled, (state, action) => {
              if (action.payload.statusText = 'OK') {
                console.log('statusText:',action.payload.data.rows)
                state.kurimipayMESSAGEDESC = action.payload.data.rows.MESSAGEDESC
                state.paymentSuccess = true
                state.paymentState = 'تمت عملية الدفع بنجاح'
              }
              //console.log('payBykurimipay.fulfilled:',action.payload.data.rows)
        
            //console.log('action.payload.token:', action.payload.auth_token)
          })
          .addCase(payBykurimipay.rejected, (state, action) => {
           // When data is fetched unsuccessfully
                state.paymentState = ' خطأ في عملية الدفع'
                state.paymentSuccess = false
               
          })
// 1. حالة الانتظار
      .addCase(payByCashpay.pending, (state) => {
        state.isLoading = true; // يفضل إضافة loading state
        state.error = null;
        //state.isSuccess = null;
        state.cashpayMESSAGEDESC = 'جارٍ الاتصال ببوابة كاش...';
        state.paymentSuccess = false;
        state.showTrCodeCashmodalstate = false;
        state.paymentState = 'pending';
        state.showTrCodeCashFastmodalstate = false;

        })
    // 2. حالة نجاح الاتصال (وصل رد من السيرفر)
    .addCase(payByCashpay.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.paymentState = null; // إعادة تعيين الحالة
      console.log('📡 Reducer payByCashpay Received Data:', action.payload);
      // فحص كود النتيجة القادم من كاش (ResultCode)
      const resultCode = action.payload.ResultCode;
      // ✅ النجاح (1) أو قيد المعالجة (0)
        if (resultCode === 1 || resultCode === 0) {
        // ✅ الحالة 1 (وأحياناً 0): تعني أن الطلب وصل لكاش بنجاح وبانتظار تأكيد المستخدم
        // if (action.payload.ResultCode === 1 || action.payload.ResultCode === 0) {
      //state.showTrCodeCashmodalstate = true;
      state.showTrCodeCashFastmodalstate = true;

       //state.isSuccess = true;
        // نضبط الحالة لانتظار التأكيد (Confirm)
        //state.paymentSuccess = false; // نعم false، لأن العملية لم تنتهِ، نحن بانتظار OTP/PIN
        state.cashpayMESSAGEDESC = action.payload.ResultMessage || 'تم إرسال الطلب بنجاح، يرجى الموافقة من هاتفك';
        state.paymentState = 'بانتظار التحقق من الدفع '; // حالة انتقالية
     
        // تخزين البيانات المهمة للخطوة القادمة
        state.RequestId = action.payload.RequestId;
        state.transactionCashRef = action.payload.TransactionRef;
    } 
    
    // ❌ الحالة -1 أو غيرها: تعني فشل (مثل خطأ كلمة المرور 6023)
    // ❌ فشل منطقي (مثل: كلمة سر خطأ، رصيد غير كاف، إلخ)
    else {
        state.paymentSuccess = false;
        state.paymentState = 'فشل';
        state.isSuccess = false;
         // هنا سيظهر لك النص بوضوح: "خطأ: 6023"
         // عرض رسالة الخطأ القادمة من البنك بوضوح
         //state.cashpayMESSAGEDESC = `خطأ (${action.payload.ResultCode}): ${action.payload.ResultMessage}`;
       state.cashpayMESSAGEDESC = action.payload.ResultMessage 
                ? `تنبيه: ${action.payload.ResultMessage}` 
                : 'فشلت العملية لسبب غير معروف';
         state.RequestId = null;
    }
})
   // 3. حالة الفشل التقني (500, 404, Network Error)
      .addCase(payByCashpay.rejected, (state, action) => {
          state.isLoading = true; // يفضل إضافة loading state
           state.error = null;
           state.isSuccess = false;
          state.paymentState = 'فشل';
          state.paymentSuccess = false;
          // تخزين رسالة الخطأ لعرضها في الواجهة لاحقاً
          // ⚠️ التصحيح هنا: action.payload هو النص الذي أرسلناه من Thunk
        state.cashpayMESSAGEDESC = action.payload.ResultMessage || "تعذر الاتصال بالخادم";
      console.error("💥 Redux Rejected:", action.payload);
      })

        .addCase(payByCashpayfast.pending, (state) => {
        state.isLoading = true; // يفضل إضافة loading state
        state.error = null;
        //state.isSuccess = null;
        state.cashpayMESSAGEDESC = 'جارٍ الاتصال ببوابة كاش...';
        state.paymentSuccess = false;
        state.showTrCodeCashFastmodalstate = false;
        state.paymentState = 'pending';
        })
    // 2. حالة نجاح الاتصال (وصل رد من السيرفر)
    .addCase(payByCashpayfast.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.paymentState = null; // إعادة تعيين الحالة
      console.log('📡 Reducer payByCashpay Received Data:', action.payload);
      // فحص كود النتيجة القادم من كاش (ResultCode)
      const resultCode = action.payload.ResultCode;
      // ✅ النجاح (1) أو قيد المعالجة (0)
        if (resultCode === 1 || resultCode === 0) {
        // ✅ الحالة 1 (وأحياناً 0): تعني أن الطلب وصل لكاش بنجاح وبانتظار تأكيد المستخدم
        // if (action.payload.ResultCode === 1 || action.payload.ResultCode === 0) {
      state.showTrCodeCashFastmodalstate = true;
       //state.isSuccess = true;
        // نضبط الحالة لانتظار التأكيد (Confirm)
        //state.paymentSuccess = false; // نعم false، لأن العملية لم تنتهِ، نحن بانتظار OTP/PIN
        state.cashpayMESSAGEDESC = action.payload.ResultMessage || 'تم إرسال الطلب بنجاح، يرجى الموافقة من هاتفك';
        state.paymentState = 'بانتظار التحقق من الدفع '; // حالة انتقالية
     
        // تخزين البيانات المهمة للخطوة القادمة
        state.RequestId = action.payload.RequestId;
        state.transactionCashRef = action.payload.TransactionRef;
    } 
    
    // ❌ الحالة -1 أو غيرها: تعني فشل (مثل خطأ كلمة المرور 6023)
    // ❌ فشل منطقي (مثل: كلمة سر خطأ، رصيد غير كاف، إلخ)
    else {
        state.paymentSuccess = false;
        state.paymentState = 'فشل';
        state.isSuccess = false;
         // هنا سيظهر لك النص بوضوح: "خطأ: 6023"
         // عرض رسالة الخطأ القادمة من البنك بوضوح
         //state.cashpayMESSAGEDESC = `خطأ (${action.payload.ResultCode}): ${action.payload.ResultMessage}`;
       state.cashpayMESSAGEDESC = action.payload.ResultMessage 
                ? `تنبيه: ${action.payload.ResultMessage}` 
                : 'فشلت العملية لسبب غير معروف';
         state.RequestId = null;
    }
})
   // 3. حالة الفشل التقني (500, 404, Network Error)
      .addCase(payByCashpayfast.rejected, (state, action) => {      
    // 1. تحديث حالات التحميل والنجاح
    state.isLoading = false; // يجب أن تكون false لأن العملية انتهت (بفشل)
    state.isSuccess = false;
    state.paymentSuccess = false;
    state.paymentState = 'فشل';

    // 2. معالجة الرسالة القادمة من action.payload
    // بما أن الـ Thunk يرسل نصاً (errorMessage)، نضعه مباشرة في الحالة
    //const errorMessage = action.payload || "حدث خطأ غير متوقع";
      const errorMessage = action.payload;

    state.error = errorMessage; 
    state.cashpayMESSAGEDESC = errorMessage;

    // 3. السجلات (Logs) للمطور
    console.error("💥 Redux Rejected Message:", errorMessage);
      })

           .addCase(ConfirmCashPayment.pending, (state, action) => {
            state.isLoading = true;
           state.error = null;
           //state.isSuccess = false;
            //state.SignIn = false
            state.cashpayMESSAGEDESC = 'قيد تأكيد  طلب الدفع من المستخدم ...'
            state.paymentState = 'قيد تأكيد طلب الدفع'
            state.paymentSuccess = false
             state.toShoppingCart = false
            state.showTrCodeCashmodalstate = false
            state.OperationStatusCashPayment = null
          })
          // --- حالة النجاح (Fulfilled) ---
      // يتم تفعيلها إذا عاد الـ Thunk ببيانات صحيحة (return response.data)
          .addCase(ConfirmCashPayment.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.error = null;
            state.paymentData = action.payload; // البيانات القادمة من return statusResponse.data
                // if (action.payload.statusText = 'OK') {
               // console.log('statusText:',action.payload.data)
                //state.cashpayMESSAGEDESC = action.payload.data.rows.MESSAGEDESC
                console.log('ConfirmCashPayment payload:',action.payload)
                state.showTrCodeCashmodalstate = false
                state.cashpayMESSAGEDESC = 'تم تاكيد طلب الدفع من المستخدم'
                state.paymentSuccess = true
                 state.toShoppingCart = true
                state.paymentState = 'تمت عملية الدفع بنجاح'
                //state.OperationStatusCashPayment = action.payload.Status
                
                //state.OperationResultCodeCashPayment = action.payload.ResultCode
                state.RequestId = action.payload.RequestId 
                state.ResultCode = action.payload.ResultCode 
                state.ThankYouPage = true 
                //state.requestIDCashref = action.payload.RequestID

              //}
          })
          // --- حالة الرفض/الفشل (Rejected) ---
      // يتم تفعيلها إذا قمنا بعمل (return rejectWithValue) داخل الـ Thunk
              .addCase(ConfirmCashPayment.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
               // action.payload هنا يحتوي على الرسالة التي أرسلناها عبر rejectWithValue
           // When data is fetched unsuccessfully
               state.cashpayMESSAGEDESC =  action.payload || 'لم يتم تأكيد الدفع من المستخدم'
                state.paymentState =  action.payload || 'حدث خطأ عند  تأكيد الدفع من المستخدم'
                state.paymentSuccess = false
                state.error = action.payload || "حدث خطأ غير متوقع";
                 //state.showTrCodeCashmodalstate = false 
                state.OperationStatusCashPayment = null 
          })
      
           .addCase(ConfirmCashPaymentfast.pending, (state, action) => {
            state.isLoading = true;
           state.error = null;
           //state.isSuccess = false;
            //state.SignIn = false
            state.cashpayMESSAGEDESC = 'قيد تأكيد  طلب الدفع من المستخدم ...'
            state.paymentState = 'قيد تأكيد طلب الدفع'
            state.paymentSuccess = false
             state.toShoppingCart = false
            state.showTrCodeCashmodalstate = false
            state.OperationStatusCashPayment = null
          })
          // --- حالة النجاح (Fulfilled) ---
      // يتم تفعيلها إذا عاد الـ Thunk ببيانات صحيحة (return response.data)
          .addCase(ConfirmCashPaymentfast.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.error = null;
            state.paymentData = action.payload; // البيانات القادمة من return statusResponse.data
                // if (action.payload.statusText = 'OK') {
               // console.log('statusText:',action.payload.data)
                //state.cashpayMESSAGEDESC = action.payload.data.rows.MESSAGEDESC
                console.log('ConfirmCashPaymentfast payload:',action.payload)
                state.showTrCodeCashFastmodalstate = false
                state.cashpayMESSAGEDESC = 'تم تاكيد طلب الدفع من المستخدم'
                state.paymentSuccess = true
                 state.toShoppingCart = true
                state.paymentState = 'تمت عملية الدفع بنجاح'
                //state.OperationStatusCashPayment = action.payload.Status
                
                //state.OperationResultCodeCashPayment = action.payload.ResultCode
                state.RequestId = action.payload.RequestId 
                state.ResultCode = action.payload.ResultCode 
                state.ThankYouPage = true 
                //state.requestIDCashref = action.payload.RequestID

              //}
          })
          // --- حالة الرفض/الفشل (Rejected) ---
      // يتم تفعيلها إذا قمنا بعمل (return rejectWithValue) داخل الـ Thunk
          .addCase(ConfirmCashPaymentfast.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
               // action.payload هنا يحتوي على الرسالة التي أرسلناها عبر rejectWithValue
           // When data is fetched unsuccessfully
               state.cashpayMESSAGEDESC =  action.payload || 'لم يتم تأكيد الدفع من المستخدم'
                state.paymentState =  action.payload || 'حدث خطأ عند  تأكيد الدفع من المستخدم'
                state.paymentSuccess = false
                state.error = action.payload || "حدث خطأ غير متوقع";
                 //state.showTrCodeCashmodalstate = false 
                state.OperationStatusCashPayment = null 
          })

        .addCase(resetPaymentState.fulfilled, (state, action) => {
          console.log('resetPaymentState')
        state.isLoading = false;
        state.error = null;
        state.isSuccess = false;
        state.paymentData = null;
        state.paymentSuccess = ''
        state.paymentState = ''
        state.cashpayMESSAGEDESC = ''
        state.toShoppingCart = false
        state.OperationStatusCashPayment = ''
      })
      
      .addCase(paymentgatewaySwitch.pending, (state, action) => {
            // When data is being fetched
            //state.SignIn = false
            state.cashpayState = 'انتظر قليلاً...'
              state.gatwaypayCheckState = !state.gatwaypayCheckState

          })
          .addCase(paymentgatewaySwitch.fulfilled, (state, action) => {
    // 1. استخراج البيانات (تأكد أن الـ payload يحتوي على الـ id والحالة الجديدة)
    // عادة الـ action.meta.arg يحتوي على البيانات التي أرسلتها للـ Thunk
    const { paymentcardid, CheckState } = action.meta.arg;

    // 2. تحديث الرسالة العامة
    state.cashpayState = CheckState === 1 ? 'الخدمة تعمل الآن' : 'خدمة الدفع متوقفة حالياً';

    // 3. 🔥 التحديث الذكي للمصفوفة:
    // نبحث عن البوابة المحددة في المصفوفة ونغير حالة الـ activation الخاصة بها فقط
    // التأكد من أن المصفوفة موجودة وليست null أو undefined
    if (state.paymentsgatways && Array.isArray(state.paymentsgatways)) {
        const index = state.paymentsgatways.findIndex(item => item.paymentcard_id === paymentcardid);
        
        if (index !== -1) {
            state.paymentsgatways[index].activation = CheckState;
            state.cashpayState = 'تم التحديث بنجاح';
        }
    } else {
        console.error("خطأ: مصفوفة paymentsgatways غير موجودة في الـ Store");
    }

    // لم نعد بحاجة لـ state.gatwaypayCheckState = !state.gatwaypayCheckState 
    // لأن التغيير حدث في العنصر نفسه داخل المصفوفة
})
              .addCase(paymentgatewaySwitch.rejected, (state, action) => {
           // When data is fetched unsuccessfully
           state.cashpayState = 'خطأ في عملية تحديث حالة خدمة الدفع  '
            state.gatwaypayCheckState = !state.gatwaypayCheckState
          })
          /*
    //payByCashpayWoutlogin
      .addCase(payByCashpayWoutlogin.pending, (state, action) => {
            // When data is being fetched
            //state.SignIn = false
            state.cashpayMESSAGEDESC = 'انتظر قليلاً...'
            state.paymentSuccess = false
            state.toShoppingCart=false
            state.showTrCodeCashmodalstate = false
           // console.log('payByCashpay pending payload:',action.payload)

          })
          .addCase(payByCashpayWoutlogin.fulfilled, (state, action) => {
                // if (action.payload.statusText = 'OK') {
               // console.log('statusText:',action.payload.data.rows)
                //state.cashpayMESSAGEDESC = action.payload.data.rows.MESSAGEDESC
                 state.paymentSuccess = false
                  state.toShoppingCart=false
                state.paymentState = 'جاري التحقق من عملية الدفع'
                 console.log('payByCashpay payload:',action.payload)
              //  state.transactionCashRef = action.payload.TransactionRef  // الى حين فتح البوابة
                //state.requestIDCashref = action.payload.RequestId  // الى حين فتح البوابة
                state.showTrCodeCashmodalstate = true
                state.cashpayMESSAGEDESC = 'جاري التحقق من عملية الدفع'
          })
              .addCase(payByCashpayWoutlogin.rejected, (state, action) => {
           // When data is fetched unsuccessfully
                state.cashpayMESSAGEDESC = 'خطأ في عملية الدفع'
                state.paymentState = ' خطأ في عملية الدفع'
                state.paymentSuccess = false
                 state.toShoppingCart=false
                 state.showTrCodeCashmodalstate = false 
                 state.OperationStatusCashPayment = null   
          })
*/
          
          .addCase(showPayByCashonDeliveryModal.fulfilled, (state, action) => {
                state.payByCashonDeliveryModal = true 
                state.showTrCodeCashmodalstate = null
                state.isSuccess = null
                state.paymentState = null
                state.cashpayMESSAGEDESC = null
          })
          
      .addCase(hidePayByCashonDeliveryModal.fulfilled, (state, action) => {
                state.payByCashonDeliveryModal = false 
          })
      .addCase(payByCashonDelivery.pending, (state, action) => {
            // When data is being fetched
            //state.SignIn = false
            state.payByCashonDeliveryModal = true
            state.cashpayMESSAGEDESC = 'انتظر قليلاً...'
            state.paymentSuccess = false
            state.toShoppingCart=false
            state.showTrCodeCashmodalstate = false
           // console.log('payByCashpay pending payload:',action.payload)

          })
.addCase(payByCashonDelivery.fulfilled, (state, action) => {
    console.log('البيانات المستلمة:', action.payload);

    // axios يضع البيانات القادمة من السيرفر داخل كائن data
    // لذا نفحص action.payload.success (إذا كنت ترجع result.data من الـ Thunk)
    // أو action.payload.data.success (إذا كنت ترجع result كاملاً)
    
    const response = action.payload; 

    if (response.success || response.status === 200) {
        state.isSuccess = true;
        state.paymentSuccess = true;
        
        // تأكد أن المسميات تطابق ما يرسله السيرفر (message أو msg)
        state.cashpayMESSAGEDESC = response.message || 'تمت العملية بنجاح'; 
        
        state.paymentState = null;
        state.error = false;
        // إغلاق مودال الدفع عند النجاح إذا أردت
        state.payByCashonDeliveryModal = false; 
        // حفظ رقم الطلب القادم من السيرفر
    state.currentOrderId = action.payload.orderId;
    } else {
        state.isSuccess = false;
        state.paymentSuccess = false;
        state.cashpayMESSAGEDESC = response.message || 'فشل ارسال طلب الشراء';
    }
})
.addCase(payByCashonDelivery.rejected, (state, action) => {
    console.error('تم رفض العملية:', action.payload);
    state.isSuccess = false;
    state.paymentSuccess = false;
    state.error = true;
    
    // استخدام الرسالة القادمة من الخطأ الفعلي إن وجدت
    state.cashpayMESSAGEDESC = action.payload || 'خطأ في الاتصال بالسيرفر';
    state.paymentState = 'خطأ في عملية الدفع';
    
    state.toShoppingCart = false;
    state.payByCashonDeliveryModal = true; // إبقاء المودال مفتوحاً ليعدل المستخدم بياناته
})

          .addCase(saveRetailCustomerInvoices.pending, (state, action) => {
            // When data is being fetched
            //state.SignIn = false
            state.savedretailcustomerinvoicestate = '...انتظار'
          })
          //.addCase(adminlogin.fulfilled, (state, action) => {
            .addCase(saveRetailCustomerInvoices.fulfilled, (state, { payload } ) => {
            state.savedretailcustomerinvoicestate = 'تمت حفظ فاتورتك  '
          })
          .addCase(saveRetailCustomerInvoices.rejected, (state, action) => {
           // When data is fetched unsuccessfully
                state.savedretailcustomerinvoicestate = ' خطأ في حفظ الفاتورة '
          })
          .addCase(saveRetailCustomerInvoiceswoutlog.pending, (state, action) => {
            // When data is being fetched
            //state.SignIn = false
            state.savedretailcustomerinvoicestate = '...انتظار'
          })
          //.addCase(adminlogin.fulfilled, (state, action) => {
            .addCase(saveRetailCustomerInvoiceswoutlog.fulfilled, (state, { payload } ) => {
            state.savedretailcustomerinvoicestate = 'تمت حفظ فاتورتك  '
          })
          .addCase(saveRetailCustomerInvoiceswoutlog.rejected, (state, action) => {
           // When data is fetched unsuccessfully
                state.savedretailcustomerinvoicestate = ' خطأ في حفظ الفاتورة '
          })

          // and provide a default case if no other handlers matched
          .addDefaultCase((state, action) => {})
      },
  })

  //dispatch(getPosts())
  // Export the reducer logic from the slice
export default PaymentPaySlice.reducer
export const { resetPaymentStatus } = PaymentPaySlice.actions;
//export default KurimiSlice.reducer

