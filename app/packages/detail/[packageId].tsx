import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getPackageById } from '@/constants/package-data';
import RedesignedPackageDetailView from '@/components/packages/detail/RedesignedPackageDetailView';

export default function DynamicPackageDetailScreen() {
  const { packageId } = useLocalSearchParams<{ packageId: string }>();
  const pkg = getPackageById(packageId || 'default-package');

  return (
    <RedesignedPackageDetailView
      packageId={pkg.id}
      title={pkg.title}
      price={pkg.price}
      originalPrice={pkg.originalPrice}
      discount={pkg.discount}
      image={pkg.image}
      summary={pkg.summary}
      inclusions={pkg.inclusions}
      hospitalName={pkg.hospitalName}
      hospitalLocation={pkg.hospitalLocation}
      hospitalsCount={15}
    />
  );
}
