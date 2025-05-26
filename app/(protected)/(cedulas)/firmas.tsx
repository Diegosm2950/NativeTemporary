import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCedula } from '@/context/CedulaContext';

export default function RecoleccionFirmas() {
  const router = useRouter();
  const { cedulaData, setCedulaData } = useCedula();

  const [firmaLocal, setFirmaLocal] = useState('');
  const [firmaVisitante, setFirmaVisitante] = useState('');
  const [repLocal, setRepLocal] = useState('');
  const [repVisitante, setRepVisitante] = useState('');

  const handleSubmit = async () => {
    if (!firmaLocal || !firmaVisitante || !repLocal || !repVisitante) {
      Alert.alert('Faltan firmas', 'Por favor llena todos los campos de firma.');
      return;
    }

    // Guardar en contexto
    setCedulaData(prev => ({
      ...prev,
      firmas: {
        capitanLocal: firmaLocal,
        capitanVisitante: firmaVisitante,
        representanteLocal: repLocal,
        representanteVisitante: repVisitante,
      },
    }));

    try {
      const res = await fetch('https://fmru-next-js.vercel.app/api/app-native-api/cedulas/crear-cedula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cedulaData,
          firmas: {
            capitanLocal: firmaLocal,
            capitanVisitante: firmaVisitante,
            representanteLocal: repLocal,
            representanteVisitante: repVisitante,
          }
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Error al enviar la cédula:', data);
        Alert.alert('Error', 'No se pudo enviar la cédula.');
        return;
      }

      Alert.alert('Éxito', 'Cédula enviada correctamente');
      router.replace('/(protected)/cedulas/index' as any);

    } catch (error) {
      console.error('Error en el envío:', error);
      Alert.alert('Error', 'No se pudo enviar la cédula.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" />
      <Image
        source={require('@/assets/images/FMRUU.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Recolección de firmas</Text>

      {[
        { label: 'Capitán Local', value: firmaLocal, setter: setFirmaLocal },
        { label: 'Capitán Visitante', value: firmaVisitante, setter: setFirmaVisitante },
        { label: 'Representante Local', value: repLocal, setter: setRepLocal },
        { label: 'Representante Visitante', value: repVisitante, setter: setRepVisitante },
      ].map(({ label, value, setter }) => (
        <View key={label} style={styles.section}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.signatureBox}
            placeholder="Firma"
            value={value}
            onChangeText={setter}
            multiline
          />
        </View>
      ))}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Confirmar y continuar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
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
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  signatureBox: {
    backgroundColor: '#E6EFE6',
    borderRadius: 12,
    minHeight: 80,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#1B9D3B',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 16,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
