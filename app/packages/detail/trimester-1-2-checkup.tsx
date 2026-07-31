import React from 'react';
import RedesignedPackageDetailView from '@/components/packages/detail/RedesignedPackageDetailView';

export default function Trimester1And2CheckupScreen() {
  return (
    <RedesignedPackageDetailView
      packageId="trimester-1-2-checkup"
      title="1 x Trimester 1 & 2 Complete Fetal Care"
      price="₹ 15,999"
      originalPrice="₹ 22,000"
      discount="27% OFF"
      summary="Comprehensive early pregnancy screening including genetic marker scans, blood profile, fetal health monitoring, and dietary guidance."
      inclusions={[
        'NT Scan & Double Marker Test',
        'Anomalies Ultrasound Scan',
        '4x Gynecologist Consultations',
        'Complete Blood Count & Sugar Profile',
        'Diet & Lifestyle Coaching',
        'Fetal Heartbeat Doppler Check',
      ]}
      hospitalsCount={14}
    />
  );
}
