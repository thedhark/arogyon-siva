import React from 'react';
import WideCardTemplate from './WideCardTemplate';

interface Props {
  onPress?: () => void;
}

export default function PediatricWideCard({ onPress }: Props) {
  return (
    <WideCardTemplate
      title="Pediatric & Child Care"
      subtitle="Vaccination tracking, growth monitoring & child care"
      badgeText="KIDS HEALTH PACK"
      badgeColor="#0284C7"
      image="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=600"
      colors={['#E6F7FF', '#BAE7FF']}
      categorySlug="pediatric"
      onPress={onPress}
    />
  );
}
