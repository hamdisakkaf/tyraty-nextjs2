
 function getRatingDetails22(type, value) { // اظهار ايقونات وجمل حسب قيمة مواصفات اطار السيارة من قاعدة البيانات
  const val = value?.toUpperCase();
  
  const config = {
    TRACTION: {
      'AA': { label: 'ثبات فائق', color: '#00C853', icon: '🏆' },
      'A':  { label: 'ثبات ممتاز', color: '#4CAF50', icon: '✅' },
      'B':  { label: 'ثبات جيد', color: '#FFAB00', icon: '⚠️' },
      'C':  { label: 'ثبات مقبول', color: '#D32F2F', icon: '🛑' },
    },
    TEMPERATURE: {
      'A': { label: 'تحمل حرارة عالٍ', color: '#00C853', icon: '❄️' },
      'B': { label: 'تحمل حرارة متوسط', color: '#FFAB00', icon: '🌤️' },
      'C': { label: 'تحمل حرارة منخفض', color: '#D32F2F', icon: '🔥' },
    }
  };

  return config[type][val] || { label: 'غير محدد', color: '#9E9E9E', icon: '❓' };
};

export const getTractionData = (type, val) => {
  if (type === 'traction') {
    const map = {
       'AA': { label: 'تماسك فائق', icon: '💎', color: '#00d1b2' },
      'A':  { label: 'تماسك ممتاز', icon: '🛣️', color: '#48c774' },
      'B':  { label: 'تماسك جيد', icon: '⚠️', color: '#ffdd57' },
      'C':  { label: 'تماسك عادي', icon: '🛑', color: '#f14668' },
    }
    return map[val] || null
  }
  return null
}

export const getTreadwearBadge = (val) => {
  const num = parseInt(val)
  if (isNaN(num)) return null
  if (num >= 500) return { label: 'عمر افتراضي طويل جداً', color: '#22c55e', icon: '⭐⭐⭐' }
  if (num >= 300) return { label: 'توازن مثالي (عمر ممتاز)', color: '#3b82f6', icon: '⭐⭐' }
  return { label: ' تماسك قوي(اداء رياضي) | عادي ', icon: '🏎️', color: '#ffab00', icon: '⭐' }
}

// تصنيف الحرارة

  export const getTempData = (val) => {
  const map = {
      'A': { label: 'تحمل حرارة ممتاز ', color: '#22c55e', bg: 'bg-green-500/10', border: 'border-green-500/20', iconColor: 'text-green-400' },
      'B': { label: 'تحمل حرارة جيد', color: '#3b82f6', bg: 'bg-blue-500/10', border: 'border-blue-500/20', iconColor: 'text-blue-400' },
      'C': { label: 'تحمل حرارة عادي', color: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/20', iconColor: 'text-amber-400' }
  }
  return map[val] || null
}
