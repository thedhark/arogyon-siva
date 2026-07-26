import React from 'react';
import WideCardTemplate from './WideCardTemplate';

interface Props {
  onPress?: () => void;
}

export default function SeniorWideCard({ onPress }: Props) {
  return (
    <WideCardTemplate
      title="Senior Citizen Health Card"
      subtitle="45-parameter geriatric evaluation & free home sample"
      badgeText="FREE HOME SAMPLE"
      badgeColor="#2E7D32"
      image="https://images.unsplash.com/photo-1581579438747-1dc8d1e2729a?q=80&w=600"
      colors={['#E8F5E9', '#C8E6C9']}
      categorySlug="senior"
      onPress={onPress}
    />
  );
}
