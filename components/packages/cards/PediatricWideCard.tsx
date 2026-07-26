import React from 'react';
import WideCardTemplate from './WideCardTemplate';

interface Props {
  onPress?: () => void;
}

export default function PediatricWideCard({ onPress }: Props) {
  return (
    <WideCardTemplate
      title="Pediatric Care Card"
      subtitle="Growth milestone tracking & child immunization"
      badgeText="25% OFF VACCINE"
      badgeColor="#E65100"
      image="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=600"
      colors={['#FFF3E0', '#FFE0B2']}
      categorySlug="pediatrics"
      onPress={onPress}
    />
  );
}
