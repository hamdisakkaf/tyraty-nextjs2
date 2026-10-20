import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import { updateOrderStateFunction,updateOrderStateFunctionReqWoutlog, 
  undoOrderStat,saveInvoice,ConfirmeandsaveInvoice} from '../../../app/apis/billingsapi';

  // نسخ ولصق من سلة التسويق في تطبيق الاندرويد
const initialState = {
    // 1. سلة المشتريات (مصفوفة لعمل map عليها)
    basketItems: [],   // المنتجات التي يختارها العميل الآن، استخدمها عند اضافة زر "اضافة للسلة"
    // 2. تفاصيل آخر طلب ناجح (كائن لعرض الفاتورة)
    lastOrderDetails: null, 
    invoiceState: 'idle', // 'loading' | 'succeeded' | 'failed'
    statusOrder: 'idle', // 'loading' | 'succeeded' | 'failed'
    error: null,

    orderBasketlist: [], // القديم، احذفها لمن تتاكد
    orderBasketlistCashpaywotlogin: [],
    buyerRequests: [],
    brandsnamelist: [],
    localagents: [],
    buyer_id: null,
    buyerShopName: null,
    product_id: null,
    store_id: null,
    fetchProductIdQuantity: null,
    productQuantityInStore: 0,
    productquantitymaunesInstore: '',
    productQuantityItemNo: null,
    storeAddress: null,
    itemNo: null,
    product: null,
    amount:0,
    quantity: 0,
    approvedQuantity: 0,
    request_id: null,
    totalPriceForProduct: null,
    total: null,
    totalyinvoice: null,
    invoiceDate: null,
    undoProductQuantity: null,
    
    updateOrderState: '',
    errorOrder: null,
    error: null,
    loading: false,
    statusBuyerRequests: 'idle',
    errorBuyerRequests: null,
    publicEventsMessage: ''
  }

        // قارن القيمة بالنص 'true' لتتأكد
const isIsLOCALHOSTEnabled = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';

const localhost = 'http://localhost:5001'
const remoteserver = process.env.NEXT_PUBLIC_API_URL

// الآن سيعمل المنطق بشكل سليم 100%
const server = isIsLOCALHOSTEnabled ? localhost : remoteserver

//addToBasket\
/* تم نقله الى reducer  عادي لانه لا حتاج الى طلب الى السيرفر
export const addToOrder = createAsyncThunk(
  "basket/addToOrder",
  async (data,{extra }) => {
    try {
      console.log('basket/addToOrder requstProduct:',data)
     return data
    } catch (error) {
      console.error(error)
     // return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
);
*/
//addToBasket
export const addToOrderCashpaywoutlog = createAsyncThunk(
  "basket/addToOrderCashpaywoutlog",
  async (data,{extra }) => {
    try {
      console.log('basket/addToOrderCashpaywoutlog requstProduct:',data)
     return data
    } catch (error) {
      console.error(error)
     // return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
);
export const fetchproductquantityInStore = createAsyncThunk(
"basket/fetchproductquantityInStore",
async (data, thunkAPI) => {
  try {
    //console.log('basket/fetch product quantityInStore :',data)
    //const res = await axios.post('https://server.alhamditires.com/fetchproductquantity', {data})
    const res = await axios.post(`${server}/fetchproductquantity`, {data})

   // console.log('fetchproductquantityInStore result:',res.data)

    //const result = await res.data
    return  res.data

  } catch (err) {
    console.error('error basket/fetch product quantityInStore :',err)
    return err
    //return thunkAPI.rejectWithValue({ error: err.message })

  }
}
)

// Fetch brands information for brandName لظهور اسم العلامة التجارية في صفحة طلبات العملاء
export const fetchBrands = createAsyncThunk(
"basket/fetchbrands",
async (data, thunkAPI) => {
  try {
    //console.log('basket/fetch product quantityInStore :',data)
    //const res = await axios.post('https://server.alhamditires.com/fetchproductquantity', {data})
    const res = await axios.get(`${server}/fetchbrands`)

   // console.log('fetchproductquantityInStore result:',res.data)

    //const result = await res.data
    return  res.data

  } catch (err) {
    console.error('error basket/fetch fetchbrands :',err)
    return err
    //return thunkAPI.rejectWithValue({ error: err.message })

  }
}
)

// fetch Agents info for agentName  لاستخرام اسم وكيل العلامة التجارية في صفحة طلبات العملاء
export const fetchAgents = createAsyncThunk(
"basket/fetchagents",
async (data, thunkAPI) => {
  try {
    const res = await axios.get(`${server}/fetchlocalagents`)
    console.log('fetchlocalagents result:',res.data)
    return  res.data

  } catch (err) {
    console.error('error basket/fetch fetchbrands :',err)
    return err
    //return thunkAPI.rejectWithValue({ error: err.message })

  }
}
)
// convert request statebase from newRequest to Done
export const updateOrderStatues = createAsyncThunk(
  "basket/updateOrderStatues",
  async (request_id, thunkAPI) => {
    try {
      //const requstProduct = data
      console.log('basket/updateOrder requst_id:',request_id)
        const res = await updateOrderStateFunction(request_id)
        return res
    } catch (error) {
      //console.error('error updateOrder on server',error)
     // return thunkAPI.rejectWithValue({ error: error.message })
     return error
    }
  }
);
export const updateOrderStatuesforReqwoutlog = createAsyncThunk(
  "basket/updateOrderStatuesforReqwoutlog",
  async (request_id, thunkAPI) => {
    try {
      //const requstProduct = data
      console.log('basket/updateOrderStatuesforReqwoutlog requst_id:',request_id)
        const res = await updateOrderStateFunctionReqWoutlog(request_id)
        return res
    } catch (error) {
      //console.error('error updateOrder on server',error)
     // return thunkAPI.rejectWithValue({ error: error.message })
     return error
    }
  }
);
export const undoOrderState = createAsyncThunk(
  "basket/undoOrder",
  async (data, thunkAPI) => {
    console.log('req_id', data)
    try {
      //const res = await undoOrderStat(Number(data))
        const res = await undoOrderStat(data)

       return res
    } catch (error) {
      console.error('error updateOrder on server',error)
     // return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
);

export const clearOrderBasketlist = createAsyncThunk(
  "basket/clearOrderBasketlist",
  async (thunkAPI) => {
    console.log('clear Order Basketlist')
  }
)
/*
export const getStoreId = createAsyncThunk(
  "auth/getStoreId",
  async (data, thunkAPI) => {
    try {
      console.log('getStoreId:', data)
      const response = await axios
      //.post("https://server.alhamditires.com/getStoreId", 
      .post(`${server}/getStoreId`, 

       //await axios.post('https://api.imagemarketing.net/Customerlogin', 
       {data},
    )
    console.log('getStoreId successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('error getStoreId on server',error)
     // return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
);
*/
/*
export const fetchProductQuantityStore = createAsyncThunk(
  "auth/fetchProductQuantityStore",
  async (data, thunkAPI) => {
    try {
      console.log('fetchProduct Quantity Store:', data)
      const response = await axios
      .post("http://localhost:5000/fetchproductquantity", 
       //await axios.post('https://api.imagemarketing.net/Customerlogin', 
       {data},
    )
    console.log('fetchProduct Quantity successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('error fetchProduct Quantity on server',error)
     // return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
);
*/

// السابق الصالح قبل الانتقال وتجربة requestapi.js
// تعديل كمية مخزون المنتج في مخزن الفرع
export const productQuantityMaunesInStore = createAsyncThunk(
  "basket/productQuantityMaunesInStore",
  async (data, thunkAPI) => {
    try {
      console.log('productQuantityMaunesOnStore Store:', data)
      //const response = await axios.post("https://server.alhamditires.com/productQuantityMaunesInStore",  {data})
      const response = await axios.post(`${server}/productQuantityMaunesInStore`,  {data})

     
    //console.log('product Quantity MaunesOnStore successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('error productQuantityMaunesOnStore on server',error)
      return error
     // return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
);

// تعديل الكمية المطلوبة من العميل
export const updateQuantityProductInbuyerrequests = createAsyncThunk(
  "basket/updateQuantityProductInbuyerrequests",
  async (data, thunkAPI) => {
    try {
      console.log('elterQuantityProductInbuyerrequests Store:', data)
      const response = await axios
      //.post("https://server.alhamditires.com/updateQuantityProductInbuyerrequests", 
      .post(`${server}/updateQuantityProductInbuyerrequests`, 

        
       //await axios.post('https://api.imagemarketing.net/Customerlogin', 
       {data},
    )
    console.log('elter Quantity Product In buyerrequests successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('error elter Quantity Product In buyerrequests on server',error)
     // return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
);
export const save_Invoice = createAsyncThunk(
  "basket/saveInvoice",
  async (data, thunkAPI) => {
    try {
      console.log('basket/saveInvoice :', data)
     // console.log('basket/saveInvoice buyer_id :', data.buyer_id)

      //const req_id = data.request_id
      //const buyer_id = data.buyer_id
     // const Totalinvoice = data.Totalinvoice

      //const invoiceNo = data.buyer_id
        const res = await saveInvoice(data)
       // return res
    } catch (error) {
      console.error('error saveInvoice on server',error)
      return thunkAPI.rejectWithValue({ error: error.message })
    // return error
    }
  }
);

export const Confirme_and_save_Invoice = createAsyncThunk(
  "basket/Confirme_and_save_Invoice",
    async (data, thunkAPI) => {
        try {
      console.log('basket/Confirme_and_save_Invoice :', data)

        const res = await ConfirmeandsaveInvoice(data)
       // return res
    } catch (error) {
      console.error('error saveInvoice on server',error)
      return thunkAPI.rejectWithValue({ error: error.message })
    // return error
    }
    }
)

// //////////
export const undoProductQuantitySlic = createAsyncThunk(
  "auth/undoProductQuantitySlic",
  async (data, thunkAPI) => {
    console.log('undoProductQuantity data:', data);

    try {
      const response = await axios
     // .post("https://server.alhamditires.com/undoProductQuantity", 
      .post(`${server}/undoProductQuantity`, 
       
       //await axios.post('https://api.imagemarketing.net/Customerlogin', 
       {data},
    )
    console.log('undo Product Quantity successfully:', response.data);
      //return response.data
    } catch (error) {
      console.error('error undoProductQuantity on server',error)
     // return thunkAPI.rejectWithValue({ error: error.message })
    }
  }
);


/* السابق في extra rudeser
export const emptyOrderState = createAsyncThunk(
  "basket/emptyBaske",
  async (data, thunkAPI) => {
    try {

      //const requstProduct = data
      console.log('basket/emptyBasketlist :',data)
      return data
     
    } catch (error) {
      console.error('error emptyBasketlist')
     // return thunkAPI.rejectWithValue({ error: error.message })
    }
 
  }
);
*/



   export const clearBuyerRequest = createAsyncThunk(
      "basket/clearBuyerRequest",
      async (data, thunkAPI) => {
        return data
      }
    )

  const basketSlice = createSlice({
    /* The name of the slice[this will also be used as the action type string 
      in combination with the extraReducer name i.e posts/getPosts or posts/addPost] 
    */
    name: 'basket',
    // initialState: initialState[ES6 destructuring syntax]
    initialState,
    // Add reducers for the synchronous actions on the UI
    reducers: {

      // الردوسر المحدث للتعامل مع منتج واحد
    updateQuantity: (state, action) => {
      const newQty = action.payload; // نرسل الرقم الجديد مباشرة

      // التأكد من وجود طلب حالي وأن الكمية أكبر من صفر
      if (state.lastOrderDetails && newQty > 0) {
        // 1. تحديث الكمية
        state.lastOrderDetails.quantity = newQty;

        // 2. إعادة حساب الإجمالي (السعر * الكمية الجديدة)
        // ملاحظة: تأكد أن حقل price موجود في lastOrderDetails
        state.lastOrderDetails.totalPrice = state.lastOrderDetails.finalPrice * newQty;
        
        console.log(`تم تحديث الكمية إلى: ${newQty}`);
      }
    },
     // تحويل addToOrder إلى ردوسر عادي
    addToOrder: (state, action) => {
      // 1. تحديث تفاصيل الطلب الأخير بالكائن القادم من action.payload
      // نضعه ككائن مباشرة لتجنب خطأ "is not iterable"
      state.lastOrderDetails = action.payload;
      // 2. تغيير حالة الفاتورة لنجاح
      state.statusOrder = 'succeeded';
      // 3. (اختياري) تفريغ السلة بما أن الطلب انتقل للفاتورة
      state.basketItems = [];

      console.log('تم تحديث الفاتورة بنجاح عبر Reducer عادي');
    },
    // اصدار الطلب الى التنفيذ
    exportOrder: (state, action) => {
       state.statusOrder = 'successful'
            // action is inferred correctly here if using TS
             // When data is fetched successfully
             console.log('exportOrder action.payload:',action.payload)
             state.loading = false;
            state.orderBasketlist = []
             // returning a copy of orignal state 
             console.log('state.orderBasketlist befor:', state.orderBasketlist );
              state.SCustID = action.payload.customers_SCustID
            //  state.buyer_id = action.payload.buyer_id
              state.product_id = action.payload.tires_product_id
              state.request_id = action.payload.rci_id
              state.paypoints_pay_point_id = action.payload.paypoints_pay_point_id
              state.amount = action.payload.AMOUNT
              //state.productQuantityInStore = action.payload.productQuantityInStore
           //   state.approvedQuantity = action.payload.approvedQuantity
             //returning a copy of orignal state  andspreading the original state
             state.orderBasketlist = [...state.orderBasketlist];
             state.orderBasketlist = [action.payload, ...state.orderBasketlist] // new todos array
           console.log('state.orderBasketlist AFTER:', state.orderBasketlist);
          // console.log('action.payload.Totalinvoice:', action.payload.totaly);
           //state.Totalinvoice  = 0
           const amount = action.payload.AMOUNT
           const quantity = action.payload.quantity
          state.totalyinvoice = amount * quantity
    },
    // ردوسر لتفريغ البيانات عند الحاجة
    resetOrder: (state) => {
      state.lastOrderDetails = null;
      state.statusOrder = 'idle';
    },
       // ✅ reducer عادي - فوري بدون async
    emptyOrderState: (state, action) => {
      const { rci_id, totalPriceForProduct } = action.payload
      
      const index = state.orderBasketlist.findIndex(
        product => product.request_id === rci_id
      )
      
      if (index !== -1) {
        state.orderBasketlist.splice(index, 1)
      }
      
      state.totalyinvoice -= totalPriceForProduct || 0
      state.productQuantityInStore = null
    },
  },
    // Add extra reducers for the asynchronous actions on the UI
    extraReducers: (builder) => {
        builder
          .addCase(addToOrderCashpaywoutlog.pending, (state, action) => {
            // When data is being fetched
            state.statusOrder = 'loading'
           // state.requestsListitems = action.payload.requestsList
           // console.log('state.requestsListitems:',action.payload.requestsList)
          })
          .addCase(addToOrderCashpaywoutlog.fulfilled, (state, action) => {
            state.statusOrder = 'successful'
             console.log('addToOrderCashpaywoutlog action.payload:',action.payload)
             state.loading = false;
             console.log('state.orderBasketlist befor:', state.orderBasketlist );
              state.product_id = action.payload.tires_product_id 
              state.request_id = action.payload.rci_id
              state.tiresize = action.payload.tiresize 
              state.amount = action.payload.AMOUNT
              state.totalyinvoice = action.payload.totaly
              state.MobileNumber = action.payload.MobileNumber
              state.brandid = action.payload.brands_brand_id
              state.CurrencyId = action.payload.CurrencyId
              state.invoiceDate = action.payload.invoiceDate
             state.orderBasketlist = [...state.orderBasketlist];
             state.orderBasketlist = [action.payload, ...state.orderBasketlist] // new todos array
           console.log('state.orderBasketlist AFTER:', state.orderBasketlist);
            state.totalyinvoice += action.payload.totaly
           //state.Totalinvoice += action.payload.total;
          })
          .addCase(addToOrderCashpaywoutlog.rejected, (state, action) => {
           // When data is fetched unsuccessfully
                state.errorOrder = 'failed'
                state.statusOrder = 'failed'

                // Update the error message for proper error handling
                state.errorOrder = action.error.message
              console.log('state.statusOrder:',state.errorOrder)
                console.error(state.errorOrder)
          })

       .addCase(fetchBrands.pending, (state, action) => {
           //  state.brandsnamelist = [...state.brandsnamelist];
             state.brandsnamelist = []
          })
          .addCase(fetchBrands.fulfilled, (state, action) => {
              state.brandsnamelist = []
                   state.brandsnamelist = [...state.brandsnamelist];
             state.brandsnamelist = [action.payload, ...state.brandsnamelist] // new todos array
           console.log('state.brandsnamelist AFTER:', state.brandsnamelist);
              })
          .addCase(fetchBrands.rejected, (state, action) => {
           //  state.brandsnamelist = [...state.brandsnamelist];
          })     
       .addCase(fetchAgents.pending, (state, action) => {
           //  state.brandsnamelist = [...state.brandsnamelist];
             state.localagents = []
          })
          .addCase(fetchAgents.fulfilled, (state, action) => {
             state.localagents = []
                   state.localagents = [...state.localagents];
             state.localagents = [action.payload, ...state.localagents] // new todos array
           console.log('state.fetchAgents AFTER:', state.localagents);
              })
          .addCase(fetchAgents.rejected, (state, action) => {
           //  state.brandsnamelist = [...state.brandsnamelist];
          })
          .addCase(updateOrderStatues.pending, (state, action) => {
            state.updateOrderState = 'updateOrderStatues pending...'
          })
          .addCase(updateOrderStatues.fulfilled, (state, action) => {
            state.updateOrderState = 'updateOrderStatues fulfilled'
              })
          .addCase(updateOrderStatues.rejected, (state, action) => {
            state.updateOrderState = 'updateOrderStatues rejected'
          })

    .addCase(updateOrderStatuesforReqwoutlog.pending, (state, action) => {
            state.updateOrderState = 'updateOrderStatuesforReqwoutlog pending...'
          })
          .addCase(updateOrderStatuesforReqwoutlog.fulfilled, (state, action) => {
            state.updateOrderState = 'updateOrderStatuesforReqwoutlog fulfilled'
              })
          .addCase(updateOrderStatuesforReqwoutlog.rejected, (state, action) => {
            state.updateOrderState = 'updateOrderStatuesforReqwoutlog rejected'

          })
          .addCase(fetchproductquantityInStore.pending, (state, action) => {
            state.fetchProductIdQuantity = 'جاري احضار كمية مخزون المنتج...'
          })
          
          .addCase(fetchproductquantityInStore.fulfilled, (state, action) => {
            console.log('fetchproductquantityInStore fullfied action.payload:', action.payload)
            state.fetchProductIdQuantity = action.payload.id
            //state.publicEventsMessage = action.payload.quantity
            state.productQuantityInStore = action.payload.quantity
          })
          
          .addCase(fetchproductquantityInStore.rejected, (state, action) => {
            state.publicEventsMessage= 'خطأ في محاولة جلب الكمية من المخزون!!'
            state.productQuantityInStore = null
            state.error = action.error.message
          })
          
          /*
          .addCase(emptyOrderState.pending, (state, action) => {
            console.log('emptyOrderState pending')
            state.productQuantityInStore = null

            // حذف صنف من الفاتورة
          
           })
           .addCase(emptyOrderState.rejected, (state, action) => {
            console.log('emptyOrderState rejected')
            // حذف صنف من الفاتورة
          
           })
          .addCase(emptyOrderState.fulfilled, (state, action) => {
            const tot = action.payload.totalPriceForProduct
            console.log('emptyOrderState fulfilled action.payload:',action.payload)
            const index = state.orderBasketlist.findIndex(product => product.request_id === action.payload.rci_id);
            if (index !== -1) {
              //state.totalPrice -= state.orderBasketlist[index].price;
              state.orderBasketlist.splice(index, 1);
            }
            state.totalyinvoice -= tot;
            //state.productQuantityInStore = null
            //state.Totalinvoice = 0
           })
           */
           /*
           .addCase(getStoreId.fulfilled, (state, action) => {
            const storeid = action.payload.storeid
            const storeAddress = action.payload.storeAddress

            //console.log('getStoreId fulfilled storeid:',storeid)
            //console.log('getStoreId fulfilled storeAddress:',storeAddress)

            //console.log('getStoreId fulfilled action.payload:',action.payload)
          
            state.store_id = storeid;
            state.storeAddress = storeAddress
            //state.Totalinvoice = null
           })
           */
           /*
           .addCase(fetchProductQuantityStore.pending, (state,action) => {
            //state.productQuantityInStore = null;
            state.publicEventsMessage = 'جاري التأكد من المخزن'
           })
           .addCase(fetchProductQuantityStore.fulfilled, (state, action) => {
            //state.productQuantityInStore = null
           // if (action.payload.length == 0) {
              //state.productQuantityInStore = 0;

           // } else {
              const ProductQuantityStore = action.payload[0].quantity

              console.log('ProductQuantityStore fulfilled ProductQuantityStore:',ProductQuantityStore)

              console.log('ProductQuantityStore fulfilled action.payload:',action.payload)
            
              state.productQuantityInStore = ProductQuantityStore;
              state.publicEventsMessage = 'تم جلب المخزن'
           // }
          
            //state.Totalinvoice = null
           })
           */
           .addCase(save_Invoice.pending, (state, action) => {
            console.log('save invoice pending')
            state.invoiceState = 'جاري طباعة الفاتورة - انتظر قليلاً...'
            //state.Totalinvoice -= tot;
            //state.Totalinvoice = null
           })
           .addCase(save_Invoice.rejected, (state, action) => {
            console.log('save_Invoice error:', action.payload)
       
            state.invoiceState = 'خطأ في حفظ الفاتورة'
            //state.Totalinvoice -= tot;
            //state.Totalinvoice = null
           })
           .addCase(save_Invoice.fulfilled, (state, action) => {
           
             console.log('save_Invoice success:', action.payload)
            console.log('save_Invoice success')
            state.invoiceState = 'تم حفظ الفاتورة بنجاح'
           })
           
            .addCase(Confirme_and_save_Invoice.pending, (state, action) => {
            console.log('Confirme_and_save_Invoice pending')
            state.invoiceState = 'جاري تأكيد الطلب - انتظر قليلاً...'
            //state.Totalinvoice -= tot;
            //state.Totalinvoice = null
           })
           .addCase(Confirme_and_save_Invoice.rejected, (state, action) => {
            console.log('save_Invoice error:', action.payload)
       
            state.invoiceState = 'خطأ في تأكيد الفاتورة'
            //state.Totalinvoice -= tot;
            //state.Totalinvoice = null
           })
           .addCase(Confirme_and_save_Invoice.fulfilled, (state, action) => {
           
             console.log('save_Invoice success:', action.payload)
            console.log('save_Invoice success')
            state.invoiceState = 'تم تأكيد الفاتورة بنجاح'
           })

           .addCase(undoProductQuantitySlic.fulfilled, (state, action) => {
            //console.log('undoProductQuantitySlic success')
            state.undoProductQuantity = 'تم اعادة الكمية الى المخزون بنجاح  '
            state.productQuantityInStore = 0;

           })
           
           .addCase(productQuantityMaunesInStore.pending, (state, action) => {
           // console.log('product Quantity Maunes In Store')
            state.productquantitymaunesInstore = '...'
            //state.productQuantityInStore = null
            //state.Totalinvoice -= tot;
            //state.Totalinvoice = null
           })
           .addCase(productQuantityMaunesInStore.rejected, (state, action) => {
           // console.log('product Quantity Maunes In Store error')
            state.productquantitymaunesInstore = 'خطأ في تعديل كمية المخزون  في مخزون الفرع '

            //state.Totalinvoice -= tot;
            //state.Totalinvoice = null
           })
           .addCase(productQuantityMaunesInStore.fulfilled, (state, action) => {
            //console.log('product Quantity Maunes In Store success')
            state.productquantitymaunesInstore = 'تم تعديل كمية مخزون المنتج في مخزن الفرع '
            //state.Totalinvoice -= tot;
            //state.Totalinvoice = null
           })
           
         .addCase(clearBuyerRequest.fulfilled, (state, action) => {
          state.buyerRequests = []
         })
         .addCase(clearOrderBasketlist.pending, (state, action) => {
          state.clearorderBasketliststate = 'جاري تفريغ سلة طلبات الشراء '
          state.orderBasketlist = []
          state.totalyinvoice = null
         })
         .addCase(clearOrderBasketlist.fulfilled, (state, action) => {
          state.orderBasketlist = []
          state.totalyinvoice = null
         })
         .addCase(clearOrderBasketlist.rejected, (state, action) => {
          state.clearorderBasketliststate = 'حدث خطأ اثناء تفريغ سلة طلبات الشراء'
          state.orderBasketlist = []
          state.totalyinvoice = null
         })
          // and provide a default case if no other handlers matched
          .addDefaultCase((state, action) => {})
      },

  })

 // const { addToOrder } = basketSlice.actions
  //dispatch(addToOrder())
  // Export the reducer logic from the slice
  export const { emptyOrderState, updateQuantity, addToOrder, exportOrder, resetOrder } = basketSlice.actions;
export default basketSlice.reducer
