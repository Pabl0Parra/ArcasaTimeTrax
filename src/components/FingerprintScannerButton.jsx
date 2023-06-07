import React, { useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Animated, Easing, Text } from 'react-native';

const FingerprintScannerButton = () => {
  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [animationValue]);

  const animatedStyle = {
    transform: [
      {
        translateY: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 20],
        }),
      },
    ],
    opacity: animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.5],
    }),
  };

  return (
    <TouchableOpacity style={styles.button}>
      <Animated.View style={[styles.fingerprint, animatedStyle]} />
      <Text style={styles.buttonText}>Scan Fingerprint</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#2beeee',
    borderRadius: 10,
    flexDirection: 'row',
  },
  fingerprint: {
    width: 20,
    height: 30,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FingerprintScannerButton;
