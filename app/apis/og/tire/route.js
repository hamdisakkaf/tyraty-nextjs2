// app/api/og/tire/route.js
/**
 * ═══════════════════════════════════════════════════════════
 * Dynamic OG Image Generator for Tire Products
 * ═══════════════════════════════════════════════════════════
 * 
 * Generates professional Open Graph images combining:
 * - Product tire image
 * - Tyraty.com branding & logo
 * - Product details (brand, size, price)
 * 
 * Uses @vercel/og for server-side HTML→PNG conversion.
 */

import { ImageResponse } from '@vercel/og'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

// Brand colors
const COLORS = {
  primary: '#B85A45',
  primaryDark: '#8f402e',
  dark: '#0a0a0a',
  darkCard: '#0f0f0f',
  white: '#ffffff',
  gray: '#9ca3af',
  grayDark: '#4b5563',
  gold: '#d4a843',
  border: 'rgba(255,255,255,0.1)',
}

/**
 * Helper: Draw a circular clipped image
 */
function ProductImage({ src, alt }) {
  return (
    <div
      style={{
        display: 'flex',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${COLORS.primary}22, ${COLORS.primaryDark}33)`,
        boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Glow effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${COLORS.primary}30, transparent 70%)`,
        }}
      />
      <img
        src={src}
        alt={alt}
        style={{
          width: '85%',
          height: '85%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))',
        }}
      />
    </div>
  )
}

/**
 * Helper: Price badge
 */
function PriceBadge({ price }) {
  if (!price) return null
  
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
        padding: '16px 28px',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(184,90,69,0.4)',
      }}
    >
      <span
        style={{
          fontSize: '18px',
          color: COLORS.white,
          opacity: 0.9,
          fontWeight: 700,
        }}
      >
        السعر
      </span>
      <div
        style={{
          width: '1px',
          height: '24px',
          background: 'rgba(255,255,255,0.3)',
        }}
      />
      <span
        style={{
          fontSize: '36px',
          fontWeight: 900,
          color: COLORS.white,
          letterSpacing: '-1px',
        }}
      >
        {price}
      </span>
      <span
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: COLORS.gold,
        }}
      >
        ر.س
      </span>
    </div>
  )
}

/**
 * Helper: Feature chip
 */
function FeatureChip({ text, icon }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '10px 18px',
        borderRadius: '12px',
      }}
    >
      <span style={{ fontSize: '16px' }}>{icon}</span>
      <span
        style={{
          fontSize: '15px',
          color: COLORS.gray,
          fontWeight: 600,
        }}
      >
        {text}
      </span>
    </div>
  )
}

/**
 * GET /api/og/tire
 * Query params: brand, size, product, image, price
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const brand = searchParams.get('brand') || 'Tyraty'
    const size = searchParams.get('size') || ''
    const product = searchParams.get('product') || ''
    const image = searchParams.get('image') || 'https://tyraty.com/og-tire-default.jpg'
    const price = searchParams.get('price') || ''
    
    // Validate image URL
    const safeImageUrl = image.startsWith('http') ? image : 'https://tyraty.com/og-tire-default.jpg'
    
    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            background: `linear-gradient(145deg, #050505 0%, #0a0a0a 40%, ${COLORS.darkCard} 100%)`,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            position: 'relative',
            overflow: 'hidden',
            direction: 'rtl',
          }}
        >
          {/* ═══ Background Pattern ═══ */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(circle at 20% 50%, ${COLORS.primary}15 0%, transparent 50%),
                                radial-gradient(circle at 80% 80%, ${COLORS.primaryDark}10 0%, transparent 40%)`,
            }}
          />
          
          {/* Grid pattern overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* ═══ Left Content (Text) ═══ */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '60px 50px 60px 40px',
              position: 'relative',
              zIndex: 10,
              gap: '28px',
            }}
          >
            {/* Brand Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '10px 20px',
                borderRadius: '14px',
                alignSelf: 'flex-start',
              }}
            >
              {/* Logo circle */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 900,
                  color: COLORS.white,
                }}
              >
                T
              </div>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: COLORS.gray,
                }}
              >
                Tyraty.com
              </span>
            </div>

            {/* Product Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: COLORS.primary,
                  letterSpacing: '0.05em',
                }}
              >
                إطار {brand}
              </span>
              <h1
                style={{
                  fontSize: '52px',
                  fontWeight: 900,
                  color: COLORS.white,
                  lineHeight: 1.1,
                  margin: 0,
                  textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                  letterSpacing: '-1px',
                }}
              >
                {product}
              </h1>
            </div>

            {/* Size Display */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  background: `linear-gradient(135deg, ${COLORS.darkCard}, rgba(255,255,255,0.03))`,
                  border: '2px solid rgba(255,255,255,0.15)',
                  padding: '14px 28px',
                  borderRadius: '16px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.05)',
                }}
              >
                <span
                  style={{
                    fontSize: '32px',
                    fontWeight: 900,
                    color: COLORS.white,
                    letterSpacing: '-0.5px',
                    fontFamily: 'monospace',
                  }}
                >
                  {size}
                </span>
              </div>
              
              {/* Divider */}
              <div
                style={{
                  width: '40px',
                  height: '2px',
                  background: `linear-gradient(90deg, ${COLORS.primary}, transparent)`,
                  borderRadius: '1px',
                }}
              />
              
              <span
                style={{
                  fontSize: '15px',
                  color: COLORS.grayDark,
                  fontWeight: 600,
                }}
              >
                أصلي — ضمان originality
              </span>
            </div>

            {/* Price */}
            {price && <PriceBadge price={price} />}

            {/* Features Row */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginTop: '8px',
                flexWrap: 'wrap',
              }}
            >
              <FeatureChip text="توصيل سريع" icon="🚚" />
              <FeatureChip text="ضمان أصلي" icon="✓" />
              <FeatureChip text="فحص مجاني" icon="🔍" />
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '16px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 10px #22c55e',
                }}
              />
              <span
                style={{
                  fontSize: '14px',
                  color: COLORS.grayDark,
                  fontWeight: 600,
                }}
              >
                متوفر في المخزون — اطلب الآن
              </span>
            </div>
          </div>

          {/* ═══ Right Content (Product Image) ═══ */}
          <div
            style={{
              width: '520px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Decorative ring */}
            <div
              style={{
                position: 'absolute',
                width: '450px',
                height: '450px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                border: '1px solid rgba(184,90,69,0.1)',
              }}
            />
            
            {/* Glow behind product */}
            <div
              style={{
                position: 'absolute',
                width: '350px',
                height: '350px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${COLORS.primary}25 0%, transparent 70%)`,
                filter: 'blur(40px)',
              }}
            />
            
            <ProductImage src={safeImageUrl} alt={`${product} ${size}`} />
            
            {/* Tyraty watermark */}
            <div
              style={{
                position: 'absolute',
                bottom: '50px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '13px',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.15)',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
              }}
            >
              Tyraty.com
            </div>
          </div>

          {/* ═══ Corner Accent ═══ */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '200px',
              height: '200px',
              background: `linear-gradient(135deg, ${COLORS.primary}20, transparent 60%)`,
              borderRadius: '0 0 100% 0',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
        // emoji support
        emoji: 'fluent',
      }
    )
    
    return imageResponse
    
  } catch (error) {
    console.error('OG Image generation error:', error)
    
    // Return a simple fallback image on error
    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0a',
            color: '#B85A45',
            fontSize: '48px',
            fontWeight: 900,
          }}
        >
          Tyraty.com
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }
}