import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';

interface CustomTimerInputProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
  label?: string;
}

const CustomTimerInput: React.FC<CustomTimerInputProps> = ({
  value,
  onChange,
  placeholder = "MM:SS o HH:MM:SS",
  label = "Tiempo Personalizado"
}) => {
  const colorScheme = useColorScheme();
  const [internalValue, setInternalValue] = useState(value);

  // Sync with external value changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const formatCustomTimeInput = (text: string) => {
    // Remove all non-numeric characters
    const numbers = text.replace(/[^0-9]/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}:${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}:${numbers.slice(4, 6)}`;
    }
  };

  const handleTimeChange = (text: string) => {
    const formatted = formatCustomTimeInput(text);
    setInternalValue(formatted);
    onChange(formatted);
  };

  const validateTimeFormat = (time: string): boolean => {
    // Validate formats: MM:SS or HH:MM:SS
    const timeRegex = /^([0-9]{1,2}:)?[0-5][0-9]:[0-5][0-9]$/;
    
    if (!timeRegex.test(time)) {
      return false;
    }

    // Additional validation for hours if present
    const parts = time.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0]);
      if (hours > 23) {
        return false;
      }
    }

    return true;
  };

  const handleBlur = () => {
    if (internalValue && !validateTimeFormat(internalValue)) {
      Alert.alert('Formato inválido', 'Por favor ingresa el tiempo en formato HH:MM:SS o MM:SS válido (ej: 45:30 o 01:15:30)');
    }
  };

  const clearTime = () => {
    setInternalValue('');
    onChange('');
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
          {label}
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            { 
              color: Colors[colorScheme].text,
              borderColor: Colors[colorScheme].border,
              backgroundColor: Colors[colorScheme].cardBackground
            }
          ]}
          value={internalValue}
          onChangeText={handleTimeChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={Colors[colorScheme].textSecondary}
          keyboardType="numeric"
          maxLength={8}
        />
        
        {internalValue ? (
          <TouchableOpacity
            style={[styles.clearButton, { backgroundColor: Colors[colorScheme].error }]}
            onPress={clearTime}
          >
            <Text style={[styles.clearText, { color: Colors[colorScheme].buttonText }]}>
              ×
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      
      <Text style={[styles.hint, { color: Colors[colorScheme].textSecondary }]}>
        Ej: 45:30 (45min 30seg) o 01:15:30 (1h 15min 30seg)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 18,
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
    borderWidth: 1,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  hint: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 5,
  },
});

export default CustomTimerInput;