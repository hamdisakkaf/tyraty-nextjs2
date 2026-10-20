// app/Providers.jsx
/*
"use client"

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import store from '../components/redux/store'
import ScrollToTop from './services/ScrollToTop'
import { HelmetProvider } from 'react-helmet-async' // أو react-helmet


const rootReducer = combineReducers({
  basket: basketSlice,
  CustomerAccount: CustomerAccountSlice,
  AdminAccount: AdminAccountSlice,
})



const persistor = persistStore(store)

export default function Providers({ children }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
    setMounted(true)
  }, [])

   if (!mounted) {
    return <div style={{ backgroundColor: '#050505', minHeight: '100vh' }} />
  }
  return (
  
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
*/
'use client'

import { useRef, useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { makeStore } from '@/redux/store'

export default function StoreProvider({ children }) {
  const storeRef = useRef(null)
  const [persistor, setPersistor] = useState(null)
  const [isClient, setIsClient] = useState(false)

  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  useEffect(() => {
    setIsClient(true)
    if (storeRef.current && !persistor) {
      setPersistor(persistStore(storeRef.current))
    }
  }, [persistor])

  if (!isClient || !persistor) {
    return <Provider store={storeRef.current}>{children}</Provider>
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}