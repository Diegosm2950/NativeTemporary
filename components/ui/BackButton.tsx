import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';

export const VolverButton = ({
  style = {},
  textStyle = {},
  marginTop = 20,
  marginBottom = 40
}: {
  style?: object;
  textStyle?: object;
  destination?: string;
  marginTop?: number;
  marginBottom?: number;
}) => {
  const router = useRouter();
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      style={[
        styles.backButton,
        { 
          backgroundColor: Colors[colorScheme].buttonSecondary,
          marginTop,
          marginBottom
        },
        style
      ]}
      onPress={() => router.back()}
    >
      <Text style={[
        styles.backText,
        { color: Colors[colorScheme].buttonTextSecondary },
        textStyle
      ]}>
        Volver
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
});