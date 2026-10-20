import Swal from 'sweetalert2';

function showLoadingSwal ()  {
  Swal.fire({
    title: 'جاري الاتصال بالبنك...',
    html: 'يرجى عدم إغلاق النافذة لضمان أمان العملية',
    allowOutsideClick: false,
    showConfirmButton: false,
    // --- اللمسة الإمبراطورية ---
    background: '#121212', // أسود داكن جداً
    color: '#ffffff',      // نص أبيض
    backdrop: `rgba(0,0,0,0.8)`, // خلفية ضبابية معتمة
    
    // تخصيص الأيقونة أو المؤشر
    didOpen: () => {
      Swal.showLoading();
      // تخصيص لون مؤشر التحميل ليتناسب مع براند "تايراتي"
      const loader = Swal.getPopup().querySelector('.swal2-loader');
      if (loader) loader.style.borderColor = '#B85A45 transparent #B85A45 transparent';
    },

    // --- تأثير الانتقال عند الإغلاق ---
    showClass: {
      popup: 'animate__animated animate__fadeInDown' // حركة دخول سلسة
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'   // حركة خروج للأعلى بسلاسة
    }
  });
};

export default showLoadingSwal;
