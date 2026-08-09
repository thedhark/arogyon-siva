import React from 'react';
import RedesignedPackageDetailView from '@/components/packages/detail/RedesignedPackageDetailView';

export default function CompleteMaternityCareScreen() {
  return (
    <RedesignedPackageDetailView
      packageId="complete-maternity-care"
      title="Complete Maternity Care"
      price="₹ 24,999"
      originalPrice="₹ 35,000"
      discount="28% OFF"
      summary="A complete pregnancy care plan that covers preconception to postpartum. Personalized care for you and your baby with expert guidance at every step."
      inclusions={[
        'Obstetrician Consultations',
        'All Lab Tests & Scans',
        'Nutrition & Diet Guidance',
        'Physiotherapy & Yoga',
        'Delivery & Hospitalization',
        'Postpartum & Lactation Support',
      ]}
      hospitalsCount={15}
    />
  );
}
