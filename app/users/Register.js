"use client";

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { registerUser } from '../redux/slices/adminSlice';

function Register() {
    const dispatch = useDispatch();
    const router = useRouter();

    const getCustomerInfo = useSelector((state) => state.AdminAccount);
    const { loading, userInfo, error, success } = getCustomerInfo;

    const isLocalhost = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';
const localhost = 'http://localhost:5000';
const remoteserver = process.env.NEXT_PUBLIC_API_URL;
const server = isLocalhost ? localhost : remoteserver;

    console.log('Current API Server:', server); // مفيد جداً للتأكد أثناء التشغيل

    // في بداية المكون
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [msg, setMsg] = useState('');

    const saveuser = async (e) => {
        e.preventDefault();
        setIsLoading(true); // 1. تفعيل التحميل وقفل الزر

        if (password !== confPassword) {
            setMsg('كلمة السر غير متطابقة');
            setIsLoading(false);
            return;
        }

        const user = {
            name: name,
            email: email,
            password: password
        };

        try {
            await dispatch(registerUser(user)).unwrap();
            setMsg('تم إنشاء الحساب بنجاح!');
            // router.push('/login');
        } catch (error) {
            const errorMessage = typeof error === 'string' ? error : 'حصل خطأ غير متوقع';
            setMsg(errorMessage);
        } finally {
            setIsLoading(false); // 2. إيقاف التحميل سواء نجح أو فشل
        }
    };

    return (
        <div data-bs-theme="light" className='bg-white'>
            <div className='PostContainer'>
                <h4>
                    <Badge bg="secondary">{msg}</Badge>
                    {error && <h2>{error}</h2>}
                </h4>
                <Link href="/userRegister">تسجيل عميل</Link>
                <Form>
                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Name"
                            className="mb-3"
                        >
                            <Form.Control 
                                type='text' 
                                placeholder="Name" 
                                onChange={(e) => setName(e.target.value)} 
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Email"
                            className="mb-3"
                        >
                            <Form.Control 
                                placeholder="Email" 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <FloatingLabel
                            controlId="floatingInput"
                            label="password"
                            className="mb-3"
                        >
                            <Form.Control 
                                placeholder="password" 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <FloatingLabel
                            controlId="floatingInput"
                            label="confPassword"
                            className="mb-3"
                        >
                            <Form.Control 
                                placeholder="password" 
                                onChange={(e) => setConfPassword(e.target.value)} 
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Button 
                        variant="primary" 
                        type="button" 
                        disabled={isLoading} 
                        onClick={saveuser}
                    >
                        {isLoading ? 'جاري التسجيل...' : 'تسجيل'}
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default Register;