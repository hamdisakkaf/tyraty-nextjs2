"use client"

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
//import { useIsOnline } from 'react-use-is-online';

import { addUserRegister, addUNewAdminUser }  from '../../../app/apis/apis'
//const url = 'https://jsonplaceholder.typicode.com/posts'

const initialState = {
  SignIn: false,
  CustomerToken:null,
    email:null,
    CustomerEmail:null,
    SCustID: null,
    CustomerId: null,
    CustomerZone: null,
    permission: null,
    statusAddNewAdminError: false,
  addNewAdminstate: null,
    statusLogin: '',
    statusReg: '',
    errorReg: false,
    errorLogin: false,
    permissionError: false,
    emailError: false,
    CustomerName: null, 
    AddressCity: null, 
    AddressStreet: null,
    phoneNumber: null,
    password: null,
    auth: false,
    registerlink: false,
  }

// 1. تصحيح الاسم
const isIsLOCALHOSTEnabled = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';

const localhost = 'http://localhost:5001'
const remoteserver = process.env.NEXT_PUBLIC_API_URL

// الآن سيعمل المنطق بشكل سليم 100%
const server = isIsLOCALHOSTEnabled ? localhost : remoteserver
  
  // Get all the getLogin from the API
  /*
//export const getLogin = createAsyncThunk('login/getLogin', async (userdata,thunkAPI) => {
  export const newUserRegister = createAsyncThunk(
    'users/newUserRegister',
    // نستخدم المعامل الثاني thunkAPI لاستخراج rejectWithValue
    async (user, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${server}/usersRegister`, user);
            return response.data; // نجاح
        } catch (err) {
            // هنا السحر! 🪄
            // err.response.data يحتوي على الرسالة التي أرسلها السيرفر (Code 409)
            if (err.response && err.response.data) {
                return rejectWithValue(err.response.data);
            } else {
                return rejectWithValue({ message: "Network Error" });
            }
        }
    }
);
*/
// تسجيل حساب عميل جديد
export const newUserRegister = createAsyncThunk(
    'customers/newUserRegister',
    async (user, { rejectWithValue }) => {
        console.log('Register Customer Request:', user);

        try {
            // 1. تصحيح: إضافة await ضرورية جداً!
            // بما أن addUserRegister تعيد response.data، سنستقبله هنا
            const result = await addUserRegister(user);
            
            // 2. تصحيح: إرجاع النتيجة مباشرة (لأنها مفكوكة أصلاً)
            return result; 

        } catch (err) {
            // التعامل مع الأخطاء (ممتاز كما هو)
            // err.response يأتي من مكتبة axios تلقائياً عند وجود خطأ
            if (err.response && err.response.data) {
                return rejectWithValue(err.response.data);
            } else {
                return rejectWithValue({ message: "Network Error or Server Down" });
            }
        }
    }
);

// تسجيل حساب مستخدم نظام
export const NewAdminUser = createAsyncThunk(
    'customers/NewAdminUser',
    async (user, { rejectWithValue }) => {
        console.log('New Admin User Request:', user);

        try {
            // 1. تصحيح: إضافة await ضرورية جداً!
            // بما أن addUserRegister تعيد response.data، سنستقبله هنا
            const result = await addUNewAdminUser(user);
            
            // 2. تصحيح: إرجاع النتيجة مباشرة (لأنها مفكوكة أصلاً)
            return result; 

        } catch (err) {
            // التعامل مع الأخطاء (ممتاز كما هو)
            // err.response يأتي من مكتبة axios تلقائياً عند وجود خطأ
            if (err.response && err.response.data) {
                return rejectWithValue(err.response.data);
            } else {
                return rejectWithValue({ message: "Network Error or Server Down" });
            }
        }
    }
);

