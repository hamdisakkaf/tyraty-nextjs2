export const sendOrderToWhatsApp = ({orderDetails}) => {
    const adminPhoneNumber = "96775955150"; // ضع رقم واتساب الإدارة هنا
    
    const productInfo = `
📦 *تفاصيل طلب تايراتي:*
- المنتج: ${orderDetails?.items.productName || 'إطارات'}
- المقاس: ${orderDetails?.items.tireSize}
- الكمية: ${orderDetails?.items.quantity}
- الإجمالي: ${orderDetails?.total} ر.س (${(orderDetails?.totalAmountYE)} ريال يمني)
    `.trim();

    const customerInfo = `
👤 *بيانات العميل:*
- الاسم: ${orderDetails?.customer.name}
- المدينة: ${orderDetails?.customer.AddressCity}
- الحي: ${orderDetails?.customer.district}
- الشارع: ${orderDetails?.customer.AddressStreet}
${orderDetails?.customer.landmark ? `- معلم مميز: ${orderDetails?.customer.landmark}` : ''}

📍 *الموقع الدقيق:*
http://maps.google.com/maps?q=${orderDetails?.customer.latitude},${orderDetails?.customer.longitude}
    `.trim();

    const fullMessage = `مرحباً تايراتي، أرغب في تأكيد طلبي:\n\n${productInfo}\n\n${customerInfo}`;
    window.open(`https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(fullMessage)}`, '_blank');
};