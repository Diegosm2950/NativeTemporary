import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  fullWidth = false,
  loading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  
  const isPrimary = variant === 'primary';
  
  const buttonStyle = [
    styles.button,
    {
      backgroundColor: isPrimary 
        ? Colors[colorScheme].buttonPrimary 
        : Colors[colorScheme].buttonSecondary,
    },
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];
  
  const textStyleFinal = [
    styles.text,
    {
      color: isPrimary 
        ? Colors[colorScheme].buttonText 
        : Colors[colorScheme].buttonTextSecondary,
    },
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={isPrimary ? Colors[colorScheme].buttonText : Colors[colorScheme].tint} 
        />
      ) : (
        <Text style={textStyleFinal}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Layout.spacing.m,
    paddingHorizontal: Layout.spacing.l,
    borderRadius: Layout.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 50,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
});