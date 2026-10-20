"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { useParams, usePathname, useRouter } from "next/navigation"
import useLocalStorage from "use-local-storage"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Stack } from "react-bootstrap"
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Nav from 'react-bootstrap/Nav'
import Toast from 'react-bootstrap/Toast'
import { io } from 'socket.io-client'
import { 
    LayoutDashboard, 
    Users, 
    ShoppingCart, 
    CreditCard, 
    Settings, 
    LogOut, 
    Home,
    Bell,
    CheckCircle
} from 'lucide-react'

// Importing toastify module
import { Bounce, Slide, toast, ToastContainer, cssTransition } from "react-toastify"
// Import toastify css file
import "react-toastify/dist/ReactToastify.css"

import { AdminLogOut } from "../../app/redux/slices/adminSlice"

const AdminPage = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const pathname = usePathname()

    // Get the admin info from the store
    const getAdminInfo = useSelector((state) => state.AdminAccount)
    const { userToken, branchId, AdminEmail, SignInAdmin, statusAdminLogin, permissionAdmin } = getAdminInfo

    const getbuyerRequests = useSelector((state) => state.basket)
    const { orderBasketlist, store_id, storeAddress, productQuantityItemNo, productquantitymaunesInstore, fetchProductIdQuantity, productQuantityInStore, buyerRequests, updateOrderState, publicEventsMessage } = getbuyerRequests

    const [buyerShopName, setBuyerShopName] = useState('')
    const [requestid, setRequestid] = useState('')
    let [stateRequest, setStateRequest] = useState('')

    const [currentPage, setCurrentPage] = useState(1)

    // ✅ Next.js: useRouter بدلاً من useNavigate
    useEffect(() => {
        if (SignInAdmin) {
            router.push("/admin/AdminPage")
        } else {
            router.push("/auth/adminLogin")
        }
    }, [SignInAdmin, router])

    const [newBuerRequest, setNewBuerRequest] = useState('اعلامات الطلبات الجديدة')
    const [newbuyerShopName, setNewbuyerShopName] = useState('')

    // منطق التنبيهات الأصلي
    const Msg = () => (
        <div className="text-right py-2">
            <h6 className="fw-bold mb-1">📦 طلب جديد قيد الانتظار</h6>
            <p className="small mb-0 text-muted">{orderBasketlist?.tiresize || "يوجد تحديث في السلة"}</p>
        </div>
    )

    const notify = () => {
        toast.info(<Msg />, {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
        })
    }

    useEffect(() => {
        if (orderBasketlist && Object.keys(orderBasketlist).length > 0) {
            notify()
        }
    }, [orderBasketlist])

    const handleLogout = () => {
        dispatch(AdminLogOut())
    }

    // ✅ Next.js: استخدام router.push بدلاً من href في Card
    const adminActions = [
        { title: "طلبات التجزئة", href: "/admin/Cusomersretailrequests", icon: <ShoppingCart size={28} />, color: "#2d3436" },
        { title: "بوابات الدفع", href: "/admin/payment-gateways-admin", icon: <CreditCard size={28} />, color: "#2d3436" },
        { title: "كاش تمكين", href: "/admin/controlPanelcashtamken", icon: <Settings size={28} />, color: "#2d3436" },
        { title: "الشاشة الرئيسية", href: "/", icon: <Home size={28} />, color: "#636e72" },
    ]

    if (!SignInAdmin) return null

    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const reqDetaile = {
        requestid: requestid,
        buyerShopName: buyerShopName
    }

    const click = () => {
        console.log('dispatch AdminLogOut:')
        dispatch(AdminLogOut())
    }

    return (
        <Container fluid className="min-vh-screen bg-[#0f0f0f] py-4 px-md-5" dir="rtl">
            <ToastContainer />

            {/* Header / Top Bar */}
            <div className="d-flex justify-content-between align-items-center mb-5 bg-[#1a1a1a] p-3 rounded-4 border border-white/5 shadow-lg">
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-[#B85A45] p-2 rounded-3 shadow-lg shadow-[#B85A45]/20 text-white">
                        <LayoutDashboard size={24} />
                    </div>
                    <div>
                        <h5 className="text-white fw-black mb-0 alexandria-title">لوحة التحكم</h5>
                        <small className="text-gray-500 font-mono">{AdminEmail}</small>
                    </div>
                </div>

                <Button 
                    variant="link" 
                    onClick={handleLogout}
                    className="text-danger p-0 d-flex align-items-center gap-2 text-decoration-none hover:opacity-75"
                >
                    <span className="fw-bold small">تسجيل الخروج</span>
                    <LogOut size={20} />
                </Button>
            </div>

            <Row className="g-4">
                {/* Status Card */}
                <Col lg={12}>
                    <Card className="bg-[#B85A45]/5 border-[#B85A45]/20 rounded-4 overflow-hidden mb-2">
                        <Card.Body className="d-flex align-items-center justify-content-between p-4">
                            <div className="d-flex align-items-center gap-3">
                                <CheckCircle className="text-[#B85A45]" size={30} />
                                <div>
                                    <h6 className="text-[#B85A45] fw-bold mb-1 small uppercase tracking-wider">حالة النظام</h6>
                                    <div className="text-white fw-bold">{statusAdminLogin || "متصل بالخدمة"}</div>
                                </div>
                            </div>
                            <Badge bg="success" className="rounded-pill px-3 py-2">نشط الآن</Badge>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Main Action Grid */}
                {adminActions.map((action, index) => (
                    <Col xs={12} md={6} lg={4} key={index}>
                        <Card 
                            onClick={() => router.push(action.href)}
                            className="h-100 bg-[#1a1a1a] border-white/5 rounded-4 p-2 text-decoration-none group transition-all hover:border-[#B85A45]/40 hover:translate-y-[-5px]"
                            style={{ cursor: 'pointer' }}
                        >
                            <Card.Body className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
                                <div 
                                    className="mb-4 p-4 rounded-circle transition-all group-hover:scale-110 shadow-xl"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.03)', color: action.color }}
                                >
                                    {action.icon}
                                </div>
                                <h5 className="text-white fw-black mb-2">{action.title}</h5>
                                <p className="text-gray-600 small px-4">الدخول إلى إدارة وتعديل {action.title}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Footer Info */}
            <div className="mt-5 text-center border-t border-white/5 pt-4">
                <p className="text-gray-700 small mb-0">نظام إدارة تيراتي إمباير v2.0 - 2026</p>
            </div>
        </Container>
    )
}

export default AdminPage