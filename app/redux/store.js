

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import buyerRequestsSlice from "./slices/getBuyerRequestSlice";
import CustomerAccountSlice from "./slices/CustomersSlice";
import AdminAccountSlice from "./slices/adminSlice";
import PaymentPaySlice from "./slices/payementSlice";
import basketSlice from "./slices/basketSlice";
import PaymentPaySliceMahafathati from "./slices/paymentSliceMahfathati";

const reducers = combineReducers({
  RequestsFromBuersApp: buyerRequestsSlice,
  CustomerAccount: CustomerAccountSlice,
  AdminAccount: AdminAccountSlice,
  PaymentPaySlice: PaymentPaySlice,
  PaymentPaySliceMahafathati: PaymentPaySliceMahafathati,
  basket: basketSlice,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

function makeStore() {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
        },
      }),
  });
}

export { makeStore };
export default makeStore;