"use client"

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useRouter } from "next/navigation"
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Container, Row, Col, Form, FloatingLabel, Button, Alert } from 'react-bootstrap'
import { ArrowLeft, Save, ImageIcon, FileText, Send } from 'lucide-react'
import Swal from 'sweetalert2'

function CreatePost() {
    const router = useRouter()
    const getAdminInfo = useSelector((state) => state.AdminAccount)
    const { adminId, SignInAdmin } = getAdminInfo

    // ✅ Next.js: environment variables
     const isLocalhost = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';
const localhost = 'http://localhost:5000';
const remoteserver = process.env.NEXT_PUBLIC_API_URL;
const server = isLocalhost ? localhost : remoteserver;

    // ✅ Next.js: useRouter بدلاً من useNavigate
    useEffect(() => {
        if (!SignInAdmin) {
            router.push('/adminlogin')
        }
    }, [SignInAdmin, router])

    const [familyid, setFamilyid] = useState('')
    const [sectionsFamely, setSectionsFamely] = useState([])
    const [title, setTitle] = useState('')
    const [readmore, setReadmore] = useState('')
    const [msg, setMsg] = useState({ type: '', text: '' })
    const [submitting, setSubmitting] = useState(false)

    const [postContent, setPostContent] = useState({
        postImageUrl: '', model: '',
        image2: '', model2: '',
        image3: '', model3: '',
        image4: '', model4: '',
        image5: '', model5: '',
        image6: '', model6: '',
        image7: '', model7: '',
        image8: '', model8: '',
        image9: '', model9: '',
        image10: '', model10: ''
    })

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'direction': 'rtl' }, { 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    }

    useEffect(() => {
        fetchSectionsFamely()
    }, [])

    const fetchSectionsFamely = async () => {
        try {
            const res = await axios.get(`${server}/fetchsectionsfamely`)
            setSectionsFamely(res.data)
        } catch (error) {
            console.error("Error fetching sections:", error)
        }
    }

    const handleInputChange = (key, value) => {
        setPostContent(prev => ({ ...prev, [key]: value }))
    }

    const emptyFields = () => {
        setTitle("")
        setReadmore("")
        setFamilyid("")
        setPostContent({
            postImageUrl: '', model: '', image2: '', model2: '', image3: '', model3: '',
            image4: '', model4: '', image5: '', model5: '', image6: '', model6: '',
            image7: '', model7: '', image8: '', model8: '', image9: '', model9: '', image10: '', model10: ''
        })
    }

    const submitPost = async (e) => {
        e.preventDefault()

        if (!title || !postContent.postImageUrl) {
            setMsg({ type: 'danger', text: 'الرجاء تعبئة العنوان والصورة الرئيسية' })
            return
        }

        setSubmitting(true)
        setMsg({ type: 'info', text: 'جاري الإرسال...' })

        const newPost = {
            adminId,
            familyid,
            title,
            readmore,
            post_text: postContent.model,
            postImage: postContent.postImageUrl,
        }

        for (let i = 2; i <= 10; i++) {
            newPost[`image${i}`] = postContent[`image${i}`]
            newPost[`post_text_image${i}`] = postContent[`model${i}`]
        }

        console.log('Sending to DB:', newPost)

        try {
            Swal.fire({
                title: 'جاري نشر المقالة ...',
                text: 'يرجى الانتظار حتى يتم النشر',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading() }
            })

            const response = await axios.post(`${server}/newpost`, newPost)

            if (response.status === 200 || response.status === 201) {
                setMsg({ type: 'success', text: 'تم إضافة البوست بنجاح ✅' })
                Swal.fire({
                    icon: 'success',
                    title: 'تم نشر المقالة بنجاح',
                    text: 'تم نشر مقالتك بنجاح، وهي منشورة في مدونة امباير تايراتي الآن',
                    timer: 3000,
                    showConfirmButton: false
                })
                emptyFields()
            }
        } catch (error) {
            setMsg({ type: 'danger', text: error.response?.data?.message || 'خطأ في النشر' })
            Swal.fire({
                icon: 'error',
                title: 'فشل عملية حفظ المقالة',
                text: typeof error === 'string' ? error : error.message,
                confirmButtonColor: '#B85A45'
            })
        } finally {
            setSubmitting(false)
        }
    }

    const handleGoBack = () => {
        router.back()
    }

    const extraSections = Array.from({ length: 9 }, (_, i) => i + 2)

    return (
        <div className="bg-[#1e1e1e] min-h-screen py-6" dir="rtl">
            <Container>
                {/* ✅ شريط الأدوات العلوي */}
                <div className="flex items-center justify-between mb-6">
                    <button 
                        onClick={handleGoBack}
                        className="flex items-center gap-2 text-[#9C4836] hover:text-[#b85a45] transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-bold">العودة</span>
                    </button>

                    <h2 className="text-white font-black text-xl flex items-center gap-2">
                        <FileText size={20} className="text-[#9C4836]" />
                        إنشاء مقالة جديدة
                    </h2>

                    <div className="w-20"></div>
                </div>

                {msg.text && (
                    <Alert variant={msg.type} className="mb-4 shadow-sm" style={{ borderRadius: '12px' }}>
                        {msg.text}
                    </Alert>
                )}

                <Form onSubmit={submitPost}>
                    <Row className="mb-4">
                        <Col md={8}>
                            <FloatingLabel label="عنوان البوست" className="mb-3">
                                <Form.Control 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    placeholder="Title"
                                    className="bg-black border-white/10 text-white"
                                />
                            </FloatingLabel>
                            <FloatingLabel label="موجز المقالة" className="mb-3">
                                <Form.Control 
                                    value={readmore} 
                                    onChange={(e) => setReadmore(e.target.value)} 
                                    placeholder="Summary"
                                    className="bg-black border-white/10 text-white"
                                />
                            </FloatingLabel>
                        </Col>
                        <Col md={4}>
                            <FloatingLabel label="القسم">
                                <Form.Select 
                                    value={familyid} 
                                    onChange={(e) => setFamilyid(e.target.value)}
                                    className="bg-black border-white/10 text-white"
                                >
                                    <option value="">-- اختر القسم --</option>
                                    {sectionsFamely.map((val) => (
                                        <option key={val.family_id} value={val.family_id}>
                                            {val.productFamilyARname}
                                        </option>
                                    ))}
                                </Form.Select>
                            </FloatingLabel>
                        </Col>
                    </Row>

                    {/* المحتوى الرئيسي */}
                    <div className="mb-5 p-4 bg-[#2B2B2B] rounded-xl border border-[#F4F1EA]/5">
                        <h4 className="mb-3 text-[#9C4836] flex items-center gap-2">
                            <ImageIcon size={18} />
                            المحتوى الرئيسي للبوست
                        </h4>
                        <Form.Control 
                            className="mb-2 bg-black border-white/10 text-white"
                            placeholder="رابط الصورة الرئيسية" 
                            value={postContent.postImageUrl}
                            onChange={(e) => handleInputChange('postImageUrl', e.target.value)} 
                        />
                        {postContent.postImageUrl && (
                            <img 
                                src={postContent.postImageUrl} 
                                alt="Main" 
                                className="mb-2 rounded-lg" 
                                style={{ maxWidth: '200px' }} 
                            />
                        )}

                        <ReactQuill 
                            theme="snow"
                            value={postContent.model}
                            onChange={(content) => handleInputChange('model', content)}
                            modules={modules}
                            placeholder="اكتب تفاصيل المحتوى الرئيسي هنا..."
                            className="bg-white rounded-lg"
                        />
                    </div>

                    <hr className="border-white/10" />

                    {/* توليد أقسام الصور الإضافية ديناميكياً */}
                    {extraSections.map((num) => (
                        <div key={num} className="mb-5 p-4 bg-[#2B2B2B] rounded-xl border border-[#F4F1EA]/5">
                            <h5 className="mb-3 text-gray-400 flex items-center gap-2">
                                <ImageIcon size={16} />
                                القسم رقم {num} (صورة + نص)
                            </h5>
                            <Form.Control 
                                className="mb-2 bg-black border-white/10 text-white"
                                placeholder={`رابط الصورة رقم ${num}`}
                                value={postContent[`image${num}`]}
                                onChange={(e) => handleInputChange(`image${num}`, e.target.value)} 
                            />
                            {postContent[`image${num}`] && (
                                <img 
                                    src={postContent[`image${num}`]} 
                                    alt={`Section ${num}`} 
                                    className="mb-2 rounded-lg" 
                                    style={{ maxWidth: '200px' }} 
                                />
                            )}

                            <ReactQuill 
                                theme="snow"
                                value={postContent[`model${num}`]}
                                onChange={(content) => handleInputChange(`model${num}`, content)}
                                modules={modules}
                                placeholder={`اكتب النص التابع للصورة رقم ${num}...`}
                                className="bg-white rounded-lg"
                            />
                        </div>
                    ))}

                    <div className="d-grid gap-2 mb-5">
                        <Button 
                            variant="primary" 
                            size="lg" 
                            type="submit"
                            disabled={submitting}
                            className="d-flex align-items-center justify-content-center gap-2"
                            style={{ 
                                backgroundColor: submitting ? '#ccc' : '#9C4836',
                                borderColor: submitting ? '#ccc' : '#9C4836',
                                cursor: submitting ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {submitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" />
                                    جاري النشر...
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    حفظ ونشر البوست
                                </>
                            )}
                        </Button>
                    </div>
                </Form>
            </Container>
        </div>
    )
}

export default CreatePost