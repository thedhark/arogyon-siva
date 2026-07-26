import React from 'react';
import BannerTemplate from './BannerTemplate';

interface Props {
  onBack?: () => void;
}

export default function SkinBanner({ onBack }: Props) {
  return (
    <BannerTemplate
      image="https://images.unsplash.com/photo-1512290900676-26c2a4d4b5b3?q=80&w=1000"
      offerHighlight="40% OFF DERMA CARE UNLOCKED"
      offerSubtitle="Acne, Glow, Laser & Clinical Skin Therapies"
      onBack={onBack}
    />
  );
}
