import React from 'react';
import BannerTemplate from './BannerTemplate';

interface Props {
  onBack?: () => void;
}

export default function CardiacBanner({ onBack }: Props) {
  return (
    <BannerTemplate
      image="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1000"
      offerHighlight="35% OFF HEART DIAGNOSTICS UNLOCKED"
      offerSubtitle="ECG, 2D Echo, TMT & Cardiologist Consults"
      onBack={onBack}
    />
  );
}
