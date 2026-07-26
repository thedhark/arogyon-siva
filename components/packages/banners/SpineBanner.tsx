import React from 'react';
import BannerTemplate from './BannerTemplate';

interface Props {
  onBack?: () => void;
}

export default function SpineBanner({ onBack }: Props) {
  return (
    <BannerTemplate
      image="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1000"
      offerHighlight="SPINE ALIGNMENT & POSTURE REHAB"
      offerSubtitle="Disc Pain Treatment & Spine Therapy"
      onBack={onBack}
    />
  );
}
