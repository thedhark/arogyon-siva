import React from 'react';
import WideCardTemplate from './WideCardTemplate';

interface Props {
  onPress?: () => void;
}

export default function KneeWideCard({ onPress }: Props) {
  return (
    <WideCardTemplate
      title="Knee & Joint Recovery Card"
      subtitle="Robotic knee surgery & ACL physical therapy"
      badgeText="₹5,000 OFF KNEE REHAB"
      badgeColor="#0284C7"
      image="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=600"
      colors={['#E6F7FF', '#BAE7FF']}
      categorySlug="knee"
      onPress={onPress}
    />
  );
}
