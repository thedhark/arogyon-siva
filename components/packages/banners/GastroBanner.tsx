import React from 'react';
import BannerTemplate from './BannerTemplate';

interface Props {
  onBack?: () => void;
}

export default function GastroBanner({ onBack }: Props) {
  return (
    <BannerTemplate
      image={require('../../../assets/images/package-banners/cancer.png')}
      offerHighlight="FREE LIVER FUNCTION PANEL UNLOCKED"
      offerSubtitle="Endoscopy, Gut Health & Digestive Care"
      onBack={onBack}
    />
  );
}
