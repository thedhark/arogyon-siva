import React from 'react';
import BannerTemplate from './BannerTemplate';

interface Props {
  onBack?: () => void;
}

export default function SkinBanner({ onBack }: Props) {
  return (
    <BannerTemplate
      image={require('../../../assets/images/package-banners/skin.png')}
      offerHighlight="40% OFF DERMA CARE UNLOCKED"
      offerSubtitle="Acne, Glow, Laser & Clinical Skin Therapies"
      onBack={onBack}
    />
  );
}
