import React from 'react';
import { View, StyleSheet, Text, useColorScheme, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';

interface StepIndicatorProps {
  step: number;
  totalSteps: number;
  labels?: string[];
}

const RegisterStepper = ({ step, totalSteps, labels }: StepIndicatorProps) => {
  const isDark = useColorScheme() === 'dark';
  const textColor = isDark ? '#F3F4F6' : '#111827';
  const inactiveColor = isDark ? '#4B5563' : '#D1D5DB';

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNumber = i + 1;
        const isActive = stepNumber <= step + 1;
        const isCompleted = stepNumber < step + 1;

        return (
          <View key={i} style={styles.stepItem}>
            <View style={styles.stepContent}>
              <Animated.View
                style={[
                  styles.circle,
                  {
                    backgroundColor: isActive ? '#1B9142' : inactiveColor,
                    borderColor: isActive ? '#1B9142' : inactiveColor,
                  },
                ]}
              >
                {isCompleted ? (
                  <Text style={[styles.checkmark, { color: '#FFFFFF' }]}>✓</Text>
                ) : (
                  <Text
                    style={[
                      styles.stepText,
                      {
                        color: isActive ? '#FFFFFF' : textColor,
                      },
                    ]}
                  >
                    {stepNumber}
                  </Text>
                )}
              </Animated.View>
              {labels && (
                <Text
                  style={[
                    styles.label,
                    {
                      color: isActive ? textColor : '#6B7280',
                      opacity: isActive ? 1 : 0.7,
                    },
                  ]}
                >
                  {labels[i]}
                </Text>
              )}
            </View>
            {i < totalSteps - 1 && (
              <Animated.View
                style={[
                  styles.line,
                  {
                    backgroundColor: isCompleted ? '#1B9142' : inactiveColor,
                  },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    position: 'absolute',
    top: Dimensions.get('window').height * 0.3,
    left: 10,
    zIndex: 10,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    fontSize: 12,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  line: {
    width: 2,
    height: 30,
    marginVertical: 4,
  },
  label: {
    marginLeft: 12,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default RegisterStepper;
