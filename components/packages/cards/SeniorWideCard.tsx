import React from 'react';
import WideCardTemplate from './WideCardTemplate';

interface Props {
  onPress?: () => void;
}

export default function SeniorWideCard({ onPress }: Props) {
  return (
    <WideCardTemplate
      title="Senior Citizen Health Card"
      subtitle="Full body check, cardiac & geriatric wellness"
      badgeText="SENIOR CARE DISCOUNT"
      badgeColor="#0284C7"
      image="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600"
      colors={['#E6F7FF', '#BAE7FF']}
      categorySlug="senior"
      onPress={onPress}
    />
  );
}
