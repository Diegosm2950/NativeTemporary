import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCedula } from '@/context/CedulaContext';

export default function RegistrarObservacion() {
  const router = useRouter();
  const { setCedulaData } = useCedula();

  const [texto, setTexto] = useState('');
  const [categoria, setCategoria] = useState('');

  const handleGuardar = () => {
    if (!texto.trim()) {
      Alert.alert('Campo requerido', 'La observación no puede estar vacía.');
      return;
    }

    setCedulaData(prev => ({
      ...prev,
      observaciones: {
        texto,
        publico: categoria || 'General'
      }
    }));

    router.replace('/(protected)/cedulas/juego' as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image
        source={require('@/assets/images/FMRUU.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Registrar Observación</Text>

      <TextInput
        style={styles.textarea}
        placeholder="Observación (máx. 300 caracteres)"
        value={texto}
        onChangeText={(value) => {
          if (value.length <= 300) setTexto(value);
        }}
        multiline
        placeholderTextColor="#555"
      />

      <TouchableOpacity
        style={styles.select}
        onPress={() => setCategoria('General')}
      >
        <Text style={styles.selectText}>
          {categoria || 'Seleccione una categoría'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleGuardar}>
        <Text style={styles.submitText}>Guardar Observación</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  textarea: {
    backgroundColor: '#E6EFE6',
    padding: 14,
    borderRadius: 12,
    fontSize: 14,
    marginBottom: 20,
    minHeight: 120,
    textAlignVertical: 'top',
    color: '#000',
  },
  select: {
    backgroundColor: '#F3F8F3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  selectText: {
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#1B9D3B',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#F0F7F0',
    padding: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  backText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});
