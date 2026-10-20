'use client'

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { useRef, useState, useEffect } from 'react'
import HeaderCollapsible from './Header1'
import CreativeFooter from './FooterSocial';

// استيراد الـ Slices
import buyerRequestsSlice from '../app/redux/slices/getBuyerRequestSlice'
import CustomerAccountSlice from '../app/redux/slices/CustomersSlice'
import AdminAccountSlice from '../app/redux/slices/adminSlice'
import PaymentPaySlice from '../app/redux/slices/payementSlice'
import basketSlice from '../app/redux/slices/basketSlice'
import PaymentPaySliceMahafathati from '../app/redux/slices/paymentSliceMahfathati'

const reducers = combineReducers({
  RequestsFromBuersApp: buyerRequestsSlice,
  CustomerAccount: CustomerAccountSlice,
  AdminAccount: AdminAccountSlice,
  PaymentPaySlice: PaymentPaySlice,
  PaymentPaySliceMahafathati: PaymentPaySliceMahafathati,
  basket: basketSlice,
})

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducers)

function makeStore() {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
        },
      }),
  })
}

export default function ClientLayout({ children }) {
  const storeRef = useRef(null)
  const [persistor, setPersistor] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!storeRef.current) {
      storeRef.current = makeStore()
    }
    
    const persistorInstance = persistStore(storeRef.current)
    setPersistor(persistorInstance)
    setMounted(true)
  }, [])

  // ⬇️ loading state أثناء تهيئة Redux
  if (!mounted || !persistor) {
    return (
      <div className="pt-20 min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-[#9C4836] text-xl">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <Provider store={storeRef.current}>
      {/* ✅ كل شيء داخل Provider و PersistGate */}
      <HeaderCollapsible />
      <PersistGate 
        loading={
          <div className="pt-20 min-h-screen bg-[#1a1a1a] flex items-center justify-center">
            <div className="text-[#9C4836] text-xl">جاري التحميل...</div>
          </div>
        } 
        persistor={persistor}
      >
        <main className="pt-20 min-h-screen bg-[#1a1a1a]">
          {children}
        </main>
        <CreativeFooter />
      </PersistGate>
    </Provider>
  )
}