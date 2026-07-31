import React from 'react';
import RedesignedPackageDetailView from '@/components/packages/detail/RedesignedPackageDetailView';

export default function BasicDeliveryPackageScreen() {
  return (
    <RedesignedPackageDetailView
      packageId="basic-delivery-package"
      title="1 x Basic Delivery Package"
      price="₹ 14,999"
      originalPrice="₹ 20,000"
      discount="25% OFF"
      summary="Affordable & reliable delivery care package providing essential hospitalization, nursing care, and doctor consultations during labor."
      inclusions={[
        'Normal Delivery Care',
        '2 Days Standard Room Stay',
        'Duty Doctor & Nursing Charges',
        'Routine Newborn Checkup',
        'Basic Medication Coverage',
        'Post-discharge Follow-up',
      ]}
      hospitalsCount={10}
    />
  );
}
