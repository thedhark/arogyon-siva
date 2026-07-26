import React from 'react';
import WideCardTemplate from './WideCardTemplate';

interface Props {
  onPress?: () => void;
}

export default function SkinWideCard({ onPress }: Props) {
  return (
    <WideCardTemplate
      title="Skin & Dermatology Card"
      subtitle="Acne glow, laser toning & clinical therapy"
      badgeText="40% OFF DERMA CARE"
      badgeColor="#D81B60"
      image="https://images.unsplash.com/photo-1512290900676-26c2a4d4b5b3?q=80&w=600"
      colors={['#FFF0F5', '#F8D7E5']}
      categorySlug="skin"
      onPress={onPress}
    />
  );
}
