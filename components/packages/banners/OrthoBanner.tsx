import React from 'react';
import BannerTemplate from './BannerTemplate';

interface Props {
  onBack?: () => void;
}

export default function OrthoBanner({ onBack }: Props) {
  return (
    <BannerTemplate
      image="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1000"
      offerHighlight="FREE BONE DENSITY SCAN UNLOCKED"
      offerSubtitle="Joint Care, Fractures & Orthopedic Surgery"
      onBack={onBack}
    />
  );
}
