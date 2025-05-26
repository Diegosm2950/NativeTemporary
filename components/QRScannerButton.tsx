import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

interface QRScannerButtonProps {
  label?: string;
  variant?: 'primary' | 'secondary';
}

export default function QRScannerButton({
  label = 'Escanear QR',
  variant = 'primary',
}: QRScannerButtonProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={variant === 'primary' ? styles.primaryButton : styles.secondaryButton}
      onPress={() => router.push('/(protected)/cedulas/qr-scanner' as any)}
    >
      <Text
        style={variant === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: '#1B9D3B',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F0F7F0',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});
