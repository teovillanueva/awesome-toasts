import React from 'react';

import {
  Animated,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

export type ToastPosition = 'top' | 'bottom';

type ToastContainerProps = {
  position: ToastPosition;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  onLayout?: (e: LayoutChangeEvent) => void;
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position,
  children,
  style,
  onLayout,
}) => {
  return (
    <View>
      <Animated.View
        onLayout={onLayout}
        style={[
          styles.container,
          position === 'top' ? styles.top : styles.bottom,
          style,
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
    left: 0,
    right: 0,
  },
  top: {
    top: 0,
  },
  bottom: {
    bottom: 0,
  },
});
