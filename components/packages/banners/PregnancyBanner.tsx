import React from 'react';
import BannerTemplate from './BannerTemplate';

interface Props {
  onBack?: () => void;
}

export default function PregnancyBanner({ onBack }: Props) {
  return (
    <BannerTemplate
      image="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000"
      offerHighlight="50% OFF UP TO ₹1,500 UNLOCKED"
      offerSubtitle="40-Week Maternity & Delivery Care"
      onBack={onBack}
    />
  );
}
