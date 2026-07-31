import React from 'react';
import RedesignedPackageDetailView from '@/components/packages/detail/RedesignedPackageDetailView';

export default function StandardMaternityCareScreen() {
  return (
    <RedesignedPackageDetailView
      packageId="standard-maternity-care"
      title="1 x Standard Maternity Care"
      price="₹ 18,999"
      originalPrice="₹ 26,000"
      discount="26% OFF"
      summary="Essential maternity package covering trimester monitoring, regular scans, blood work, and expert gynecologist consultations."
      inclusions={[
        'Gynecologist Consultations (6x)',
        'Routine Trimester Scans',
        'Basic Lab Diagnostics',
        'Dietitian Session',
        'Hospital Stay (Normal Delivery)',
        'Postnatal Care Support',
      ]}
      hospitalsCount={12}
    />
  );
}
