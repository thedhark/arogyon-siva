import React from 'react';
import BannerTemplate from './BannerTemplate';

interface Props {
  onBack?: () => void;
}

export default function CardiacBanner({ onBack }: Props) {
  return (
    <BannerTemplate
      image={require('../../../assets/images/package-banners/health_checkups.png')}
      offerHighlight="35% OFF HEART DIAGNOSTICS UNLOCKED"
      offerSubtitle="ECG, 2D Echo, TMT & Cardiologist Consults"
      onBack={onBack}
    />
  );
}
