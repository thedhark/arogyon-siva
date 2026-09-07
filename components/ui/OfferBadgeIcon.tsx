import React from 'react';
import Svg, { Path, Line, Circle } from 'react-native-svg';

interface OfferBadgeIconProps {
  size?: number;
  color?: string;
  percentColor?: string;
}

export default function OfferBadgeIcon({
  size = 16,
  color = '#FF5200',
  percentColor = '#FFFFFF',
}: OfferBadgeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* 12-point scalloped deal rosette */}
      <Path
        d="M 12.00 0.80 Q 14.43 2.92 17.60 2.30 Q 18.65 5.35 21.70 6.40 Q 21.08 9.57 23.20 12.00 Q 21.08 14.43 21.70 17.60 Q 18.65 18.65 17.60 21.70 Q 14.43 21.08 12.00 23.20 Q 9.57 21.08 6.40 21.70 Q 5.35 18.65 2.30 17.60 Q 2.92 14.43 0.80 12.00 Q 2.92 9.57 2.30 6.40 Q 5.35 5.35 6.40 2.30 Q 9.57 2.92 12.00 0.80 Z"
        fill={color}
      />
      {/* White % symbol */}
      <Line
        x1="15.8"
        y1="8.2"
        x2="8.2"
        y2="15.8"
        stroke={percentColor}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <Circle cx="9.2" cy="9.2" r="1.6" fill={percentColor} />
      <Circle cx="14.8" cy="14.8" r="1.6" fill={percentColor} />
    </Svg>
  );
}
