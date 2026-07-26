import React from 'react';
import BannerTemplate from './BannerTemplate';

interface Props {
  onBack?: () => void;
}

export default function GastroBanner({ onBack }: Props) {
  return (
    <BannerTemplate
      image="https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=1000"
      offerHighlight="FREE LIVER FUNCTION PANEL UNLOCKED"
      offerSubtitle="Endoscopy, Gut Health & Digestive Care"
      onBack={onBack}
    />
  );
}
