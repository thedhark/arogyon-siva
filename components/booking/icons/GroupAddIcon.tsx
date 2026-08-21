import React from 'react';
import Svg, { Path, Circle, Line, G } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export default function GroupAddIcon({
  size = 22,
  color = '#4338CA',
  strokeWidth = 2.4,
}: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
    >
      {/* Left Person Head */}
      <Circle
        cx="10"
        cy="9"
        r="4.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Left Person Body / Shoulders */}
      <Path
        d="M3 23c0-4.2 3.2-7 7-7s7 2.8 7 7"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Right Person Head */}
      <Circle
        cx="20.5"
        cy="10.5"
        r="4.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Right Person Shoulder Curve */}
      <Path
        d="M14.5 21.5c.8-3 3.4-5 6-5 2.2 0 4.2 1.3 5.2 3.2"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Plus Sign at Bottom Right */}
      <Line
        x1="24.5"
        y1="20.5"
        x2="24.5"
        y2="27.5"
        stroke={color}
        strokeWidth={strokeWidth + 0.4}
        strokeLinecap="round"
      />
      <Line
        x1="21"
        y1="24"
        x2="28"
        y2="24"
        stroke={color}
        strokeWidth={strokeWidth + 0.4}
        strokeLinecap="round"
      />
    </Svg>
  );
}
