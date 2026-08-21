import React from 'react';
import BannerTemplate from './BannerTemplate';

interface Props {
  onBack?: () => void;
}

export default function PregnancyBanner({ onBack }: Props) {
  return (
    <BannerTemplate
      image={require('../../../assets/images/package-banners/pregnancy_care.png')}
      offerHighlight="50% OFF UP TO ₹1,500 UNLOCKED"
      offerSubtitle="40-Week Maternity & Delivery Care"
      onBack={onBack}
    />
  );
}
