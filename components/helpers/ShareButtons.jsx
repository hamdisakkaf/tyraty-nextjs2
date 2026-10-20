// app/components/ShareButtons.jsx
"use client"

/**
 * ═══════════════════════════════════════════════════════════
 * Professional Social Share Buttons - Tyraty.com
 * ═══════════════════════════════════════════════════════════
 * 
 * Features:
 * - WhatsApp, Twitter/X, Facebook, Telegram sharing
 * - Copy link to clipboard with visual feedback
 * - Dynamic OG image preview modal
 * - Responsive design with smooth animations
 * - Full RTL support for Arabic interface
 * 
 * Props:
 *   url          - Page URL to share (default: current URL)
 *   title        - Share title text
 *   description  - Share description
 *   image        - Preview image URL for OG card
 *   tire_slug  - Product name
 *   tireSize     - Tire size string
 *   price        - Product price for WhatsApp message
 *   brand        - Brand name
 *   className    - Additional CSS classes
 *   layout       - 'row' | 'column' | 'compact' | 'minimal'
 *   showLabel    - Show text labels (default: true)
 *   showPreview  - Show OG preview button (default: true)
 *   sticky       - Enable sticky mobile bar (default: false)
 */

import { useState, useCallback, useEffect } from 'react'
import {
  FaWhatsapp,
  FaFacebookF,
  FaTelegramPlane,
  FaLink,
  FaCheck,
  FaShareAlt,
  FaTimes,
  FaEye,
  FaChevronUp,
} from 'react-icons/fa'
import { SiX } from 'react-icons/si'

// ═══════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════

const SITE = {
  whatsappNumber: '967784584000',
  twitterHandle: 'tyraty',
}

const BUTTONS_CONFIG = {
  whatsapp: {
    key: 'whatsapp',
    label: 'واتساب',
    shortLabel: 'واتساب',
    color: '#25D366',
    darkColor: '#128C7E',
    bg: 'rgba(37, 211, 102, 0.08)',
    border: 'rgba(37, 211, 102, 0.2)',
    hoverBg: '#25D366',
    glow: 'rgba(37, 211, 102, 0.3)',
    Icon: FaWhatsapp,
  },
  twitter: {
    key: 'twitter',
    label: 'X / تويتر',
    shortLabel: 'X',
    color: '#e7e9ea',
    darkColor: '#d1d3d4',
    bg: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.12)',
    hoverBg: '#e7e9ea',
    glow: 'rgba(255, 255, 255, 0.2)',
    textOnHover: '#000000',
    Icon: SiX,
  },
  facebook: {
    key: 'facebook',
    label: 'فيسبوك',
    shortLabel: 'فيسبوك',
    color: '#1877F2',
    darkColor: '#0d65d9',
    bg: 'rgba(24, 119, 242, 0.08)',
    border: 'rgba(24, 119, 242, 0.2)',
    hoverBg: '#1877F2',
    glow: 'rgba(24, 119, 242, 0.3)',
    Icon: FaFacebookF,
  },
  telegram: {
    key: 'telegram',
    label: 'تيليجرام',
    shortLabel: 'تيليجرام',
    color: '#26A5E4',
    darkColor: '#1d8dc5',
    bg: 'rgba(38, 165, 228, 0.08)',
    border: 'rgba(38, 165, 228, 0.2)',
    hoverBg: '#26A5E4',
    glow: 'rgba(38, 165, 228, 0.3)',
    Icon: FaTelegramPlane,
  },
}

const COPY_CONFIG = {
  key: 'copy',
  label: 'نسخ الرابط',
  labelSuccess: 'تم النسخ!',
  color: '#d4a843',
  darkColor: '#c49a3b',
  bg: 'rgba(212, 168, 67, 0.08)',
  border: 'rgba(212, 168, 67, 0.2)',
  hoverBg: '#d4a843',
  glow: 'rgba(212, 168, 67, 0.3)',
  Icon: FaLink,
}

// ═══════════════════════════════════════════════════════════
// URL Builders
// ═══════════════════════════════════════════════════════════

