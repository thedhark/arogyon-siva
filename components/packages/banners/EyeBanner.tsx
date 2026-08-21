import React from 'react';
import BannerTemplate from './BannerTemplate';

interface Props {
  onBack?: () => void;
}

export default function EyeBanner({ onBack }: Props) {
  return (
    <BannerTemplate
      image={require('../../../assets/images/package-banners/eye_care.png')}
      offerHighlight="CONTOURA VISION & CATARACT LASIK"
      offerSubtitle="Complete Eye Checkup & Vision Correction"
      onBack={onBack}
    />
  );
}
