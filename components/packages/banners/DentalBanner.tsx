import React from 'react';
import BannerTemplate from './BannerTemplate';

interface Props {
  onBack?: () => void;
}

export default function DentalBanner({ onBack }: Props) {
  return (
    <BannerTemplate
      image="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1000"
      offerHighlight="FLAT 50% OFF TEETH CLEANING"
      offerSubtitle="Root Canal, Clear Aligners & Smile Correction"
      onBack={onBack}
    />
  );
}
