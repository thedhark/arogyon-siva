import React from 'react';
import BannerTemplate from './BannerTemplate';

interface Props {
  onBack?: () => void;
}

export default function EyeBanner({ onBack }: Props) {
  return (
    <BannerTemplate
      image="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1000"
      offerHighlight="CONTOURA VISION & CATARACT LASIK"
      offerSubtitle="Complete Eye Checkup & Vision Correction"
      onBack={onBack}
    />
  );
}
