import React from 'react';
import BannerTemplate from './BannerTemplate';

interface Props {
  onBack?: () => void;
}

export default function PediatricBanner({ onBack }: Props) {
  return (
    <BannerTemplate
      image={require('../../../assets/images/package-banners/child_health.png')}
      offerHighlight="FLAT 25% OFF VACCINATION & CARE"
      offerSubtitle="Pediatric Growth Chart & Child Immunization"
      onBack={onBack}
    />
  );
}
