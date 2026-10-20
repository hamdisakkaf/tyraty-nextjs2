"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'

const Navbar = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    
    // إذا كنت تستخدم Redux للمصادقة
    // const { login, userInfo } = useSelector((state) => state.auth)

    const Logout = async () => {
        try {
            // إذا كنت تستخدم Redux للـ logout
            // dispatch(logoutAction())
            
            // أو إزالة من localStorage
            localStorage.removeItem("login")
            localStorage.removeItem("token")
            localStorage.removeItem("userInfo")
            
            // إعادة التوجيه للصفحة الرئيسية
            router.push("/")
            
        } catch (error) {
            console.log('Logout error:', error)
        }
    }

    return (
        <nav className="navbar is-light" role="navigation" aria-label="main navigation">
            <div className="container">
                <div className="navbar-brand">
                    <Link href="/" className="navbar-item">
                        {/* يمكنك وضع اللوجو هنا */}
                        <span>تايراتي</span>
                    </Link>

                    <button 
                        role="button" 
                        className="navbar-burger burger" 
                        aria-label="menu" 
                        aria-expanded="false" 
                        data-target="navbarBasicExample"
                    >
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </button>
                </div>

                <div id="navbarBasicExample" className="navbar-menu">
                    <div className="navbar-start">
                        <Link href="/" className="navbar-item">
                            Home
                        </Link>
                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                <button onClick={Logout} className="button is-light">
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar