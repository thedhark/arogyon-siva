import React from 'react';
import BannerTemplate from './BannerTemplate';

interface Props {
  onBack?: () => void;
}

export default function PediatricBanner({ onBack }: Props) {
  return (
    <BannerTemplate
      image="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=1000"
      offerHighlight="FLAT 25% OFF VACCINATION & CARE"
      offerSubtitle="Pediatric Growth Chart & Child Immunization"
      onBack={onBack}
    />
  );
}
