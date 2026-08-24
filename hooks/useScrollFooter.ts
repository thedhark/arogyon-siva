import { useState, useRef, useCallback } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent, Animated } from 'react-native';

interface UseScrollFooterOptions {
  /** Distance in pixels required to trigger a state change */
  threshold?: number;
  /** Offset from top where footer is always guaranteed visible */
  topThreshold?: number;
  /** Duration for slide animation in ms */
  animationDuration?: number;
  /** Initial visibility */
  initialVisible?: boolean;
}

export function useScrollFooter(options: UseScrollFooterOptions = {}) {
  const {
    threshold = 12,
    topThreshold = 30,
    animationDuration = 250,
    initialVisible = true,
  } = options;

  const [isFooterVisible, setIsFooterVisible] = useState(initialVisible);
  const prevScrollY = useRef(0);
  const isVisibleRef = useRef(initialVisible);

  // Animated value for translateY (0 = fully visible, 140 = slid down)
  const footerAnim = useRef(new Animated.Value(initialVisible ? 0 : 140)).current;

  const animateFooter = useCallback(
    (show: boolean) => {
      if (isVisibleRef.current === show) return;
      isVisibleRef.current = show;
      setIsFooterVisible(show);

      Animated.timing(footerAnim, {
        toValue: show ? 0 : 140,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    },
    [animationDuration, footerAnim]
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
      const currentY = contentOffset.y;
      const delta = currentY - prevScrollY.current;

      // Always show footer at the top of the screen or on negative bounce
      if (currentY <= topThreshold) {
        animateFooter(true);
        prevScrollY.current = currentY;
        return;
      }

      // Check if user is near the bottom of the scroll view
      const isNearBottom =
        layoutMeasurement.height + currentY >= contentSize.height - 40;
      if (isNearBottom) {
        animateFooter(true);
        prevScrollY.current = currentY;
        return;
      }

      // Scrolling down past threshold -> hide footer
      if (delta > threshold && currentY > topThreshold) {
        animateFooter(false);
      }
      // Scrolling up past threshold -> show footer
      else if (delta < -threshold) {
        animateFooter(true);
      }

      prevScrollY.current = currentY;
    },
    [animateFooter, threshold, topThreshold]
  );

  return {
    isFooterVisible,
    setIsFooterVisible: animateFooter,
    handleScroll,
    footerAnim,
    scrollProps: {
      onScroll: handleScroll,
      scrollEventThrottle: 16,
    },
  };
}

export default useScrollFooter;
