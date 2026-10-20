// components/helpers/invoiceAmount.js

// ✅ استخدام require() بدلاً من import
let tafqit;

try {
  const tafqitModule = require('tafqit');
  tafqit = tafqitModule.tafqit || tafqitModule.default || tafqitModule;
  
  if (typeof tafqit !== 'function') {
    tafqit = null;
  }
} catch (e) {
  tafqit = null;
}

// ✅ دالة احتياطية تعمل 100% بدون tafqit
const fallbackTafqit = (num, options = {}) => {
  if (num === 0) return 'صفر';
  if (!num || isNaN(num)) return '';
  
  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة',
                'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر',
                'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  
  const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  
  const hundreds = ['', 'مائة', 'مئتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة',
                    'سبعمائة', 'ثمانمائة', 'تسعمائة'];

  let result = '';
  let n = Math.abs(Math.floor(num));
  
  // مليارات
  if (n >= 1000000000) {
    const bil = Math.floor(n / 1000000000);
    if (bil === 1) result += 'مليار ';
    else if (bil === 2) result += 'ملياران ';
    else result += fallbackLessThanThousand(bil) + ' مليارات ';
    n %= 1000000000;
  }
  
  // ملايين
  if (n >= 1000000) {
    const mil = Math.floor(n / 1000000);
    if (mil === 1) result += 'مليون ';
    else if (mil === 2) result += 'مليونان ';
    else result += fallbackLessThanThousand(mil) + ' ملايين ';
    n %= 1000000;
  }
  
  // آلاف
  if (n >= 1000) {
    const thou = Math.floor(n / 1000);
    if (thou === 1) result += 'ألف ';
    else if (thou === 2) result += 'ألفان ';
    else if (thou >= 3 && thou <= 10) result += ones[thou] + ' آلاف ';
    else result += fallbackLessThanThousand(thou) + ' ألف ';
    n %= 1000;
  }
  
  // المئات والعشرات والآحاد
  if (n > 0) {
    if (result !== '') result += 'و';
    result += fallbackLessThanThousand(n);
  }
  
  // إضافة الموضوع (Subject) إذا وجد
  if (options.Subject && Array.isArray(options.Subject)) {
    const subject = options.Subject;
    let subjectForm = subject[3]; // افتراضي
    
    if (num === 1) subjectForm = subject[0];
    else if (num === 2) subjectForm = subject[1];
    else if (num >= 3 && num <= 10) subjectForm = subject[2];
    
    result = result + ' ' + subjectForm;
  }
  
  return result.trim();
};

const fallbackLessThanThousand = (n) => {
  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة',
                'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر',
                'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  
  const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  
  const hundreds = ['', 'مائة', 'مئتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة',
                    'سبعمائة', 'ثمانمائة', 'تسعمائة'];
  
  let result = '';
  
  if (n >= 100) {
    result += hundreds[Math.floor(n / 100)] + ' ';
    n %= 100;
  }
  
  if (n >= 20) {
    const ten = Math.floor(n / 10);
    const one = n % 10;
    if (one > 0) {
      result += ones[one] + ' و' + tens[ten];
    } else {
      result += tens[ten];
    }
  } else if (n > 0) {
    result += ones[n];
  }
  
  return result.trim();
};

// ✅ الدالة الرئيسية
export const amountToArabicText = (amount) => {
  if (!amount || isNaN(amount)) return '';
  
  const riyal = ["ريال سعودي", "ريالان سعوديان", "ريالات سعودية", "ريالًا سعوديًا"];
  const halala = ["هللة", "هللتان", "هللات", "هللةً"];
  
  const whole = Math.floor(amount);
  const fraction = Math.round((amount - whole) * 100);
  
  // استخدام tafqit إذا كان متاحاً، وإلا الاحتياطية
  const convertNumber = tafqit || fallbackTafqit;
  
  let text = convertNumber(whole, { Subject: riyal });
  
  if (fraction > 0) {
    text += ' و' + convertNumber(fraction, { Subject: halala });
  }
  
  return text + ' فقط لا غير';
};

export default amountToArabicText;