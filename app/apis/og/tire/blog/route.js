// app/api/og/blog/route.js
import { ImageResponse } from 'next/og'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

const COLORS = {
  primary: '#B85A45',
  primaryDark: '#8f402e',
  dark: '#0a0a0a',
  darkCard: '#0f0f0f',
  white: '#ffffff',
  gray: '#9ca3af',
  grayDark: '#4b5563',
  gold: '#d4a843',
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const title = searchParams.get('title') || 'مدونة إمباير تايراتي'
    const excerpt = searchParams.get('excerpt') || ''
    const image = searchParams.get('image') || ''
    const author = searchParams.get('author') || 'إمباير تايراتي'
    const date = searchParams.get('date') || ''
    const category = searchParams.get('category') || 'مقال'
    const section = searchParams.get('section') || category

    // Validate image URL
    const safeImageUrl = image.startsWith('http') ? image : 'https://tyraty-github-io.onrender.com/assests/tyraty_logo.svg'
    
    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            background: `linear-gradient(145deg, #050505 0%, #0a0a0a 40%, ${COLORS.darkCard} 100%)`,
            fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
            position: 'relative',
            overflow: 'hidden',
            direction: 'rtl',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(circle at 20% 50%, ${COLORS.primary}15 0%, transparent 50%),
                                radial-gradient(circle at 80% 80%, ${COLORS.primaryDark}10 0%, transparent 40%)`,
            }}
          />
          
          {/* Grid pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Left Content */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '60px 50px 60px 40px',
              position: 'relative',
              zIndex: 10,
              gap: '24px',
            }}
          >
            {/* Category Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                padding: '8px 20px',
                borderRadius: '25px',
                alignSelf: 'flex-start',
                boxShadow: `0 4px 20px ${COLORS.primary}40`,
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 700, color: COLORS.white }}>
                {category}
              </span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: COLORS.white }}>
  {section} {/* ← يظهر اسم القسم */}
</span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: title.length > 50 ? '42px' : '52px',
                fontWeight: 900,
                color: COLORS.white,
                lineHeight: 1.2,
                margin: 0,
                textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                letterSpacing: '-0.5px',
              }}
            >
              {title}
            </h1>

            {/* Excerpt */}
            {excerpt && (
              <p
                style={{
                  fontSize: '20px',
                  color: COLORS.gray,
                  lineHeight: 1.6,
                  margin: 0,
                  maxWidth: '500px',
                }}
              >
                {excerpt.length > 120 ? excerpt.substring(0, 120) + '...' : excerpt}
              </p>
            )}

            {/* Author & Date */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginTop: '16px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: COLORS.white }}>
                  {author}
                </span>
                <span style={{ fontSize: '14px', color: COLORS.grayDark }}>
                  {date}
                </span>
              </div>
            </div>

            {/* Brand */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span style={{ fontSize: '14px', color: COLORS.grayDark, fontWeight: 600 }}>
                Tyraty.com
              </span>
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 8px #22c55e',
                }}
              />
              <span style={{ fontSize: '14px', color: COLORS.grayDark }}>
                مدونة إمباير تايراتي
              </span>
            </div>
          </div>

          {/* Right Image */}
          <div
            style={{
              width: '480px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              padding: '40px',
            }}
          >
            {/* Decorative ring */}
            <div
              style={{
                position: 'absolute',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            />
            
            {/* Glow */}
            <div
              style={{
                position: 'absolute',
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${COLORS.primary}20 0%, transparent 70%)`,
                filter: 'blur(40px)',
              }}
            />
            
            {/* Image Container */}
            <div
              style={{
                width: '380px',
                height: '380px',
                borderRadius: '24px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <img
                src={safeImageUrl}
                alt={title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)',
                }}
              />
            </div>
          </div>

          {/* Corner Accent */}
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
        emoji: 'fluent',
      }
    )
    
    // Add cache headers for performance
    imageResponse.headers.set(
      'Cache-Control',
      'public, immutable, no-transform, max-age=86400'
    )
    
    return imageResponse
    
  } catch (error) {
    console.error('OG Blog Image generation error:', error)
    
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
          Tyraty.com - المدونة
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }
}