"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Badge from 'react-bootstrap/Badge'
import bcrypt from 'bcryptjs'
import { adminlogins } from '../../../app/redux/slices/adminSlice'

function AdminLogin() {
    const router = useRouter()
    const dispatch = useDispatch()
    
    const getAdminInfo = useSelector((state) => state.AdminAccount)
    const { userToken, userInfo, SignInAdmin, statusAdminLogin, permissionAdmin } = getAdminInfo
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(true)

    const secret_key = process.env.NEXT_PUBLIC_SECRET_KEY
    const hashedPassword = bcrypt.hashSync(password, '$2a$10$CwTycUXWue0Thq9StjUM0u')

    useEffect(() => {
        if (SignInAdmin) {
            console.log('adminLogin auth yes:', SignInAdmin)
            router.replace("/admin/AdminPage")
        } else {
            console.log('adminLogin auth no:', SignInAdmin)
            router.replace("/auth/adminLogin")
        }
    }, [SignInAdmin, router])

    const user = {
        email: email,
        password: password
    }

    const loginAdmin = async (e) => {
        e.preventDefault()
        try {
            dispatch(adminlogins(user))
        } catch (error) {
            console.log('dispatch(adminlogins) error:', error)
            setMsg('حصل خطأ اثناء تسجيل الدخول')
        }
    }

    return (
        <div className="MainPage">
            <div className='PostContainer'>
                <Form>
                    <Badge bg="secondary">msg:{msg}</Badge>
                    <Badge bg="secondary">userToken:{userToken}</Badge>
                    <Badge bg="secondary">userInfo:{userInfo}</Badge>
                    <Badge bg="secondary">statusAdminLogin:{statusAdminLogin}</Badge>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <FloatingLabel controlId="floatingInput" label="Email" className="mb-3">
                            <Form.Control 
                                placeholder="Email" 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <FloatingLabel controlId="floatingInput" label="password" className="mb-3">
                            <Form.Control 
                                type="password"
                                placeholder="password" 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </FloatingLabel>
                    </Form.Group>
                     
                    <Button variant="primary" type="button" onClick={loginAdmin}>
                        تسجيل الدخول
                    </Button>
                </Form>
            </div>
        </div>
    )
}

export default AdminLogin