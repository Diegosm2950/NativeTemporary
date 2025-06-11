import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
  Alert,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCedula } from '@/context/CedulaContext';

export default function RegistrarObservacion() {
  const router = useRouter();
  const { setCedulaData } = useCedula();

  const [texto, setTexto] = useState('');
  const [categoria, setCategoria] = useState<'General' | 'Público' | 'Condiciones' | 'Seguridad' | ''>('');

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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

        <Text style={styles.label}>Categoría</Text>
        <View style={styles.categoryGroup}>
          {['General', 'Público', 'Condiciones', 'Seguridad'].map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                categoria === cat && styles.categorySelected
              ]}
              onPress={() => setCategoria(cat as typeof categoria)}
            >
              <Text
                style={[
                  styles.categoryText,
                  categoria === cat && styles.categoryTextSelected
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleGuardar}>
          <Text style={styles.submitText}>Guardar Observación</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  categoryGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#F3F8F3',
    borderRadius: 18,
  },
  categorySelected: {
    backgroundColor: '#1B9D3B',
  },
  categoryText: {
    color: '#333',
    fontSize: 14,
  },
  categoryTextSelected: {
    color: '#fff',
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
