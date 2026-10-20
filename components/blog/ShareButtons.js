"use client"

import { useState } from 'react'

export default function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false)

  const platforms = [
    {
      name: 'واتساب',
      icon: '📱',
      url: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
      color: '#25D366'
    },
    {
      name: 'فيسبوك',
      icon: '📘',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: '#1877F2'
    },
    {
      name: 'تويتر',
      icon: '𝕏',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: '#000000'
    },
    {
      name: 'تليجرام',
      icon: '✈️',
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: '#0088cc'
    }
  ]

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  return (
    <div className="bg-[#0f0f0f] rounded-3xl p-8 border border-white/5">
      <h3 className="text-xl font-bold mb-6 text-center">شارك المقال</h3>
      
      <div className="flex flex-wrap justify-center gap-3">
        {platforms.map(p => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#B85A45]/30 transition-all hover:-translate-y-1"
            style={{ '--hover-color': p.color }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = p.color + '40'
              e.currentTarget.style.backgroundColor = p.color + '15'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
            }}
          >
            <span>{p.icon}</span>
            <span className="font-bold text-sm">{p.name}</span>
          </a>
        ))}
        
        <button
          onClick={copyLink}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${
            copied 
              ? 'bg-green-500/20 border-green-500/30 text-green-400' 
              : 'bg-white/5 border-white/10 hover:border-[#B85A45]/30'
          }`}
        >
          <span>{copied ? '✅' : '🔗'}</span>
          <span className="font-bold text-sm">{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
        </button>
      </div>
    </div>
  )
}