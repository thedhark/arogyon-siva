import React from 'react';
import RedesignedPackageDetailView from '@/components/packages/detail/RedesignedPackageDetailView';

export default function PremiumDeliveryPackageScreen() {
  return (
    <RedesignedPackageDetailView
      packageId="premium-delivery-package"
      title="Premium Delivery & Maternity Suite Package"
      price="₹ 75,999"
      originalPrice="₹ 90,000"
      discount="15% OFF"
      summary="Full end-to-end luxury delivery package with private deluxe suite, 24/7 dedicated nursing care, specialist obstetrician & newborn pediatrician support."
      inclusions={[
        'Normal / C-Section Delivery',
        '3 Nights Private Deluxe Suite Stay',
        'Senior Gynecologist & Pediatrician',
        'Lactation & Postpartum Yoga Specialist',
        'Newborn Vaccination Package',
        'Luxury Baby Care Hamper',
      ]}
      hospitalsCount={15}
    />
  );
}
