import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  ViewStyle,
  KeyboardTypeOptions,
  TextInputProps
} from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';

type FormInputProps = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  isRequired?: boolean;
  error?: string;
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: boolean;
  maxLength?: number;
  multiline?: boolean;
};

export default function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  isRequired = false,
  error,
  containerStyle,
  secureTextEntry = false,
  autoCapitalize = 'sentences',
  autoCorrect = true,
  maxLength,
  multiline = false,
}: FormInputProps) {
  const colorScheme = useColorScheme();  

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
          {label}
          {isRequired && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer, 
        { backgroundColor: Colors[colorScheme].inputBackground },
      ]}>
        <TextInput
          style={[
            styles.input, 
            { color: Colors[colorScheme].text },
            multiline && styles.multilineInput
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors[colorScheme].textSecondary}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          maxLength={maxLength}
          multiline={multiline}
        />
      </View>
      
      {error && (
        <Text style={[styles.errorText, { color: Colors[colorScheme].error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing.m,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: Layout.spacing.xs,
  },
  required: {
    color: Colors.light.error,
  },
  inputContainer: {
    borderRadius: Layout.borderRadius.medium,
    borderWidth: 1,
    paddingHorizontal: Layout.spacing.m,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    paddingVertical: Layout.spacing.m,
    minHeight: 50,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: Layout.spacing.xs,
  },
});