export const custlogin = createAsyncThunk(
  'login/customerlogin',
  async (userdata, { rejectWithValue }) => {
    
    console.log('Login Request Data:', userdata);

    // 1. إعداد الكونفج الصحيح (دمج الهيدر مع withCredentials)
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true // توضع هنا داخل نفس الكائن
    };

    // 2. تجهيز البيانات (تصحيح الاسم إلى password)
    // تأكد أن الباك إند يستقبل "password" وليس "passowrd"
    const user = {
      mobileNumber: userdata.mobileNumber,
      password: userdata.passowrd || userdata.password // لدعم الاسمين مؤقتاً
    };

    try {
      const response = await axios.post(
        `${server}/customerlogin`,
        user,   // المتغير الثاني: البيانات
        config  // المتغير الثالث: الإعدادات كاملة
      );

      console.log('Login Success, Token:', response.data.token);
      
      // إرجاع البيانات للـ Reducer
     // return response;
         // إرجاع البيانات الكاملة للـ Reducer
      return response.data; // مهم: إرجاع data فقط وليس response كامل

    } catch (error) {
      //console.error('Login Error:', error);
console.error('Login Error Details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
          // 3. معالجة الأخطاء بشكل أفضل
      if (error.response) {
        // الخطأ من السيرفر (لديه status و data)
        const serverMessage = error.response.data?.message || 
                             error.response.data?.error || 
                             `Server Error: ${error.response.status}`;
        
        return rejectWithValue({ 
          message: serverMessage,
          status: error.response.status,
          data: error.response.data
        });
      } else if (error.request) {
        // تم إرسال الطلب ولكن لم تصل أي استجابة
        return rejectWithValue({ 
          message: "No response from server. Check your network connection.",
          status: 0
        });
      } else {
        // خطأ في إعداد الطلب
        return rejectWithValue({ 
          message: error.message || "Request configuration error",
          status: null
        });
      } 
      /*
      // 3. استخراج رسالة الخطأ بشكل دقيق
      // نفحص message و error لأن الباك إند قد يرسل أحدهما
      if (error.response && error.response.data) {
        const message = error.response.data.message || error.response.data.error || "Login Failed";
        return rejectWithValue({ message: message }); // نرجع كائناً موحداً
      } else {
        return rejectWithValue({ message: error.message || "Network Error" });
      }
      */
    }
  }
);


