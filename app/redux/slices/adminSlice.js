import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import bcrypt from 'bcryptjs'

//const url = 'https://jsonplaceholder.typicode.com/posts'
// initialize userToken from local storage
/*
const userToken = localStorage.getItem('userToken')
  ? localStorage.getItem('userToken')
  : null
*/
const initialState = {
  userInfo: null,
  userToken: null,
  success: false,
    email:null,
    //CustomerEmail:null,
    adminId: null,
    adminEmail:null,
    permissionAdmin: null,
    branchId: null,
    branchName: null,
    SignInAdmin: false,
    statusAdminLogin: 'idle',
    statusAdminReg: 'idle',
    errorAdminReg: false,
    errorAdminLogin: false,
    permissionAdminError: false,
    emailAdminError: false,
  }

  const isLocalhost = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';
const localhost = 'http://localhost:5000';
const remoteserver = process.env.NEXT_PUBLIC_API_URL;
const server = isLocalhost ? localhost : remoteserver;

console.log('Current API Server:', server); // مفيد جداً للتأكد أثناء التشغيل

 
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (user, { rejectWithValue }) => {
    try {
      // Axios يقوم بتحويل البيانات لـ JSON تلقائياً ويرمي خطأ إذا كان الرد 400 أو 500
      const response = await axios.post(`${server}/adduser`, user);
      
      return response.data;

    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
    // Get all the getLogin from the API
export const adminlogins = createAsyncThunk(
  'auth/adminlogins', 
  async (userdata,{rejectWithValue }) => {
  console.log('getLogin userdata:', userdata['email'] + userdata['passowrd'])

  // الاوصل الصالح مع try
  
      // 1. إعداد الكونفج الصحيح (دمج الهيدر مع withCredentials)
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true // توضع هنا داخل نفس الكائن
    };
  const user = {
    email: userdata['email'],
    passowrd: userdata['password'] 
  }
  //console.log('user web:', user);
    //axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await axios
      .post(`${server}/adminlogins`, 
        user,
        config,
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

export const AdminLogOut = createAsyncThunk(
 // 'kurimi/CustomerLogOut', 
  'auth/AdminLogOut', 
  async (thunkAPI) => {
      console.log('AdminLogOut:')
    try {

      console.log('AdminLogOut :')
     
      
    } catch (e) {
      console.log('error AdminLogOut:')
      return null;
    }
})

  //const KurimiSlice = createSlice({
    const AdminAccountSlice = createSlice({

    /* The name of the slice[this will also be used as the action type string 
      in combination with the extraReducer name i.e posts/getPosts or posts/addPost] 
    */
    //name: 'kurimi',
    name: 'auth',

    // initialState: initialState[ES6 destructuring syntax]
    initialState,
    // Add reducers for the synchronous actions on the UI
    reducers: {},
    // Add extra reducers for the asynchronous actions on the UI
    extraReducers: (builder) => {
        builder
        .addCase(registerUser.pending, (state, action) => {
          state.loading = true
          state.error = null
          state.statusAdminLogin = '...انتظار'
        })
        .addCase(registerUser.fulfilled, (state, action) => {
          state.loading = false
          state.success = true // registration successful
          state.statusAdminLogin = 'تم التسجيل بنجاح'
          state.success = false
        })
        .addCase(registerUser.rejected, (state, { payload }) => {
          console.log('registerUser.rejected:', payload)
          // When data is fetched unsuccessfully
        
               state.statusAdminLogin = 'خطأ في تسجيل حسابك! قد يكون رقم تلفونك او ايميلك مسجل من قبل!!'
               state.loading = false
               state.error = payload
         })
          .addCase(adminlogins.pending, (state, action) => {
            // When data is being fetched
            //state.SignIn = false
            state.statusAdminLogin = '...انتظار'
          })
          //.addCase(adminlogin.fulfilled, (state, action) => {
            .addCase(adminlogins.fulfilled, (state, { payload } ) => {
            state.SignInAdmin = true
            state.statusAdminLogin = 'تم تسجيل الدخول  بنجاح'
           console.log('state.adminEmail:', state.adminEmail)
            console.log('action.payload:', payload)
            const arrayToken = payload.auth_token.split('.');
            const tokenPayload = JSON.parse(atob(arrayToken[1]))
            console.log('arrayToken:', arrayToken)
            console.log('tokenPayload [1]:', tokenPayload.em)
              state.adminEmail = tokenPayload.em
              console.log('state.adminEmail:', state.adminEmail)
              console.log('payload.user:', payload.user)
              state.adminId = payload.user?.adminId
               
           // state.userToken = action.payload
            state.userInfo = payload.auth_token
            state.userToken = payload.auth_token

            //state.branchId = payload.rows.branchId
          })
          .addCase(adminlogins.rejected, (state, action) => {
           // When data is fetched unsuccessfully
                state.statusAdminLogin = 'خطأ في تسجيل الدخول، قد يكون رقم تلفونك او ايميلك مسجل من قبل!!'
                state.SignInAdmin = false
                state.errorAdminLogin = true
                state.userToken = null
          })
      
          .addCase(AdminLogOut.pending, (state, action) => {
            // When data is being fetched
            //state.SignIn = false
            state.statusAdminLogin = '...انتظار'
          })
          //.addCase(adminlogin.fulfilled, (state, action) => {
            .addCase(AdminLogOut.fulfilled, (state, { payload } ) => {
            state.SignInAdmin = false
            state.statusAdminLogin = 'تم تسجيل الخروج  بنجاح'
            state.userToken = null
            state.userInfo = null
        
          })
          .addCase(AdminLogOut.rejected, (state, action) => {
           // When data is fetched unsuccessfully
                state.statusAdminLogin = ' تم تسجيل الخروج'
                state.SignInAdmin = false
                state.errorAdminLogin = true
                state.userToken = null
          })
          // and provide a default case if no other handlers matched
          .addDefaultCase((state, action) => {})
      },
  })

  //dispatch(getPosts())
  // Export the reducer logic from the slice
export default AdminAccountSlice.reducer
//export default KurimiSlice.reducer

