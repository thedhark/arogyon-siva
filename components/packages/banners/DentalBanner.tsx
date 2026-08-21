import React from 'react';
import BannerTemplate from './BannerTemplate';

interface Props {
  onBack?: () => void;
}

export default function DentalBanner({ onBack }: Props) {
  return (
    <BannerTemplate
      image={require('../../../assets/images/package-banners/teeth.png')}
      offerHighlight="FLAT 50% OFF TEETH CLEANING"
      offerSubtitle="Root Canal, Clear Aligners & Smile Correction"
      onBack={onBack}
    />
  );
}