export const CustomerLogOut = createAsyncThunk(
 // 'kurimi/CustomerLogOut', 
  'customers/CustomerLogOut', 
  async (thunkAPI,{rejectWithValue }) => {
      console.log('CustomerLogOut:')
    try {

     // console.log('loginCustomer setLoginCustomer:')
     
      
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
})

  //const KurimiSlice = createSlice({
    const CustomerAccountSlice = createSlice({

    /* The name of the slice[this will also be used as the action type string 
      in combination with the extraReducer name i.e posts/getPosts or posts/addPost] 
    */
    //name: 'kurimi',
    name: 'customers',

    // initialState: initialState[ES6 destructuring syntax]
    initialState,
    // Add reducers for the synchronous actions on the UI
    reducers: {
      // أضف هذه الدالة لمسح الأخطاء
    resetLoginError: (state) => {
      state.errorLogin = false;
      state.statusLogin = null;
    },

    },
    // Add extra reducers for the asynchronous actions on the UI
    extraReducers: (builder) => {
        builder
        .addCase(newUserRegister.pending, (state, action) => {
             // 1. تصحيح الخطأ: لا تستخدم action.payload هنا أبداً
              state.statusReg = 'جاري التسجيل...'; // رسالة ثابتة
              state.status = 'انتظر قليلا...';
              state.SignIn = false;
              state.errorReg = null;
             
          })
   
          .addCase(newUserRegister.fulfilled, (state, action) => {
// هنا البيانات وصلت بنجاح
    state.statusReg = action.payload?.message || 'تم التسجيل بنجاح';
    state.status = 'succeeded';
    state.errorReg = false;
    state.errorLogin = false;
    // يمكنك تفعيل SignIn هنا إذا كنت تريد تسجيل دخول تلقائي بعد إنشاء الحساب
    // state.SignIn = true;

          })
    .addCase(newUserRegister.rejected, (state, action) => {
      console.log('Register Rejected Payload:', action.payload);
    // الآن action.payload سيحمل الرسالة القادمة من السيرفر
    // مثلاً: { message: "Mobile number already exists" }
    const serverMessage = action.payload?.message || "حدث خطأ في الاتصال";
    state.statusReg = serverMessage; // خزن الرسالة لعرضها في الواجهة
    state.errorReg = true;
    state.status = 'failed';
    state.SignIn = false;
 
          })
      .addCase(NewAdminUser.pending, (state, action) => {
            state.loading = true
            state.error = null
            state.addNewAdminstate = '...انتظار'
          })
          .addCase(NewAdminUser.fulfilled, (state, action) => {
            state.loading = false
            state.success = true // registration successful
            state.statusAddNewAdminError = false
            state.addNewAdminstate = 'تم التسجيل بنجاح'
            state.success = false
          })
          .addCase(NewAdminUser.rejected, (state, { payload }) => {
            console.log('addNewAdminstate.rejected:', payload.message)
            // When data is fetched unsuccessfully
                state.statusAddNewAdminError = true
                 state.addNewAdminstate = payload.message
                 state.loading = false
                 state.error = payload
           })

.addCase(custlogin.pending, (state) => {
 // When data is being fetched
   //state.SignIn = false   
  state.statusLogin = 'جاري تسجيل الدخول...';
  state.errorLogin = false;
  state.SignIn = false;
  state.CustomerToken = null;

          })
          .addCase(custlogin.fulfilled, (state, action) => {
 console.log('Full Payload:', action.payload);
  
  // تأكد من أن البيانات موجودة
  if (!action.payload) {
    state.statusLogin = 'استجابة غير صحيحة من السيرفر';
    state.errorLogin = true;
    state.SignIn = false;
    return;
  }
      // اختبار 1: إذا كانت الاستجابة بنجاح مع token
  if (action.payload.token || action.payload.CustomerToken) {
    const token = action.payload.token || action.payload.CustomerToken;
    state.CustomerToken = token;

  // حفظ التوكن في localStorage
    if (token) {
      //localStorage.setItem('customerToken', token);
       state.CustomerToken = token
    }

        // استخراج بيانات المستخدم بناءً على هيكل الاستجابة
    const user = action.payload.user.user || action.payload.data?.user || action.payload;
      if (user) {
      // التعامل مع أسماء الحقول المختلفة
      state.SCustID = user.SCustID || user.id || user.custId;
      state.CustomerId = user.SCustID || user.id;
      state.CustomerName = user.CustomerName || user.name || user.fullName;
      state.CustomerEmail = user.email || user.Email;
      state.phoneNumber = user.phoneNumber || user.mobileNumber;
      state.AddressCity = user.addressCity || user.city;
      state.AddressStreet = user.addressStreet || user.street;
    }

       state.SignIn = true;
    state.statusLogin = action.payload.message || 'تم تسجيل الدخول بنجاح';
    state.errorLogin = false;
    state.registerlink = false;
    state.status = 'succeeded';

  } //
   // اختبار 2: إذا كانت الاستجابة بنجاح ولكن بدون token
  else if (action.payload.success) {
    state.statusLogin = action.payload.message || 'تمت العملية بنجاح';
    state.SignIn = true;
    state.errorLogin = false;
  }    // اختبار 3: إذا لم يكن هناك بيانات صالحة
  else {
    state.statusLogin = 'بيانات الاستجابة غير كاملة';
    state.errorLogin = true;
    state.SignIn = false;
  }

  })
.addCase(custlogin.rejected, (state, action) => {
  console.log('Rejected Action:', action);
  
  // استخراج رسالة الخطأ من payload
  const errorMessage = action.payload?.message || 
                      action.error?.message || 
                      'حدث خطأ غير معروف';
  console.log('errorMessage:', errorMessage)
  // تحديد إذا كان الخطأ بسبب بيانات خاطئة أو مشكلة في الشبكة
  const isInvalidCredentials = errorMessage.includes('Invalid credentials') || 
                               errorMessage.includes('خطأ في تسجيل الدخول');
  
  const isServerError = errorMessage.includes('Server') || 
                        errorMessage.includes('network') ||
                        errorMessage.includes('response');
  /* السابق الصالح
  //state.statusLogin = isInvalidCredentials 
    ? 'خطأ في تسجيل الدخول، تأكد من صحة رقم الهاتف وكلمة المرور!' 
    : (isServerError 
        ? 'مشكلة في الاتصال بالسيرفر. حاول مرة أخرى لاحقاً.' 
        : errorMessage);
        */
   state.statusLogin = errorMessage ? errorMessage
   // ? 'خطأ في تسجيل الدخول، تأكد من صحة رقم الهاتف وكلمة المرور!' 
    : (isServerError 
        ? 'مشكلة في الاتصال بالسيرفر. حاول مرة أخرى لاحقاً.' 
        : errorMessage);
  state.statusReg = isInvalidCredentials ? 'لم تسجل من قبل! سجل هنا' : 'حاول مرة أخرى';
  state.SignIn = false;
  state.errorLogin = true;
  state.CustomerToken = null;
  state.registerlink = isInvalidCredentials;
  state.status = 'failed'; 
})
          .addCase(CustomerLogOut.fulfilled, (state, action) => {
            state.SignIn = false    
            state.errorLogin = false
            state.statusLogin = 'تم تسجيل الخروج'
            state.CustomerToken = null
            state.SCustID = null
            state.CustomerName = null
            state.phoneNumber = null
            state.CustomerEmail = null
            state.AddressCity = null
            state.AddressStreet = null
          })
          .addCase(CustomerLogOut.rejected, (state, action) => {
           // When data is fetched unsuccessfully
                state.statusLogin = '   خطأ في تسجيل الخروج!! تم تسجيل الخروج لحمايتك!'
                state.SignIn = false
                state.errorLogin = true
                state.CustomerToken = null
          })
          
          // and provide a default case if no other handlers matched
          .addDefaultCase((state, action) => {})
      },
  })

  //dispatch(getPosts())
  // Export the reducer logic from the slice
export default CustomerAccountSlice.reducer
export const { resetLoginError } = CustomerAccountSlice.actions;
//export default KurimiSlice.reducer

