import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function CancelButton() {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.button} onPress={() => router.replace('/(protected)/(cedulas)/juego')}>
      <Text style={styles.text}>Cancelar</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F0F7F0',
    padding: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 16,
  },
  text: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});
