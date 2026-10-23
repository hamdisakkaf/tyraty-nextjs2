
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { addKurimiCustomerToDB } from '../../apis/apis'
import axios from 'axios'
//const url = 'https://jsonplaceholder.typicode.com/posts'

const initialState = {
    product:null,
    Totalinvoice: null
 
  }

 const isLocalhost = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';
const localhost = 'http://localhost:5000';
const remoteserver = process.env.NEXT_PUBLIC_API_URL;
const server = isLocalhost ? localhost : remoteserver;

  // Get all the getLogin from the API
//export const getLogin = createAsyncThunk('login/getLogin', async (userdata,thunkAPI) => {
    export const postKurimiRegister = createAsyncThunk(
      //'kurimi/postKurimiRegister', 
      'customers/postKurimiRegister', 
      
      async (data,thunkAPI) => {
          console.log('register customer Customer Request:', data)
          /*
          const user = {
            SCustID: 'SCustID',
            customerName: data['customerName'],
            email: data['email'],
            CustomerZone: data['addressCity'],
            password: data['password'],
            addressCity: data['addressCity'],
            addressStreet: data['addressStreet'],
            phoneNumber: data['phoneNumber'],
          }
          */
        try {
          const res = await addKurimiCustomerToDB(data)
          return res
        } catch (e) {
          console.log('error addKurimiCustomerToDB:', e.message)
          return thunkAPI.rejectWithValue(e.message);
        }
  })

    // Get all the getLogin from the API
export const Customerlogin = createAsyncThunk(
  'login/Customerlogin', 
  async (userdata,{rejectWithValue }) => {
  console.log('getLogin userdata:', userdata['mobileNumber'] + userdata['passowrd'])
  const user = {
    mobileNumber: userdata['mobileNumber'],
    passowrd: userdata['passowrd'] 
  }
  // الاوصل الصالح مع try
 try { 
    //const res = await axios.post('https://server.alhamditires.com/Customerlogin', 
      const res = await axios.post(`${server}/Customerlogin`, 
     //await axios.post('https://api.imagemarketing.net/Customerlogin', 
      user
  )
 return res.data
  
} catch (error) {
    // return custom error message from backend if present
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  
})

export const CustomerLogOut = createAsyncThunk(
 // 'kurimi/CustomerLogOut', 
  'customers/CustomerLogOut', 
  
  async (thunkAPI) => {
      console.log('CustomerLogOut:')
     
    try {

      console.log('loginCustomer setLoginCustomer:')
     
      
    } catch (e) {
      console.log('error CustomerLogOut:')
      return null;
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
    reducers: {},
    // Add extra reducers for the asynchronous actions on the UI
    extraReducers: (builder) => {
        builder
        .addCase(postKurimiRegister.pending, (state, action) => {
            // When data is being fetched
            state.SignIn = false
            state.statusReg = '...انتظار'
          })
          .addCase(postKurimiRegister.fulfilled, (state, action) => {
            state.statusReg = 'تم تسجيل حسابك بنجاح'

          })
          .addCase(postKurimiRegister.rejected, (state, action) => {
           // When data is fetched unsuccessfully
                state.status = 'خطأ في تسجيل حسابك، قد يكون رقم تلفونك او ايميلك مسجل من قبل!!'
                state.SignIn = false
                state.errorReg = true
          })
          .addCase(Customerlogin.pending, (state, action) => {
            // When data is being fetched
            //state.SignIn = false
            state.statusLogin = '...انتظار'
          })
          .addCase(Customerlogin.fulfilled, (state, action) => {
            state.SignIn = true
            state.statusLogin = 'تم تسجيل الدخول  بنجاح'
            console.log('action.payload.Email:',action.payload.Email)
            state.CustomerEmail = action.payload.Email
            state.phoneNumber = action.payload.MobileNumber
            state.SCustID = action.payload.SCustID
            state.CustomerId = action.payload.CustomerId
            state.CustomerName = action.payload.CustomerName
            state.AddressCity = action.payload.AddressCity
            state.AddressStreet = action.payload.AddressStreet

            
            //localStorage.setItem("customerlogin", 'true');
            //setAuth(true);
             //navigate("/HomePage", { replace: true });

          })
          .addCase(Customerlogin.rejected, (state, action) => {
           // When data is fetched unsuccessfully
                state.statusLogin = 'خطأ في تسجيل الدخول، قد يكون رقم تلفونك او ايميلك مسجل من قبل!!'
                state.SignIn = false
                state.errorLogin = true
                //localStorage.setItem("persist:root", 'false');
                //setAuth(true);
                 //navigate("/customerlogin");
          })
          .addCase(CustomerLogOut.fulfilled, (state, action) => {
            state.SignIn = false
            state.statusLogin = 'تم تسجيل الخروج  '
            
            //console.log('action.payload.Email:',action.payload.Email)
            //state.CustomerEmail = action.payload.Email
           // localStorage.setItem("loginCustomerStorage", 'false');
            //setAuth(true);
             //navigate("/HomePage", { replace: true });

          })
          .addCase(CustomerLogOut.rejected, (state, action) => {
           // When data is fetched unsuccessfully
                state.statusLogin = 'خطأ في تسجيل الخورج!'
                state.SignIn = false
                state.errorLogin = true
                
                //localStorage.setItem("loginCustomerStorage", 'false');
                //setAuth(true);
                 //navigate("/customerlogin");
          })
          
          // and provide a default case if no other handlers matched
          .addDefaultCase((state, action) => {})
      },
  })

  //dispatch(getPosts())
  // Export the reducer logic from the slice
export default CustomerAccountSlice.reducer
//export default KurimiSlice.reducer

