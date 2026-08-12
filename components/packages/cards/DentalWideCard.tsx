import React from 'react';
import WideCardTemplate from './WideCardTemplate';

interface Props {
  onPress?: () => void;
}

export default function DentalWideCard({ onPress }: Props) {
  return (
    <WideCardTemplate
      title="Dental & Smile Care Card"
      subtitle="Invisible clear aligners, root canal & teeth cleaning"
      badgeText="50% OFF CLEANING"
      badgeColor="#0284C7"
      image="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600"
      colors={['#E6F7FF', '#BAE7FF']}
      categorySlug="dental"
      onPress={onPress}
    />
  );
}
