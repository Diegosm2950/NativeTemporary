import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';

interface TimeDisplayProps {
  time: string;
  label?: string;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ 
  time, 
  label = "Tiempo Actual" 
}) => {
  const colorScheme = useColorScheme();

  return (
    <TextInput
      style={[
        styles.display,
        { 
          color: Colors[colorScheme].text, 
          borderBottomColor: Colors[colorScheme].border,
          backgroundColor: Colors[colorScheme].cardBackground
        }
      ]}
      value={time}
      editable={false}
      placeholder={label}
    />
  );
};

const styles = StyleSheet.create({
  display: {
    fontSize: 18,
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
  },
});

export default TimeDisplay;