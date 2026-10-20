
export function validateValues(mobileNumberCash, cashPayCode) {
    const errors = {};
    
    // التحقق من رقم الهاتف اليمني (يجب أن يبدأ بـ 7 وينتهي بـ 9 أرقام إجمالاً)
    const yemenPhoneRegex = /^(77|73|71|70)\d{7}$/;
    
    if (!mobileNumberCash) {
        errors.mobile = "رقم الهاتف مطلوب";
    } else if (!yemenPhoneRegex.test(mobileNumberCash)) {
        errors.mobile = "يرجى إدخال رقم يمني صحيح (مثلاً: 777123456)";
    }

    // التحقق من رمز الدفع (يجب أن يكون 3 أرقام)
    if (!cashPayCode) {
        errors.code = "رمز الدفع مطلوب";
    } else if (cashPayCode.length !== 3) {
        errors.code = "الرمز يجب أن يتكون من 3 أرقام";
    }

    return errors;
};