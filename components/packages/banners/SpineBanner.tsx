import React from 'react';
import BannerTemplate from './BannerTemplate';

interface Props {
  onBack?: () => void;
}

export default function SpineBanner({ onBack }: Props) {
  return (
    <BannerTemplate
      image={require('../../../assets/images/package-banners/bones_and_joints.png')}
      offerHighlight="SPINE ALIGNMENT & POSTURE REHAB"
      offerSubtitle="Disc Pain Treatment & Spine Therapy"
      onBack={onBack}
    />
  );
}
