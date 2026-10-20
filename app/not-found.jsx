import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center" dir="rtl">
      <h1 className="text-6xl font-black text-[#B85A45] mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-8">الصفحة غير موجودة</p>
      <Link href="/" className="bg-[#B85A45] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#9C4836] transition-colors">
        العودة للرئيسية
      </Link>
    </div>
  )
}