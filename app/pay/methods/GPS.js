
// في ملف مستقل مثلاً: locationUtils.js أو داخل نفس ملف المكون
export const handleGetCurrentLocation = (formData, setFormData, setIsLocating) => {
    setIsLocating(true); // بدء التحميل

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // تصحيح الرابط ليكون صالحاً للاستخدام المباشر
                //const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                const mapUrl = `http://www.google.com/maps?q=${latitude},${longitude}`;

                setFormData(prev => ({
                    ...prev,
                    latitude: latitude,
                    longitude: longitude,
                    // وضع الرابط في حقل الشارع ليرسل لقاعدة البيانات
                    mapUrl: mapUrl,
                }));
                
                setIsLocating(false); // إنهاء التحميل بنجاح
                alert("📍 تم التقاط موقعك بدقة! سيتم إرساله مع تفاصيل العنوان.");
            },
            (error) => {
                setIsLocating(false); // إنهاء التحميل عند الخطأ
                let errorMessage = "عذراً، تأكد من تفعيل الـ GPS والسماح للمتصفح بالوصول للموقع.";
                if (error.code === 1) errorMessage = "يرجى منح إذن الوصول للموقع الجغرافي للمتصفح أولاً.";
                alert(errorMessage);
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    } else {
        setIsLocating(false);
        alert("متصفحك لا يدعم هذه الخاصية.");
    }
};