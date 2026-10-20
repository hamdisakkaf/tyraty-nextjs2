export default function AuthLayout({ children }) {
  return (
    <div className="w-100 bg-[#050505]" style={{ minHeight: '100vh', backgroundColor: '#050505' }}>
      <main className="w-100 m-0" style={{ backgroundColor: '#050505' }}>
        {children}
      </main>
    </div>
  )
}