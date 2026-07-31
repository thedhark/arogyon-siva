import React from 'react';
import RedesignedPackageDetailView from '@/components/packages/detail/RedesignedPackageDetailView';

export default function AdvancedPregnancyPackageScreen() {
  return (
    <RedesignedPackageDetailView
      packageId="advanced-pregnancy-package"
      title="1 x Advanced Pregnancy Package"
      price="₹ 32,999"
      originalPrice="₹ 45,000"
      discount="27% OFF"
      summary="Comprehensive advanced pregnancy package with high-risk pregnancy monitoring, 4D ultrasound, genetic markers, and 24/7 specialist access."
      inclusions={[
        'Senior Obstetrician Consultations',
        '4D Ultrasound & NT Scans',
        'Advanced Genetic & Blood Tests',
        'Personalized Prenatal Diet Plan',
        'Private Suite Hospitalization',
        'Pediatric & Lactation Specialist',
      ]}
      hospitalsCount={18}
    />
  );
}
