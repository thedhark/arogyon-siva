import React from 'react';
import WideCardTemplate from './WideCardTemplate';

interface Props {
  onPress?: () => void;
}

export default function DiabetesWideCard({ onPress }: Props) {
  return (
    <WideCardTemplate
      title="Diabetes Care Card"
      subtitle="Continuous glucose monitoring & organ protection"
      badgeText="FREE HBA1C TEST"
      badgeColor="#0284C7"
      image="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600"
      colors={['#E6F7FF', '#BAE7FF']}
      categorySlug="diabetes"
      onPress={onPress}
    />
  );
}
