'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/navigation";
import axios from 'axios';
import { paymentgatewaySwitch } from '../redux/slices/payementSlice'

 const isLocalhost = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';
const localhost = 'http://localhost:5000';
const remoteserver = process.env.NEXT_PUBLIC_API_URL;
const server = isLocalhost ? localhost : remoteserver;

 function PaymentsGatewaysAdmin() {
    const dispatch = useDispatch();
    const router = useRouter();

    const getAdminInfo = useSelector((state) => state.AdminAccount);
    const { SignInAdmin } = getAdminInfo;
    
    const getPaymentState = useSelector((state) => state.PaymentPaySlice);
    const { cashpayState } = getPaymentState;

    const [paymentsgatways, setPaymentsgatways] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ التحقق من تسجيل الدخول
    useEffect(() => {
        if (!SignInAdmin) {
            router.push('/adminlogin');
        }
    }, [SignInAdmin, router]);

    const toggleState = async (currentActivation, paymentcard_id) => {
        const newStatus = currentActivation === 1 ? 0 : 1;

        const resultAction = await dispatch(paymentgatewaySwitch({ 
            CheckState: newStatus, 
            paymentcardid: paymentcard_id 
        }));

        if (paymentgatewaySwitch.fulfilled.match(resultAction)) {
            setPaymentsgatways(prevGateways => 
                prevGateways.map(item => 
                    item.paymentcard_id === paymentcard_id 
                    ? { ...item, activation: newStatus } 
                    : item
                )
            );
            console.log("✅ تم تحديث الواجهة بنجاح");
        } else {
            console.error("❌ فشل التحديث في السيرفر، لن يتم تغيير الزر");
        }
    };

    const fetchpaymentsgatways = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${server}/fetchpaymentsgatways`);
            console.log('responseData:', res.data);
            setPaymentsgatways(res.data);
        } catch (error) {
            console.error("Error fetching gateways:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchpaymentsgatways();
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6" dir="rtl">
            <div className="max-w-7xl mx-auto">
                {/* العنوان */}
                <div className="mb-8 border-b border-[#2a2a2a] pb-6">
                    <h1 className="text-3xl font-bold mb-2 text-white">إدارة بوابات الدفع</h1>
                    <p className="text-neutral-400 flex items-center gap-2">
                        <span>حالة كاش تمكين:</span>
                        <span className={`font-bold ${cashpayState ? 'text-[#9C4836]' : 'text-red-400'}`}>
                            {cashpayState || 'غير معروف'}
                        </span>
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9C4836]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paymentsgatways.map(item => (
                            <div 
                                key={item.paymentcard_id} 
                                className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 
                                         hover:border-[#333] hover:shadow-lg hover:shadow-[#9C4836]/5 
                                         transition-all duration-300"
                            >
                                <div className="flex flex-col items-center gap-5">
                                    {/* الشعار */}
                                    <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-[#1a1a1a] p-3 flex items-center justify-center">
                                        {/* ⚠️ أضف النطاق في next.config.js للصور الخارجية */}
                                        <img
                                            src={item.logo}
                                            alt={item.PaymentCardNameAr}
                                            width={80}
                                            height={80}
                                            className="object-contain"
                                        />
                                    </div>

                                    {/* الاسم */}
                                    <h2 className="text-xl font-bold text-center text-white">
                                        {item.PaymentCardNameAr}
                                    </h2>

                                    {/* مفتاح التبديل المخصص (بديل MUI Switch) */}
                                    <label className="relative inline-flex items-center cursor-pointer select-none">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer"
                                            checked={item.activation === 1}
                                            onChange={() => toggleState(item.activation, item.paymentcard_id)}
                                        />
                                        {/* المسار */}
                                        <div className="w-14 h-7 bg-neutral-700 peer-focus:outline-none 
                                                      peer-focus:ring-2 peer-focus:ring-[#9C4836]/50 
                                                      rounded-full peer 
                                                      peer-checked:after:-translate-x-7 
                                                      peer-checked:after:border-white 
                                                      after:content-[''] after:absolute after:top-0.5 
                                                      after:right-0.5 after:bg-white after:border-neutral-400 
                                                      after:border after:rounded-full after:h-6 after:w-6 
                                                      after:transition-all after:duration-300
                                                      peer-checked:bg-[#9C4836]">
                                        </div>
                                        <span className="mr-3 text-sm font-medium text-neutral-300">
                                            {item.activation === 1 ? 'مفعّل' : 'معطّل'}
                                        </span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* زر الرجوع */}
                <div className="mt-10 flex justify-start">
                    <button
                        onClick={() => router.push('/admin/AdminPage')}
                        className="px-6 py-3 bg-[#1a1a1a] border border-[#333] hover:border-[#9C4836] 
                                 hover:text-[#9C4836] text-neutral-300 rounded-xl transition-all duration-200 
                                 font-medium"
                    >
                        ← الرجوع للوحة التحكم
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentsGatewaysAdmin