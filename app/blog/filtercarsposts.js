import React from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react';

const PostsGrid = ({ filtercarsposts, family }) => {
  return (
    <Row className="g-4 justify-content-center" dir="rtl">
      {filtercarsposts ? filtercarsposts.map((post) => (
        <Col key={post.id} xs={12} md={6} lg={4} xl={3}>
          <div className="group h-100">
            <Card 
              className="h-100 border-0" 
              style={{
                backgroundColor: '#0f0f0f', // أسود كربوني
                borderRadius: '2.5rem',
                overflow: 'hidden',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                position: 'relative'
              }}
              // تأثيرات التحويم البرمجية المتوافقة مع الستايل الموحد
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.borderColor = 'rgba(212, 168, 67, 0.4)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
              }}
            >
              {/* الجزء العلوي: الصورة مع التظليل الذكي */}
              <div style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
                <Card.Img 
                  variant="top" 
                  src={`${post.postImage}?w=500&fit=crop&auto=format`} 
                  alt={post.title}
                  style={{
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.7s ease'
                  }}
                  className="group-hover:scale-110"
                />
                {/* تظليل متدرج (Overlay) */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, #0f0f0f 0%, transparent 70%)'
                }} />
                
                {/* وسم المدونة Tyraty Blog */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(10px)',
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <span style={{
                    fontSize: '10px',
                    color: '#d4a843',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}>
                    Tyraty Blog
                  </span>
                </div>
              </div>

              {/* الجزء السفلي: المحتوى */}
              <Card.Body className="d-flex flex-column p-4">
                <Card.Title 
                  className="alexandria-p" 
                  style={{
                    color: '#ffffff',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    marginBottom: '1.5rem',
                    lineHeight: '1.3',
                    transition: 'color 0.3s ease'
                  }}
                >
                  {post.title}
                </Card.Title>

                <Card.Text style={{
                  color: '#9ca3af',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  marginBottom: '2rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {post.readmore}
                </Card.Text>

                {/* زر اقرأ الآن الموحد */}
                <div className="mt-auto flex items-center justify-between">
                  <Link 
                    to={`/postDetails/section/${family?.familyname}/title/${post.title}/postId/${post.id}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    style={{
                      textDecoration: 'none',
                      color: '#d4a843',
                      fontWeight: '900',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'gap 0.3s ease'
                    }}
                    className="hover:gap-4"
                  >
                    <span>اقرأ الآن</span>
                    <ArrowLeft size={16} />
                  </Link>
                  
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    <BookOpen size={18} style={{ color: '#6b7280' }} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      )) : null}
    </Row>
  );
};

export default PostsGrid;