import React from 'react';
import WideCardTemplate from './WideCardTemplate';

interface Props {
  onPress?: () => void;
}

export default function OrthoWideCard({ onPress }: Props) {
  return (
    <WideCardTemplate
      title="Orthopedic Care Card"
      subtitle="Bone density, joint replacement & fracture therapy"
      badgeText="FREE BONE DENSITY SCAN"
      badgeColor="#0284C7"
      image="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=600"
      colors={['#E6F7FF', '#BAE7FF']}
      categorySlug="ortho"
      onPress={onPress}
    />
  );
}
