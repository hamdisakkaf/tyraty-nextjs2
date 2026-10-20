'use client';

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams, usePathname, useRouter } from "next/navigation";
import useLocalStorage from "use-local-storage";
import { toast, ToastContainer, cssTransition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLogOut } from "../../../app/redux/slices/adminSlice";

const ControlPanelCashTamken = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const getAdminInfo = useSelector((state) => state.AdminAccount);
  const { userToken, branchId, AdminEmail, SignInAdmin, statusAdminLogin, permissionAdmin } = getAdminInfo;

  const [requestid, setRequestid] = useState('');
  const [stateRequest, setStateRequest] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [newBuerRequest, setNewBuerRequest] = useState('اعلامات الطلبات الجديدة');

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (SignInAdmin) {
      console.log('SignInAdmin yes:', SignInAdmin);
    } else {
      console.log('SignInAdmin no:', SignInAdmin);
      router.replace("/adminLogin");
    }
  }, [SignInAdmin, router]);

  // Toastify Animation
  const bounce = cssTransition({
    collapse: true,
    enter: "animate__animated animate__bounceIn",
  });

  function animateCss() {
    toast.success("مرحباً 👋, وصل طلب جديد!", {
      transition: bounce,
      autoClose: false,
      icon: "🚀"
    });
  }

  const Msg = () => (
    <div className="text-center text-neutral-500">
      <h4 className="text-lg font-semibold">{newBuerRequest}</h4>
    </div>
  );

  const notify = () => {
    toast.info(<Msg />, {
      autoClose: false,
      icon: "👍"
    });
  };

  useEffect(() => {
    dispatch(notify);
  }, [newBuerRequest, dispatch]);

  // تسجيل الخروج
  const handleLogout = () => {
    console.log('dispatch AdminLogOut:');
    dispatch(AdminLogOut());
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" dir="rtl">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      {SignInAdmin ? (
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* شريط الأزرار العلوي */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => router.push('/admin/cashTamkeenChangePassword')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              تحديث كلمة السر
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              الشاشة الرئيسية
            </button>
            <button
              onClick={() => router.push('/admin/payment-gateways-admin')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              بوابات الدفع
            </button>
          </div>

          {/* المحتوى الرئيسي */}
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col gap-2 mb-8">
              <div className="text-center text-neutral-400">
                <h4 className="text-xl font-bold text-white">
                  أهلا بك في لوحة تحكم بوابة دفع كاش تمكين
                </h4>
              </div>
              <div className="text-center">
                <h4 className="text-lg text-neutral-300">{statusAdminLogin}</h4>
              </div>
            </div>
          </div>

          {/* زر الخروج */}
          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              {SignInAdmin ? "الخروج" : "الدخول"}
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200">
            hfhffh
          </button>
        </div>
      )}
    </div>
  );
};

export default ControlPanelCashTamken;