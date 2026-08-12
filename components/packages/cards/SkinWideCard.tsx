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
      badgeColor="#0284C7"
      image="https://images.unsplash.com/photo-1512290900676-26c2a4d4b5b3?q=80&w=600"
      colors={['#E6F7FF', '#BAE7FF']}
      categorySlug="skin"
      onPress={onPress}
    />
  );
}
