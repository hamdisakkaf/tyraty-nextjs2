'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CashTamkeenChangePass from '../../redux/slices/payementSlice'

const CashTamkeenChangePassword = () => {
    const dispatch = useDispatch();

    const getAdminInfo = useSelector((state) => state.AdminAccount);
    const { userToken } = getAdminInfo;

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        if (formData.newPassword !== formData.confirmPassword) {
            setStatus('error');
            setMessage('كلمة المرور الجديدة وتأكيدها غير متطابقين!');
            return;
        }

        const data = {
            newPassword: formData.newPassword,
            auth_token: userToken
        };

        try {
            dispatch(CashTamkeenChangePass(data));
            setStatus('success');
            setMessage('تم تغيير كلمة المرور بنجاح!');
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-neutral-100 p-5 font-sans" dir="rtl">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-center text-2xl font-bold mb-6 text-neutral-800">
                    تغيير كلمة المرور
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-neutral-700 font-medium text-sm">كلمة المرور الجديدة</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            minLength="6"
                            className="p-3 rounded-lg border border-neutral-300 text-base text-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-neutral-700 font-medium text-sm">تأكيد كلمة المرور الجديدة</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="p-3 rounded-lg border border-neutral-300 text-base text-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="p-3.5 bg-blue-600 text-white rounded-lg text-base font-semibold mt-2 hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
                    </button>
                </form>

                {message && (
                    <div className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${
                        status === 'error' 
                            ? 'bg-red-50 text-red-700 border border-red-200' 
                            : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CashTamkeenChangePassword;