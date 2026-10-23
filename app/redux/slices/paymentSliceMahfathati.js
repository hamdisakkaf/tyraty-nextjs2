"use client"
import  React, { useState,useEffect } from 'react';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

import { saveRetailInvoice,saveRetailInvoiceByCashwoutlogin } from '../../../app/apis/baillingRetailCustomerapi';

const initialState = {
    paymentData: null,      // لتخزين بيانات العملية الناجحة
  isLoading: false,       // للتحكم في ظهور الـ Loader
  error: null,            // لتخزين رسالة الخطأ وعرضها
  orderDetails: [],
  isSuccess: null,       // لمعرفة هل تمت العملية بنجاح (مفيد للتوجيه لصفحة أخرى)
    cashpayState: '',
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
    //showTrCodeCashmodalstate: false,
    showTrCodeMahafatimodalstate: false,
    showTrCodeMahafatiFastmodalstate: false,
    transactionCashRef: null,
    requestIDCashref: null,
    RequestId: null, // كاش
    transNo: null, // محفظتي
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

    /*
    // الدفع باستخدام محفظة كاش بدون تسجيل دخول العميل على موقع الحمدي
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
*/
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
    /*
    // ايقاف او تشغيل بوابة دفع كاش تمكين
export const paymentgatewaySwitch = createAsyncThunk(
  'payment/paymentgatewaySwitch', 
  async (newcashpaystatedata,{rejectWithValue }) => {
  console.log('new cash pay state userdata:', newcashpaystatedata)
  //paymentcard_id
  // الاوصل الصالح مع try
    // configure header's Content-Type as JSON
    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    }
    //axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await axios
      //.post("https://server.alhamditires.com/adminlogins",
      .post(`${server}/newgatewaypaystate`, 
         
       //await axios.post('https://api.imagemarketing.net/Customerlogin', 
        newcashpaystatedata,
        config,
        { withCredentials: true }
    )
    console.log('Authenticated successfully:', response.data);
      return response.data
    

    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
    })
*/
// دالة الترجمة (يفضل وضعها خارج الـ Thunk لترتيب الكود)
const getArabicErrorMessage = (code) => {
   const errors = {
      "105": "عذراً، رصيدك في المحفظة لا يكفي لإتمام الطلب.",
      "6000": "رقم المحفظة المدخل غير صحيح.",
      "default": "حدث خطأ أثناء الدفع، يرجى المحاولة لاحقاً."
   };
   return errors[code] || errors["default"];
};

// ارسال طلب الشراء الى سيرفر تايراتي
export const payByMahafatiPay = createAsyncThunk(
    'payment/payByMahafatiPay',
    async (data, { rejectWithValue }) => {
// طباعة البيانات للتأكد
        console.log('🚀 Sending Payment Request:', data);
        
        //const myToken = customerRequest['CustomerToken']
        const config = {
            headers: {
            'Content-Type': 'application/json',
          //  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' // هذا يوهم السيرفر أن الطلب من متصفح وليس سكربت
          },
        }
        try {
          /*
            const response = await axios.post(`${server}/agentapirequest`,
                {
                    "amount": customerRequest.amount,
                    "fromAccount": customerRequest.fromAccount,
                },
             //   config
            );
            */
              const response = await axios.post(`${server}/agentapirequest`, data );
            console.log('✅ Response payByMahafatiPay:', response.data);
            return response.data;

        } catch (error) {
       console.error("❌ Error in payByMahafatiPay:", error);
// 1. خطأ في الاتصال (لا يوجد رد)
            if (!error.response) {
                return rejectWithValue("تعذر الاتصال بالسيرفر، تحقق من الإنترنت");
            }
           
     
          // ✅ حتى لو كان الخطأ 500، بوابة كاش ترسل كود الخطأ في الـ data
      const serverData = error.response?.data;
      // إذا كان السيرفر أرسل كائن JSON يحتوي على رسالة
      // 2. إذا كان الخطأ قادم من البنك برمز (errCode)
            if (serverData && serverData.errCode) {
                // نترجم الكود لرسالة عربية ونرسلها للـ UI
                const arabicMessage = getArabicErrorMessage(serverData.errCode);
                return rejectWithValue(arabicMessage);
            }
            // 3. أي خطأ آخر
            return rejectWithValue(serverData.message || error.message || "حدث خطأ غير متوقع");
        
            /*
        // ✅ هذا مهم جداً لعدم انهيار التطبيق
            const message = error.response?.data?.message || "فشل الاتصال بالخادم";
            return thunkAPI.rejectWithValue(message);
            */
            // إرجاع نص فقط (String) وليس كائن
           // return rejectWithValue(errorMessage);
            
        }
        
    }
)

    //  دالة التحقق من رمز التحقق لتأكيد الدفع المرسل
export const ConfirmMahafatiPayment = createAsyncThunk(
    'payment/ConfirmMahafatiPayment', // التحقق من طلب عملية الدفع
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


    } catch (error) {
      // 3. معالجة الأخطاء وإرجاعها للـ Redux
      const errorMsg = getErrorMessage(error);
      return rejectWithValue(errorMsg);
    }
 
      
     
  });

export const ConfirmMahafatiPaymentfast = createAsyncThunk(
  'payment/ConfirmMahafatiPaymentfast', // التحقق من طلب عملية الدفع
  async (payload,{ rejectWithValue }) => {
  // 1. استخراج البيانات بشكل نظيف (Destructuring)
    const { 
      RequestId,
      transId, 
      //TransactionRef, 
      otp 
    } = payload;

 console.log('🚀 Confirm ConfirmMahafatiPaymentfast Payment Request:', payload);
      
 // 2. إعداد الـ Headers مرة واحدة
    const config = {
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${CustomerToken}`
      }
    };

    try {
      // --- الخطوة الأولى: تأكيد الدفع ---
      const confirmResponse = await axios.post(
        `${server}/agentApiConfirmRequest-fast`,
        { RequestId, transId, otp },
        config
      );
      console.log("✅ ConfirmPayment Response:", confirmResponse.data);
       // إرجاع النتيجة النهائية
      return confirmResponse.data;

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
  const PaymentPaySliceMahafathati = createSlice({
    name: 'payment',
    initialState,
    // 1. الـ Reducers العادية (لتصفير الحالة مثلاً عند الخروج من الصفحة)
  reducers: {
       // دالة لتصفير حالات الدفع
    resetPaymentStatus: (state) => {
            // 1. إخفاء جميع أنواع المودالات
    state.showTrCodeMahafatimodalstate = false;
    state.showTrCodeMahafatiFastmodalstate = false;
    //state.showTrCodeCashmodalstate = false; // إذا كان موجوداً لديك

    // 2. تصفير بيانات العملية
    state.transNo = null;
    state.RequestId = null;
    state.transactionCashRef = null;

    // 3. تصفير رسائل الحالة والخطأ
    state.paymentState = null;
    state.cashpayMESSAGEDESC = null;
    state.error = false;
    
    // 4. تصفير مؤشرات النجاح والتحميل
    state.isLoading = false;
    state.isSuccess = null;
    state.paymentSuccess = false;
    console.log("🔄 تم إعادة تعيين جميع حالات الدفع بنجاح");

        },
  },
    // 2. الـ ExtraReducers للتعامل مع الـ Async Thunk
    extraReducers: (builder) => {
        builder
// 1. حالة الانتظار
      .addCase(payByMahafatiPay.pending, (state) => {
        state.isLoading = true; // يفضل إضافة loading state
        state.error = null;
        //state.isSuccess = null;
        state.cashpayMESSAGEDESC = 'جارٍ الاتصال ببوابة محفظتي...';
        state.paymentSuccess = false;
        state.showTrCodeMahafatimodalstate = false;
        state.showTrCodeMahafatiFastmodalstate= false;
        state.paymentState = 'pending';
        })
    // 2. حالة نجاح الاتصال (وصل رد من السيرفر)
    .addCase(payByMahafatiPay.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.paymentState = null; // إعادة تعيين الحالة
      console.log('📡 Reducer payByMahafatiPay Received Data:', action.payload);
      // فحص كود النتيجة القادم من كاش (ResultCode)
      const resultCode = action.payload.bankResponse?.errCode;
            console.log('📡 resultCode:', resultCode);
if (resultCode == 0 || resultCode == '0') { 
  // ✅ فتح المودالات فوراً عند النجاح
       
        // تفعيل الحالتين لضمان ظهور المودال في المكون الأب
        state.showTrCodeMahafatimodalstate = true;
        state.showTrCodeMahafatiFastmodalstate = true; 

        state.cashpayMESSAGEDESC = action.payload.bankResponse.errDesc || 'تم إرسال الطلب بنجاح';
        state.paymentState = 'بانتظار التحقق من الدفع';
        
        state.RequestId = action.payload.RequestId;
        state.transNo = action.payload.bankResponse.transNo;
        //state.orderDetails = action.payload
    }

  
    else {
      
        state.showTrCodeMahafatimodalstate = false;
        state.showTrCodeMahafatiFastmodalstate = false;
        
        state.paymentState = 'فشل';
        state.cashpayMESSAGEDESC = action.payload.bankResponse?.errDesc || 'فشلت العملية';
    state.paymentSuccess = false;
    }
})
   // 3. حالة الفشل التقني (500, 404, Network Error)
      .addCase(payByMahafatiPay.rejected, (state, action) => {
         // state.isLoading = true; // يفضل إضافة loading state
          state.isLoading = false; // ⬅️ ضمان عدم تجمد الزر عند انقطاع الإنترنت
           state.error = null;
           state.isSuccess = false;
          state.paymentState = 'فشل';
          state.paymentSuccess = false;
          // تخزين رسالة الخطأ لعرضها في الواجهة لاحقاً
          // ⚠️ التصحيح هنا: action.payload هو النص الذي أرسلناه من Thunk
        state.cashpayMESSAGEDESC = action.payload || "تعذر الاتصال بالخادم";
      console.error("💥 Redux Rejected:", action.payload);
      })
           .addCase(ConfirmMahafatiPayment.pending, (state, action) => {
            state.isLoading = true;
           state.error = null;
           //state.isSuccess = false;
            //state.SignIn = false
            state.cashpayMESSAGEDESC = 'قيد تأكيد  طلب الدفع من المستخدم ...'
            state.paymentState = 'قيد تأكيد طلب الدفع'
            state.paymentSuccess = false
             state.toShoppingCart = false
            //state.showTrCodeCashmodalstate = false
            //state.showTrCodeMahafatiFastmodalstate = false;
            state.OperationStatusCashPayment = null
          })
          // --- حالة النجاح (Fulfilled) ---
      // يتم تفعيلها إذا عاد الـ Thunk ببيانات صحيحة (return response.data)
          .addCase(ConfirmMahafatiPayment.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.error = null;
            state.paymentData = action.payload; // البيانات القادمة من return statusResponse.data
                // if (action.payload.statusText = 'OK') {
               // console.log('statusText:',action.payload.data)
                //state.cashpayMESSAGEDESC = action.payload.data.rows.MESSAGEDESC
                console.log('ConfirmMahafatiPayment payload:',action.payload)
                //state.showTrCodeCashmodalstate = false
                state.showTrCodeMahafatiFastmodalstate = false;
                state.cashpayMESSAGEDESC = 'تم تاكيد طلب الدفع من المستخدم'
                state.paymentSuccess = true
                 state.toShoppingCart = true
                state.paymentState = 'تمت عملية الدفع بنجاح'
                //state.OperationStatusCashPayment = action.payload.Status
                
                //state.OperationResultCodeCashPayment = action.payload.ResultCode
                state.transNo = action.payload.bankResponse.transNo 
                state.ResultCode = action.payload.bankResponse.errCode 
                state.ThankYouPage = true 
                //state.requestIDCashref = action.payload.RequestID

              //}
          })
          // --- حالة الرفض/الفشل (Rejected) ---
      // يتم تفعيلها إذا قمنا بعمل (return rejectWithValue) داخل الـ Thunk
              .addCase(ConfirmMahafatiPayment.rejected, (state, action) => {
                state.isLoading = false; // ⬅️ ضمان عدم تجمد الزر عند انقطاع الإنترنت
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

      // ConfirmMahafatiPaymentfast
      .addCase(ConfirmMahafatiPaymentfast.pending, (state, action) => {
            state.isLoading = true;
           state.error = null;
           //state.isSuccess = false;
            //state.SignIn = false
            state.cashpayMESSAGEDESC = 'قيد تأكيد  طلب الدفع من المستخدم ...'
            state.paymentState = 'قيد تأكيد طلب الدفع'
            state.paymentSuccess = false
             state.toShoppingCart = false
            //state.showTrCodeCashmodalstate = false
            //state.showTrCodeMahafatiFastmodalstate = false;
            state.OperationStatusCashPayment = null
          })
          // --- حالة النجاح (Fulfilled) ---
      // يتم تفعيلها إذا عاد الـ Thunk ببيانات صحيحة (return response.data)
          .addCase(ConfirmMahafatiPaymentfast.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.error = null;
            state.paymentData = action.payload; // البيانات القادمة من return statusResponse.data
                // if (action.payload.statusText = 'OK') {
               // console.log('statusText:',action.payload.data)
                //state.cashpayMESSAGEDESC = action.payload.data.rows.MESSAGEDESC
                console.log('ConfirmMahafatiPayment payload:',action.payload)
                //state.showTrCodeCashmodalstate = false
                state.showTrCodeMahafatiFastmodalstate = false;
                state.cashpayMESSAGEDESC = 'تم تاكيد طلب الدفع من المستخدم'
                state.paymentSuccess = true
                 state.toShoppingCart = true
                state.paymentState = 'تمت عملية الدفع بنجاح'
                //state.OperationStatusCashPayment = action.payload.Status
                
                //state.OperationResultCodeCashPayment = action.payload.ResultCode
                state.transNo = action.payload.bankResponse.transNo 
                state.ResultCode = action.payload.bankResponse.errCode 
                state.ThankYouPage = true 
                //state.requestIDCashref = action.payload.RequestID

              //}
          })
          // --- حالة الرفض/الفشل (Rejected) ---
      // يتم تفعيلها إذا قمنا بعمل (return rejectWithValue) داخل الـ Thunk
              .addCase(ConfirmMahafatiPaymentfast.rejected, (state, action) => {
                state.isLoading = false; // ⬅️ ضمان عدم تجمد الزر عند انقطاع الإنترنت
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
  
      
      /*
      .addCase(paymentgatewaySwitch.pending, (state, action) => {
            // When data is being fetched
            //state.SignIn = false
            state.cashpayState = 'انتظر قليلاً...'
              state.gatwaypayCheckState = !state.gatwaypayCheckState

          })
          .addCase(paymentgatewaySwitch.fulfilled, (state, action) => {
                // if (action.payload.statusText = 'OK') {
               // console.log('statusText:',action.payload.data.rows)
                //state.cashpayMESSAGEDESC = action.payload.data.rows.MESSAGEDESC
                 state.cashpayState = 'خدمة الدفع  متوقفة حاليا'
            state.gatwaypayCheckState = !state.gatwaypayCheckState
          })
              .addCase(paymentgatewaySwitch.rejected, (state, action) => {
           // When data is fetched unsuccessfully
           state.cashpayState = 'خطأ في عملية تحديث حالة خدمة الدفع  '
            state.gatwaypayCheckState = !state.gatwaypayCheckState
          })
  */
          .addCase(showPayByCashonDeliveryModal.fulfilled, (state, action) => {
                state.payByCashonDeliveryModal = true 
          })
          
      .addCase(hidePayByCashonDeliveryModal.fulfilled, (state, action) => {
                state.payByCashonDeliveryModal = false 
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
          /*
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
*/
          // and provide a default case if no other handlers matched
          .addDefaultCase((state, action) => {})
      },
  })

  //dispatch(getPosts())
  // Export the reducer logic from the slice
export default PaymentPaySliceMahafathati.reducer
export const { resetPaymentStatus } = PaymentPaySliceMahafathati.actions;


