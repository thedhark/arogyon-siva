import React from 'react';
import WideCardTemplate from './WideCardTemplate';

interface Props {
  onPress?: () => void;
}

export default function CardiacWideCard({ onPress }: Props) {
  return (
    <WideCardTemplate
      title="Cardiac & Heart Care Card"
      subtitle="ECG, TMT, 2D Echo & preventive heart screening"
      badgeText="35% OFF HEART CARE"
      badgeColor="#C62828"
      image="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600"
      colors={['#FFEBEE', '#FFCDD2']}
      categorySlug="cardiac"
      onPress={onPress}
    />
  );
}