function getShareUrl(platform, { url, title, tire_slug, tireSize, price, brand }) {
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)
  
  switch (platform) {
    case 'whatsapp': {
      const text = `🛞 إطار *${brand}* — *${tire_slug}*\n📏 المقاس: *${tireSize}*${price ? `\n💰 السعر: *${price}* ر.س` : ''}\n\n🔗 ${url}`
      return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`
    }
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${u}&text=${t}&via=${SITE.twitterHandle}`
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${u}`
    case 'telegram':
      return `https://t.me/share/url?url=${u}&text=${t}`
    default:
      return url
  }
}

// ═══════════════════════════════════════════════════════════
// Sub-Components
// ═══════════════════════════════════════════════════════════

function ShareBtn({ config, href, onClick, showLabel, children }) {
  const [hovered, setHovered] = useState(false)
  const isTwitter = config.key === 'twitter'
  
  const textColor = hovered
    ? (config.textOnHover || '#ffffff')
    : config.color

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 select-none"
      style={{
        background: hovered ? config.hoverBg : config.bg,
        borderColor: hovered ? config.hoverBg : config.border,
        boxShadow: hovered ? `0 4px 20px ${config.glow}` : 'none',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* Glow background */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${config.color}15, transparent 70%)`,
        }}
      />
      
      {children || (
        <>
          <config.Icon
            className="relative z-10 text-base transition-transform duration-300 group-hover:scale-110"
            style={{ color: textColor }}
          />
          {showLabel && (
            <span
              className="relative z-10 text-xs font-bold transition-colors duration-300"
              style={{ color: textColor }}
            >
              {config.shortLabel}
            </span>
          )}
        </>
      )}
    </a>
  )
}

function CopyBtn({ url, showLabel }) {
  const [copied, setCopied] = useState(false)
  const c = COPY_CONFIG

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const el = document.createElement('input')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }, [url])

  return (
    <button
      onClick={handleCopy}
      className="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300"
      style={{
        background: copied ? 'rgba(34, 197, 94, 0.12)' : c.bg,
        borderColor: copied ? 'rgba(34, 197, 94, 0.35)' : c.border,
        boxShadow: copied ? '0 4px 20px rgba(34, 197, 94, 0.2)' : 'none',
        transform: 'translateY(0)',
      }}
    >
      {copied ? (
        <FaCheck className="relative z-10 text-sm" style={{ color: '#22c55e' }} />
      ) : (
        <c.Icon className="relative z-10 text-sm" style={{ color: c.color }} />
      )}
      {showLabel && (
        <span
          className="relative z-10 text-xs font-bold"
          style={{ color: copied ? '#22c55e' : c.color }}
        >
          {copied ? c.labelSuccess : c.label}
        </span>
      )}
      
      {/* Copied tooltip */}
      {copied && (
        <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap animate-fade-in">
          تم النسخ
        </span>
      )}
    </button>
  )
}

function PreviewModal({ open, onClose, url, title, description, image }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" />
      
      <div
        className="relative bg-[#0f0f0f] border border-white/10 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #B85A45, #8f402e)' }}
            >
              T
            </div>
            <h3 className="text-white font-bold">معاينة المشاركة</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* OG Card Simulation */}
        <div className="p-5 space-y-4">
          {/* Facebook-style preview */}
          <div className="bg-[#0a0a0a] border border-white/8 rounded-xl overflow-hidden">
            {image && (
              <div className="relative h-52 bg-gradient-to-br from-[#B85A45]/10 via-transparent to-[#0a0a0a] flex items-center justify-center">
                <img src={image} alt={title} className="w-full h-full object-contain p-6 drop-shadow-2xl" />
              </div>
            )}
            <div className="p-4 space-y-1.5">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">tyraty.com</p>
              <p className="text-white text-sm font-bold leading-snug line-clamp-2">{title}</p>
              <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{description}</p>
            </div>
          </div>

          {/* URL */}
          <div className="p-3 bg-black/40 rounded-xl border border-white/5">
            <p className="text-gray-600 text-[10px] font-bold mb-1">الرابط المشترك:</p>
            <p className="text-[#B85A45] text-xs font-mono truncate">{url}</p>
          </div>

          {/* Platform note */}
          <p className="text-gray-600 text-[10px] text-center leading-relaxed">
            ستظهر هذه المعاينة عند مشاركة الرابط على واتساب، فيسبوك، تويتر، وتيليجرام
          </p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════

export default function ShareButtons({
  url,
  title,
  description,
  image,
  tire_slug,
  tireSize,
  price,
  brand,
  className = '',
  layout = 'row',
  showLabel = true,
  showPreview = true,
  showTitle = true,
  sticky = false,
}) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [stickyVisible, setStickyVisible] = useState(false)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareTitle = title || (tire_slug && tireSize ? `${tire_slug} ${tireSize}` : 'إطار سيارات من Tyraty.com')
  const shareDesc = description || 'اكتشف أفضل الإطارات بأفضل الأسعار مع ضمان الأصالة والتوصيل السريع'

  // Scroll handler for sticky bar
  useEffect(() => {
    if (!sticky) return
    const onScroll = () => setStickyVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [sticky])

  const handleShare = useCallback(
    (platform) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'share', {
          method: platform,
          content_type: 'tire_product',
          item_id: tire_slug || '',
          brand: brand || '',
        })
      }
    },
    [tire_slug, brand]
  )

  const config = { url: shareUrl, title: shareTitle, tire_slug, tireSize, price, brand }

  // ── Layout variations ──
  if (layout === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`} dir="rtl">
        <ShareBtn config={BUTTONS_CONFIG.whatsapp} href={getShareUrl('whatsapp', config)} onClick={() => handleShare('whatsapp')} showLabel={false}>
          <FaWhatsapp className="text-lg" style={{ color: '#25D366' }} />
        </ShareBtn>
        <CopyBtn url={shareUrl} showLabel={false} />
      </div>
    )
  }

  if (layout === 'compact') {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`} dir="rtl">
        <div className="flex items-center gap-1.5 px-3 py-2 bg-white/3 rounded-lg border border-white/6">
          <FaShareAlt size={11} className="text-[#B85A45]" />
          <span className="text-gray-400 text-[11px] font-bold">شارك:</span>
        </div>
        {['whatsapp', 'twitter', 'facebook'].map((key) => (
          <ShareBtn key={key} config={BUTTONS_CONFIG[key]} href={getShareUrl(key, config)} onClick={() => handleShare(key)} showLabel={false} />
        ))}
        <CopyBtn url={shareUrl} showLabel={false} />
      </div>
    )
  }

  // ── Standard layout ──
  return (
    <>
      <div className={`${layout === 'column' ? 'flex flex-col gap-2.5' : 'flex flex-wrap items-center gap-2.5'} ${className}`} dir="rtl">
        {showTitle && (
          <div className="flex items-center gap-3 w-full mb-1">
            <div className="flex items-center gap-2 text-gray-400">
              <FaShareAlt size={12} className="text-[#B85A45]" />
              <span className="text-sm font-bold">مشاركة المنتج</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-white/10 to-transparent" />
            {showPreview && (
              <button
                onClick={() => setPreviewOpen(true)}
                className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-[#B85A45] transition-colors font-bold"
              >
                <FaEye size={10} />
                <span>معاينة</span>
              </button>
            )}
          </div>
        )}

        {Object.values(BUTTONS_CONFIG).map((btn) => (
          <ShareBtn
            key={btn.key}
            config={btn}
            href={getShareUrl(btn.key, config)}
            onClick={() => handleShare(btn.key)}
            showLabel={showLabel}
          />
        ))}

        <CopyBtn url={shareUrl} showLabel={showLabel} />
      </div>

      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        url={shareUrl}
        title={shareTitle}
        description={shareDesc}
        image={image}
      />

      {/* ── Sticky Mobile Bar ── */}
      {sticky && stickyVisible && (
        <div className="fixed bottom-0 inset-x-0 z-50 md:hidden" dir="rtl">
          <div className="bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/8 px-4 py-3.5">
            <div className="flex items-center gap-2.5 max-w-lg mx-auto">
              <a
                href={getShareUrl('whatsapp', config)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold text-sm active:scale-[0.97] transition-transform"
              >
                <FaWhatsapp size={16} />
                <span>واتساب</span>
              </a>
              <a
                href={getShareUrl('facebook', config)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-xl text-[#1877F2] active:scale-[0.97] transition-transform"
              >
                <FaFacebookF size={16} />
              </a>
              <a
                href={getShareUrl('telegram', config)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-xl text-[#26A5E4] active:scale-[0.97] transition-transform"
              >
                <FaTelegramPlane size={16} />
              </a>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-xl text-gray-400 active:scale-[0.97] transition-transform"
              >
                <FaChevronUp size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}