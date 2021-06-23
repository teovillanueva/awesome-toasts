import React, { useCallback, useMemo, useState } from 'react';

import { Animated, Easing, StyleSheet, View, ViewStyle } from 'react-native';

import {
  GestureEvent,
  HandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import { ToastContainer, ToastPosition } from './container';

type ShowToastFn<P> = (opts: { props: P } & ToastsConfig) => void;

type ToastsContextValue<C extends React.ComponentType> = {
  showToast: ShowToastFn<React.ComponentProps<C>>;
};

export const ToastsContext = React.createContext<ToastsContextValue<any>>(
  {} as any
);

type ToastsConfig = Partial<{
  position: ToastPosition;
  duration: number;
  containerStyle: ViewStyle;
}>;

type ToastsProviderProps = {
  component: React.ComponentType;
  defaultOptions?: ToastsConfig;
};

export const createUseToastsHook = <C extends React.ComponentType>() => {
  const useToasts = () => {
    return React.useContext<ToastsContextValue<C>>(ToastsContext);
  };

  return useToasts;
};

type ToastElement = React.ReactElement & Required<ToastsConfig>;

export const ToastsProvider: React.FC<ToastsProviderProps> = ({
  component,
  children,
  defaultOptions = { duration: 4000, position: 'top', containerStyle: {} },
}) => {
  const [toast, setToast] = useState<ToastElement>();
  const [animatedValue, setAnimatedValue] = useState<Animated.Value>();

  const [toastHeight, setToastHeight] = useState<number>();

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  const _clearToast = useCallback(() => {
    setToast(undefined);
  }, []);

  const _slideIn = useCallback(
    (animValue: Animated.Value, cb: Animated.EndCallback) => {
      Animated.timing(animValue, {
        useNativeDriver: true,
        toValue: 0,
        duration: 300,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
      }).start(cb);
    },
    []
  );

  const _slideOut = useCallback(
    (animValue: Animated.Value, position: ToastPosition, fast = false) => {
      Animated.timing(animValue, {
        useNativeDriver: true,
        toValue: position === 'bottom' ? 1000 : -1000,
        duration: fast ? 100 : 500,
        easing: Easing.bezier(0.42, 0, 0.58, 1),
      }).start(_clearToast);
    },
    [_clearToast]
  );

  const _showToast = useCallback<
    ShowToastFn<React.ComponentProps<typeof component>>
  >(
    ({
      props: toastProps = {},
      duration = defaultOptions.duration,
      position = defaultOptions.position,
      containerStyle = defaultOptions.containerStyle,
    }) => {
      const animValue = new Animated.Value(position === 'top' ? -1000 : 1000);

      setAnimatedValue(animValue);

      setToast({
        ...React.createElement(component, toastProps),
        duration: duration!,
        position: position!,
        containerStyle: containerStyle!,
      });

      _slideIn(animValue, () => {
        setTimeoutId(
          setTimeout(() => {
            _slideOut(animValue, position!);
          }, duration)
        );
      });
    },
    [component, defaultOptions, _slideIn, _slideOut]
  );

  const _handlePanBegin = useCallback(() => {
    clearTimeout(timeoutId!);
  }, [timeoutId]);

  const _handlePanEnd = useCallback(
    (e: HandlerStateChangeEvent<Record<string, unknown>>) => {
      if (toast && animatedValue) {
        if ((e.nativeEvent.absoluteY as number) <= toastHeight! / 2) {
          _slideOut(animatedValue, toast.position!, true);
        } else {
          _slideIn(animatedValue, () => {
            setTimeoutId(
              setTimeout(() => {
                _slideOut(animatedValue, toast.position!);
              }, toast.duration)
            );
          });
        }
      }
    },
    [animatedValue, toast, _slideIn, _slideOut, toastHeight]
  );

  const _handlePanEvent = useCallback(
    (e: GestureEvent<PanGestureHandlerEventPayload>) => {
      if (
        toast &&
        animatedValue &&
        toast.position === 'top' &&
        e.nativeEvent.translationY < 0
      ) {
        animatedValue.setValue(e.nativeEvent.translationY);
      }
    },
    [toast, animatedValue]
  );

  const value = useMemo<ToastsContextValue<typeof component>>(() => {
    return {
      showToast: _showToast,
    };
  }, [_showToast]);

  return (
    <ToastsContext.Provider value={value}>
      {children}
      {toast && animatedValue && (
        <PanGestureHandler
          onBegan={_handlePanBegin}
          onEnded={_handlePanEnd}
          onGestureEvent={_handlePanEvent}
        >
          <View
            style={[
              styles.safeView,
              toast.position === 'bottom' && styles.bottom,
            ]}
          >
            <ToastContainer
              onLayout={(e) => setToastHeight(e.nativeEvent.layout.height)}
              position={toast.position}
              style={[
                toast.containerStyle,
                {
                  transform: [
                    {
                      translateY: animatedValue,
                    },
                  ],
                },
              ]}
            >
              {toast}
            </ToastContainer>
          </View>
        </PanGestureHandler>
      )}
    </ToastsContext.Provider>
  );
};

const styles = StyleSheet.create({
  safeView: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingTop: getStatusBarHeight(),
  },
  bottom: { bottom: 0 },
});
