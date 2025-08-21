import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';

interface TimeSelectorToggleProps {
  useCustomTime: boolean;
  onToggle: (useCustom: boolean) => void;
  globalTimeLabel?: string;
  customTimeLabel?: string;
}

const TimeSelectorToggle: React.FC<TimeSelectorToggleProps> = ({
  useCustomTime,
  onToggle,
  globalTimeLabel = "Tiempo Global",
  customTimeLabel = "Tiempo Personalizado"
}) => {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.optionButton,
          { backgroundColor: Colors[colorScheme].cardBackground },
          !useCustomTime && {
            backgroundColor: Colors[colorScheme].buttonSelected
          }
        ]}
        onPress={() => onToggle(false)}
      >
        <Text style={[
          styles.optionText,
          { color: Colors[colorScheme].text },
          !useCustomTime && {
            color: Colors[colorScheme].buttonText
          }
        ]}>
          {globalTimeLabel}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.optionButton,
          { backgroundColor: Colors[colorScheme].cardBackground },
          useCustomTime && {
            backgroundColor: Colors[colorScheme].buttonSelected
          }
        ]}
        onPress={() => onToggle(true)}
      >
        <Text style={[
          styles.optionText,
          { color: Colors[colorScheme].text },
          useCustomTime && {
            color: Colors[colorScheme].buttonText
          }
        ]}>
          {customTimeLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: '48%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TimeSelectorToggle;