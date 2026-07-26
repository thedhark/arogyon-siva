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
      badgeColor="#00838F"
      image="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600"
      colors={['#E0F7FA', '#B2EBF2']}
      categorySlug="dental"
      onPress={onPress}
    />
  );
}
