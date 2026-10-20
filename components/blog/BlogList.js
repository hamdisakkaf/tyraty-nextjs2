"use client"

import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import Link from 'next/link'
import FeaturedPost from './FeaturedPost'
import BlogCard from './BlogCard'

export default function BlogList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  
  const server = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true' 
    ? 'http://localhost:5001' 
    : 'https://tyraty-server.onrender.com'

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${server}/getposts`)
        console.log('Posts fetched:', res.data?.length)  // debug
        setPosts(res.data || [])
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [server])

  // استخراج الأقسام الفريدة
  const categories = useMemo(() => {
    const cats = new Map()
    cats.set('all', { id: 'all', name: 'الكل', count: posts.length })
    
    posts.forEach(post => {
      const id = post.section_id || post.familyid || 'general'
      const name = post.section_name || post.familyname || 'عام'
      
      if (!cats.has(id)) {
        cats.set(id, { id, name, count: 0 })
      }
      cats.get(id).count++
    })
    
    return Array.from(cats.values())
  }, [posts])

  // فلترة المقالات
  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') return posts
    return posts.filter(post => 
      (post.section_id || post.familyid || 'general').toString() === activeCategory
    )
  }, [posts, activeCategory])

  // تقسيم المقالات
  const featured = filteredPosts[0] || null
  const recent = filteredPosts.slice(1, 5)
  const remaining = filteredPosts.slice(5)

  if (loading) return <BlogSkeleton />

  if (!posts.length) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-bold mb-4">لا توجد مقالات حالياً</h2>
        <p className="text-gray-400 mb-6">سنضيف مقالات جديدة قريباً</p>
        <Link 
          href="/" 
          className="inline-block px-6 py-3 bg-[#B85A45] rounded-xl font-bold hover:bg-[#9C4836] transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-12">
        <span className="inline-block px-4 py-1 bg-[#B85A45]/20 text-[#B85A45] rounded-full text-sm font-bold mb-4">
          Tyraty Blog
        </span>
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          مدونة <span className="text-[#B85A45]">تايراتي</span>
        </h1>
        <p className="text-gray-400 tracking-widest text-sm uppercase max-w-2xl mx-auto">
          دليلك الشامل لعالم السيارات والإطارات في اليمن
        </p>
      </header>

      {/* Categories Filter */}
      <nav className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id.toString())}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
              activeCategory === cat.id.toString()
                ? 'bg-[#B85A45] text-white shadow-lg shadow-[#B85A45]/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            {cat.name}
            <span className={`mr-2 px-2 py-0.5 rounded-full text-xs ${
              activeCategory === cat.id.toString() ? 'bg-white/20' : 'bg-white/10'
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </nav>

      {/* Featured Post */}
      {featured && <FeaturedPost post={featured} />}

      {/* Recent Posts */}
      {recent.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-1 h-8 bg-[#B85A45] rounded-full"></div>
              <h2 className="text-2xl font-bold">أحدث المقالات</h2>
            </div>
            {filteredPosts.length > 5 && (
              <span className="text-gray-500 text-sm">
                عرض {recent.length} من {filteredPosts.length} مقال
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recent.map(post => (
              <BlogCard key={post.post_id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* More Posts */}
      {remaining.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1 h-8 bg-[#B85A45] rounded-full"></div>
            <h2 className="text-2xl font-bold">المزيد من المقالات</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remaining.map(post => (
              <BlogCard key={post.post_id} post={post} variant="compact" />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="mt-20 mb-10">
        <div className="bg-gradient-to-r from-[#B85A45]/20 to-[#8f402e]/20 rounded-3xl p-8 md:p-12 text-center border border-[#B85A45]/20">
          <h3 className="text-2xl font-bold mb-4">تابع أحدث مقالاتنا</h3>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            اشترك في نشرتنا البريدية ليصلك كل جديد عن عالم السيارات والإطارات
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="بريدك الإلكتروني"
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#B85A45] flex-1"
            />
            <button className="px-6 py-3 bg-[#B85A45] rounded-xl font-bold hover:bg-[#9C4836] transition-colors">
              اشتراك
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function BlogSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="h-12 bg-white/10 rounded-lg w-1/3 mx-auto mb-4"></div>
      <div className="h-4 bg-white/10 rounded w-1/2 mx-auto mb-12"></div>
      <div className="flex justify-center gap-3 mb-10">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-10 bg-white/10 rounded-full w-24"></div>
        ))}
      </div>
      <div className="h-[400px] bg-white/5 rounded-3xl mb-8"></div>
      <div className="grid grid-cols-4 gap-6">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-64 bg-white/5 rounded-2xl"></div>
        ))}
      </div>
    </div>
  )
}