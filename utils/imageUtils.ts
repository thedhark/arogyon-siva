import { Image as RNImage } from 'react-native';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400';

/**
 * Safely resolves an image source prop for React Native & Expo Image components.
 * Handles remote URL strings, local require() asset modules (numbers), objects, and undefined values.
 * Prevents RCTImageView Android crash: "Value for uri cannot be cast from Double to String".
 */
export function resolveImageSource(imageSource: any, fallbackUri?: string): any {
  const fallback = fallbackUri || DEFAULT_FALLBACK_IMAGE;

  if (!imageSource) {
    return { uri: fallback };
  }

  if (typeof imageSource === 'number') {
    return imageSource;
  }

  if (typeof imageSource === 'string') {
    if (!imageSource.trim()) {
      return { uri: fallback };
    }
    return { uri: imageSource };
  }

  if (typeof imageSource === 'object') {
    if (imageSource.uri) {
      if (typeof imageSource.uri === 'number') {
        return imageSource.uri;
      }
      if (typeof imageSource.uri === 'string' && imageSource.uri.trim()) {
        return imageSource;
      }
    }
    if (imageSource.default || imageSource.width || imageSource.height) {
      return imageSource;
    }
  }

  return { uri: fallback };
}
