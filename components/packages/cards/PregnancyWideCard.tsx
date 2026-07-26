import React from 'react';
import WideCardTemplate from './WideCardTemplate';

interface Props {
  onPress?: () => void;
}

export default function PregnancyWideCard({ onPress }: Props) {
  return (
    <WideCardTemplate
      title="Pregnancy Care Plan"
      subtitle="Maternity suite, 40-week screening & delivery care"
      badgeText="50% OFF MATERNITY"
      badgeColor="#C2185B"
      image="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600"
      colors={['#FCE4EC', '#F8BBD0']}
      categorySlug="pregnancy"
      onPress={onPress}
    />
  );
}
