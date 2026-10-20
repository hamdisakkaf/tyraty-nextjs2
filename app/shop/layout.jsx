"use client"

import { useSelector } from 'react-redux'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Navbar, Container, Nav, Offcanvas, Button } from 'react-bootstrap'
import { CustomerLogOut }  from '../../app/redux/slices/CustomersSlice'
import { useDispatch } from 'react-redux'
import FooterSocial from '../FooterSocial'

export default function ShopLayout({ children }) {
  const dispatch = useDispatch()
  const pathname = usePathname()
  const { SignIn, CustomerName } = useSelector((state) => state.CustomerAccount || {})

  const handleLogout = () => {
    dispatch(CustomerLogOut())
  }

  // إخفاء Navbar في صفحة checkout
  const shouldHideHeader = pathname?.startsWith('/checkout')

  const navItems = [
    { name: 'الرئيسية', link: '/' },
    { name: 'المدونة', link: '/blog' },
    { name: 'من نحن', link: '/#features' },
    { name: 'تواصل معنا', link: '/#pricing' },
  ]

  return (
    <div className="w-100 bg-[#050505]" style={{ minHeight: '100vh', backgroundColor: '#050505' }}>
      {!shouldHideHeader && (
        <Navbar fixed="top" expand="md" className="bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 py-3">
          <Container fluid className="px-4">
            <Navbar.Brand href="/" className="d-flex align-items-center gap-2">
              <img src="/لوجو تايراتي tyrate - Opject-09.svg" width="60" height="45" alt="تايراتي" />
              <span className="text-white font-light text-xl">امباير <b className="text-[#B85A45]">تايراتي</b></span>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="responsive-navbar-nav" className="border-0 bg-white/5" />
            
            <Navbar.Offcanvas id="responsive-navbar-nav" placement="end" className="bg-[#0a0a0a]">
              <Offcanvas.Header closeButton closeVariant="white">
                <Offcanvas.Title className="text-[#B85A45] font-black text-sm">تايراتي امباير • التزام وقيم</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="me-auto gap-2">
                  {navItems.map((item, idx) => (
                    <Nav.Link key={idx} as={Link} href={item.link} className="text-gray-400 hover:text-[#B85A45] font-bold text-sm px-3">
                      {item.name}
                    </Nav.Link>
                  ))}
                </Nav>
                
                {SignIn && (
                  <div className="d-flex align-items-center gap-3 mt-4 mt-md-0">
                    <div className="text-right">
                      <span className="text-white/40 text-[10px] block">مرحباً بك</span>
                      <span className="text-white font-bold text-sm">{CustomerName}</span>
                    </div>
                    <Button onClick={handleLogout} className="bg-white/5 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl px-4 py-2 text-xs font-bold">
                      خروج
                    </Button>
                  </div>
                )}
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      )}

      <main style={{ paddingTop: shouldHideHeader ? 0 : '80px' }}>
        {children}
      </main>

      <FooterSocial />
    </div>
  )
}