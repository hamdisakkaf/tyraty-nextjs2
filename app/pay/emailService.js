// emailService.js

export const sendFailureEmail = async (data) => {
  try {
    // طريقة 1: استخدام API خاص بك
    const response = await fetch('/api/send-failure-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'hamdisaqqaf@gmail.com, w3sanaa@gmail.com', // أو إيميلات متعددة
        subject: `🔥 فشل في حفظ الفاتورة - Transaction ID: ${data.transactionId}`,
        html: `
          <div dir="rtl">
            <h2>تنبيه عاجل: فشل في حفظ الفاتورة</h2>
            <p><strong>رقم المعاملة:</strong> ${data.transactionId}</p>
            <p><strong>الوقت:</strong> ${new Date(data.timestamp).toLocaleString('ar-SA')}</p>
            <p><strong>الخطأ:</strong> ${data.error}</p>
            <h3>تفاصيل المعاملة:</h3>
            <pre>${JSON.stringify(data.transactionData, null, 2)}</pre>
            <h3>بيانات الفاتورة:</h3>
            <pre>${JSON.stringify(data.invoiceData, null, 2)}</pre>
            <p>يرجى مراجعة النظام فورًا.</p>
          </div>
        `
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return await response.json();
    
  } catch (error) {
    // طريقة 2: استخدام خدمة بريد احتياطية
    console.error('Primary email service failed, trying backup...');
    await sendBackupEmail(data);
    throw error;
  }
};

// خدمة احتياطية
const sendBackupEmail = async (data) => {
  // يمكنك استخدام SendGrid, Mailgun, AWS SES, etc.
  // أو إرسال إلى Slack/Telegram كبديل
  await fetch('https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: 'YOUR_CHAT_ID',
      text: `🚨 فشل في حفظ الفاتورة!\nرقم المعاملة: ${data.transactionId}\nالخطأ: ${data.error}`
    })
  });
};