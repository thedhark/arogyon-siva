import React from 'react';
import BannerTemplate from './BannerTemplate';

interface Props {
  onBack?: () => void;
}

export default function HerniaBanner({ onBack }: Props) {
  return (
    <BannerTemplate
      image={require('../../../assets/images/package-banners/physio_and_rehab.png')}
      offerHighlight="3D MESH & LAPAROSCOPIC HERNIA REPAIR"
      offerSubtitle="Day Care Surgery & Minimal Recovery Time"
      onBack={onBack}
    />
  );
}
