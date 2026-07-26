import React from 'react';
import BannerTemplate from './BannerTemplate';

interface Props {
  onBack?: () => void;
}

export default function HerniaBanner({ onBack }: Props) {
  return (
    <BannerTemplate
      image="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1000"
      offerHighlight="3D MESH & LAPAROSCOPIC HERNIA REPAIR"
      offerSubtitle="Day Care Surgery & Minimal Recovery Time"
      onBack={onBack}
    />
  );
}
