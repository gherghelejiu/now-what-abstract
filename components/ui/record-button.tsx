import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RecordButtonProps {
  isRecording: boolean;
  isProcessing?: boolean;
  onPress: () => void;
}

const BUTTON_SIZE = 200;

export default function RecordButton({ isRecording, isProcessing = false, onPress }: RecordButtonProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const ripple2Timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(ripple1, { toValue: 1, duration: 1600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
          Animated.timing(ripple1, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      ).start();

      ripple2Timer.current = setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(ripple2, { toValue: 1, duration: 1600, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.timing(ripple2, { toValue: 0, duration: 0, useNativeDriver: true }),
          ])
        ).start();
      }, 800);

      Animated.timing(glowOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    } else {
      if (ripple2Timer.current) clearTimeout(ripple2Timer.current);
      pulseAnim.stopAnimation();
      ripple1.stopAnimation();
      ripple2.stopAnimation();
      Animated.timing(pulseAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      Animated.timing(glowOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    }
  }, [isRecording]);

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.94, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();

  const ripple1Scale = ripple1.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] });
  const ripple1Opacity = ripple1.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 0.2, 0] });
  const ripple2Scale = ripple2.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] });
  const ripple2Opacity = ripple2.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 0.2, 0] });

  return (
    <View style={styles.wrapper}>
      {isRecording && (
        <>
          <Animated.View style={[styles.ripple, { transform: [{ scale: ripple1Scale }], opacity: ripple1Opacity }]} />
          <Animated.View style={[styles.ripple, { transform: [{ scale: ripple2Scale }], opacity: ripple2Opacity }]} />
        </>
      )}

      <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />

      <Animated.View style={{ transform: [{ scale: Animated.multiply(pulseAnim, scaleAnim) }] }}>
        <TouchableOpacity
          style={[styles.button, isRecording && styles.buttonActive, isProcessing && styles.buttonProcessing]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isProcessing}
          activeOpacity={1}
        >
          {/* <View style={[styles.micBody, isRecording && styles.micBodyActive]} />
          <View style={[styles.micStand, isRecording && styles.micStandActive]} />
          <View style={[styles.micBase, isRecording && styles.micBaseActive]} /> */}
          <Text style={{color: 'white'}}>
            {isRecording ? 'recording' : isProcessing ? 'processing' : 'tap to record'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 2,
    borderColor: '#ff3b5c',
  },
  glow: {
    position: 'absolute',
    width: BUTTON_SIZE + 30,
    height: BUTTON_SIZE + 30,
    borderRadius: (BUTTON_SIZE + 30) / 2,
    backgroundColor: '#ff3b5c',
    shadowColor: '#ff3b5c',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 30,
    elevation: 20,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#1e1e2e',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2e2e4a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  buttonActive: {
    backgroundColor: '#1a0a10',
    borderColor: '#ff3b5c',
    shadowColor: '#ff3b5c',
    shadowOpacity: 0.6,
    shadowRadius: 25,
  },
  buttonProcessing: {
    backgroundColor: '#0e1a2e',
    borderColor: '#3b82f6',
  },
  micBody: {
    position: 'absolute',
    top: 28,
    width: 22,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#8b8bff',
  },
  micBodyActive: {
    backgroundColor: '#ff3b5c',
  },
  micStand: {
    position: 'absolute',
    top: 54,
    width: 36,
    height: 20,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#8b8bff',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '180deg' }],
  },
  micStandActive: {
    borderColor: '#ff3b5c',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  micBase: {
    position: 'absolute',
    top: 73,
    width: 3,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#8b8bff',
  },
  micBaseActive: {
    backgroundColor: '#ff3b5c',
  },
});