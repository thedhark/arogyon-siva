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
      badgeColor="#0284C7"
      image="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600"
      colors={['#E6F7FF', '#BAE7FF']}
      categorySlug="pregnancy"
      onPress={onPress}
    />
  );
}
