import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';

const StatusDropdown = () => {
  // تعريف المتغير والدالة الخاصة بتحديث الحالة
  const [status, setStatus] = useState('draft'); // القيمة الافتراضية 'draft'

  // دالة التعامل مع تغيير الاختيار
  const handleSelect = (eventKey) => {
    setStatus(eventKey);
    console.log("الحالة الحالية المحفوظة:", eventKey);
  };

  // مصفوفة الحالات لتسهيل صيانتها وتعديلها مستقبلاً
  const statusLabels = {
    draft: { text: 'مسودة (Draft)', variant: 'warning' },
    published: { text: 'منشور (Published)', variant: 'success' },
    archived: { text: 'مؤرشف (Archived)', variant: 'secondary' }
  };

  return (
    <div className="m-3">
      <label className="d-block mb-2 text-dark fw-bold">حالة المنشور:</label>
      
      <Dropdown onSelect={handleSelect}>
        <Dropdown.Toggle variant={statusLabels[status].variant} id="dropdown-status">
          {statusLabels[status].text}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item eventKey="draft" active={status === 'draft'}>
            مسودة (Draft)
          </Dropdown.Item>
          <Dropdown.Item eventKey="published" active={status === 'published'}>
            منشور (Published)
          </Dropdown.Item>
          <Dropdown.Item eventKey="archived" active={status === 'archived'}>
            مؤرشف (Archived)
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* اختبار طباعة القيمة للتأكد من حفظها */}
      <div className="mt-3 small text-muted">
        المتغير الحالي يحتوي على: <strong className="text-dark">{status}</strong>
      </div>
    </div>
  );
};

export default StatusDropdown;