import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, G, Line } from 'react-native-svg';

interface FamilyIllustrationProps {
  isDark?: boolean;
}

export default function FamilyIllustration({ isDark = false }: FamilyIllustrationProps) {
  const strokeColor = isDark ? '#94A3B8' : '#334155';
  const accentColor = isDark ? '#818CF8' : '#6366F1';
  const leafColor = isDark ? '#64748B' : '#94A3B8';

  return (
    <View style={styles.container}>
      <Svg width="100%" height="150" viewBox="0 0 360 160" fill="none">
        {/* Top Floating Heart */}
        <Path
          d="M 180 20 C 180 17, 177 13, 172 13 C 166 13, 163 18, 180 30 C 197 18, 194 13, 188 13 C 183 13, 180 17, 180 20 Z"
          stroke={accentColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Decorative Sparkles & Leaves on Left */}
        <G stroke={leafColor} strokeWidth="1.4" strokeLinecap="round">
          {/* Leaf Branch Left */}
          <Path d="M 68 85 C 62 76 56 68 52 56" />
          <Path d="M 64 78 C 55 76 52 70 56 66 C 60 62 65 68 64 78 Z" />
          <Path d="M 58 66 C 50 63 48 57 52 53 C 56 49 61 55 58 66 Z" />
          <Path d="M 53 55 C 47 48 48 42 53 40 C 58 38 60 45 53 55 Z" />
          <Path d="M 67 80 C 73 75 78 78 77 84 C 76 90 70 88 67 80 Z" />
          <Path d="M 60 68 C 66 63 71 66 70 72 C 69 77 63 75 60 68 Z" />

          {/* Sparkle 1 Left */}
          <Path d="M 70 38 L 70 46 M 66 42 L 74 42" stroke={accentColor} strokeWidth="1.6" />
        </G>

        {/* Decorative Sparkles & Leaves on Right */}
        <G stroke={leafColor} strokeWidth="1.4" strokeLinecap="round">
          {/* Leaf Branch Right */}
          <Path d="M 292 85 C 298 76 304 68 308 56" />
          <Path d="M 296 78 C 305 76 308 70 304 66 C 300 62 295 68 296 78 Z" />
          <Path d="M 302 66 C 310 63 312 57 308 53 C 304 49 299 55 302 66 Z" />
          <Path d="M 307 55 C 313 48 312 42 307 40 C 302 38 300 45 307 55 Z" />
          <Path d="M 293 80 C 287 75 282 78 283 84 C 284 90 290 88 293 80 Z" />
          <Path d="M 300 68 C 294 63 289 66 290 72 C 291 77 297 75 300 68 Z" />

          {/* Sparkles Right */}
          <Path d="M 285 36 L 285 44 M 281 40 L 289 40" stroke={accentColor} strokeWidth="1.6" />
          <Path d="M 310 92 L 310 98 M 307 95 L 313 95" stroke={accentColor} strokeWidth="1.4" />
        </G>

        {/* -------------------- 1. FATHER (LEFT) -------------------- */}
        <G stroke={strokeColor} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Hair & Head */}
          <Path d="M 112 36 C 114 30, 126 28, 137 28 C 147 28, 153 33, 154 40 C 148 40, 142 38, 134 40 C 128 42, 122 46, 120 50" />
          {/* Face Oval */}
          <Path d="M 120 48 C 119 58, 125 72, 136 72 C 147 72, 153 58, 152 48" />
          {/* Ears */}
          <Path d="M 120 52 C 116 52 116 58 120 60" />
          <Path d="M 152 52 C 156 52 156 58 152 60" />
          {/* Eyes & Smile */}
          <Circle cx="129" cy="51" r="1.3" fill={strokeColor} stroke="none" />
          <Circle cx="143" cy="51" r="1.3" fill={strokeColor} stroke="none" />
          <Path d="M 133 60 Q 136 63 139 60" />
          {/* Neck */}
          <Path d="M 130 72 L 130 82" />
          <Path d="M 142 72 L 142 82" />
          {/* Shoulders / Shirt */}
          <Path d="M 130 82 C 124 82, 114 84, 102 96 C 94 105, 92 120, 92 145" />
          <Path d="M 142 82 C 148 82, 154 84, 160 90" />
          {/* Collar */}
          <Path d="M 130 82 Q 136 87 142 82" />
          {/* Body Lines */}
          <Path d="M 108 110 L 108 145" />
        </G>

        {/* -------------------- 2. MOTHER (RIGHT) -------------------- */}
        <G stroke={strokeColor} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Hair */}
          <Path d="M 215 48 C 215 34, 226 30, 237 30 C 248 30, 260 34, 260 48 C 263 60, 265 80, 264 96 C 259 96, 256 86, 254 75" />
          <Path d="M 215 48 C 213 60, 211 80, 212 96 C 217 96, 220 86, 222 75" />
          {/* Bangs */}
          <Path d="M 223 45 C 230 40, 237 46, 245 42 C 249 44, 252 46, 253 48" />
          {/* Face */}
          <Path d="M 223 48 C 222 58, 227 72, 237 72 C 247 72, 252 58, 251 48" />
          {/* Eyes & Smile */}
          <Circle cx="231" cy="53" r="1.3" fill={strokeColor} stroke="none" />
          <Circle cx="243" cy="53" r="1.3" fill={strokeColor} stroke="none" />
          <Path d="M 234 62 Q 237 65 240 62" />
          {/* Neck & Shoulders */}
          <Path d="M 232 72 L 232 82" />
          <Path d="M 242 72 L 242 82" />
          <Path d="M 232 82 C 227 82, 220 85, 214 90" />
          <Path d="M 242 82 C 252 82, 264 86, 274 98 C 280 106, 281 122, 280 145" />
          <Path d="M 232 82 Q 237 87 242 82" />
        </G>

        {/* -------------------- 3. CENTER GIRL -------------------- */}
        <G stroke={strokeColor} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Hair & Face */}
          <Path d="M 170 65 C 168 53, 176 46, 185 46 C 194 46, 202 53, 200 65 C 204 78, 203 94, 201 106" />
          <Path d="M 170 65 C 166 78, 167 94, 169 106" />
          <Path d="M 175 58 C 180 54, 190 54, 195 58" />
          <Path d="M 175 62 C 175 72, 179 80, 185 80 C 191 80, 195 72, 195 62" />
          {/* Eyes & Smile */}
          <Circle cx="181" cy="64" r="1.2" fill={strokeColor} stroke="none" />
          <Circle cx="189" cy="64" r="1.2" fill={strokeColor} stroke="none" />
          <Path d="M 183 71 Q 185 73 187 71" />
          {/* Neck & Shirt */}
          <Path d="M 181 80 L 181 87" />
          <Path d="M 189 80 L 189 87" />
          <Path d="M 181 87 C 172 87, 160 92, 150 102 L 148 145" />
          <Path d="M 189 87 C 198 87, 210 92, 220 102 L 222 145" />
          <Path d="M 181 87 Q 185 91 189 87" />
        </G>

        {/* -------------------- 4. LITTLE SISTER (FRONT CENTER) -------------------- */}
        <G stroke={strokeColor} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Small Bun / Hair */}
          <Path d="M 197 85 C 196 74, 208 74, 207 85" />
          <Path d="M 216 88 C 215 80, 226 80, 225 88" />
          <Path d="M 200 93 C 198 85, 206 82, 212 82 C 218 82, 226 85, 224 93" />
          {/* Face */}
          <Path d="M 203 93 C 203 102, 207 108, 212 108 C 217 108, 221 102, 221 93" />
          {/* Eyes & Smile */}
          <Circle cx="208" cy="95" r="1" fill={strokeColor} stroke="none" />
          <Circle cx="216" cy="95" r="1" fill={strokeColor} stroke="none" />
          <Path d="M 210 101 Q 212 103 214 101" />
          {/* Shirt */}
          <Path d="M 208 108 L 202 118 L 198 145" />
          <Path d="M 216 108 L 222 118 L 226 145" />
          <Path d="M 208 112 Q 212 115 216 112" />
        </G>

        {/* -------------------- 5. BROTHER / BOY (FRONT RIGHT) -------------------- */}
        <G stroke={strokeColor} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Hair & Head */}
          <Path d="M 242 80 C 243 70, 256 68, 264 72 C 268 74, 270 78, 270 82 C 265 82, 258 80, 252 82 C 248 84, 246 87, 246 90" />
          {/* Face */}
          <Path d="M 246 88 C 245 98, 250 106, 258 106 C 266 106, 271 98, 270 88" />
          {/* Ears */}
          <Path d="M 246 91 C 243 91 243 95 246 97" />
          <Path d="M 270 91 C 273 91 273 95 270 97" />
          {/* Eyes & Smile */}
          <Circle cx="253" cy="91" r="1.1" fill={strokeColor} stroke="none" />
          <Circle cx="263" cy="91" r="1.1" fill={strokeColor} stroke="none" />
          <Path d="M 256 99 Q 258 101 260 99" />
          {/* Neck & Shirt */}
          <Path d="M 254 106 L 254 114" />
          <Path d="M 262 106 L 262 114" />
          <Path d="M 254 114 C 246 114, 238 118, 234 125 L 232 145" />
          <Path d="M 262 114 C 270 114, 278 118, 282 125 L 284 145" />
          <Path d="M 254 114 Q 258 118 262 114" />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 155,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
});
