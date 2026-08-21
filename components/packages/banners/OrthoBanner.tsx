import React from 'react';
import BannerTemplate from './BannerTemplate';

interface Props {
  onBack?: () => void;
}

export default function OrthoBanner({ onBack }: Props) {
  return (
    <BannerTemplate
      image={require('../../../assets/images/package-banners/bones_and_joints.png')}
      offerHighlight="FREE BONE DENSITY SCAN UNLOCKED"
      offerSubtitle="Joint Care, Fractures & Orthopedic Surgery"
      onBack={onBack}
    />
  );
}
