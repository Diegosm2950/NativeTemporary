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
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCedula } from '@/context/CedulaContext';

export default function RegistrarCambio() {
  const router = useRouter();
  const { setCedulaData } = useCedula();

  const [equipo, setEquipo] = useState('');
  const [jugadorSale, setJugadorSale] = useState('');
  const [jugadorEntra, setJugadorEntra] = useState('');
  const [tiempo, setTiempo] = useState('00:00:00');
  const [motivo, setMotivo] = useState<'tactico' | 'lesion' | 'otro' | null>(null);

  const handleGuardarCambio = () => {
    if (!equipo || !jugadorSale || !jugadorEntra || !tiempo) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos requeridos.');
      return;
    }

    const nuevoCambio = {
      equipo,
      sale: jugadorSale,
      entra: jugadorEntra,
      tiempo,
      motivo,
    };

    setCedulaData(prev => ({
      ...prev,
      cambios: [...prev.cambios, nuevoCambio],
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
      <Text style={styles.title}>Registrar cambio de jugador</Text>

      {/* Selects simulados */}
      <TouchableOpacity style={styles.select} onPress={() => setEquipo('Equipo A')}>
        <Text style={styles.selectText}>{equipo || 'Selección de equipo'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.select} onPress={() => setJugadorSale('Jugador X')}>
        <Text style={styles.selectText}>{jugadorSale || 'Jugador que sale'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.select} onPress={() => setJugadorEntra('Jugador Y')}>
        <Text style={styles.selectText}>{jugadorEntra || 'Jugador que entra'}</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.timerInput}
        value={tiempo}
        onChangeText={setTiempo}
        placeholder="00:00:00"
        keyboardType="numeric"
        maxLength={8}
      />

      {/* Motivo */}
      <Text style={styles.subTitle}>Seleccione una opción</Text>
      <Text style={styles.subText}>Motivo del cambio (opcional)</Text>
      {[
        { label: 'Táctico', value: 'tactico' },
        { label: 'Lesión', value: 'lesion' },
        { label: 'Otro', value: 'otro' },
      ].map(({ label, value }) => (
        <TouchableOpacity
          key={value}
          style={[
            styles.motivoOption,
            motivo === value && styles.motivoOptionSelected,
          ]}
          onPress={() => setMotivo(value as typeof motivo)}
        >
          <Text style={styles.motivoText}>{label}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.submitButton} onPress={handleGuardarCambio}>
        <Text style={styles.submitText}>Registrar Cambio</Text>
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
  select: {
    backgroundColor: '#F3F8F3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  selectText: {
    color: '#333',
  },
  timerInput: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
    width: 120,
    alignSelf: 'center',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  subText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 8,
  },
  motivoOption: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  motivoOptionSelected: {
    borderColor: '#1B9D3B',
    backgroundColor: '#E6EFE6',
  },
  motivoText: {
    fontSize: 14,
    color: '#111',
  },
  submitButton: {
    backgroundColor: '#1B9D3B',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
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
    marginTop: 12,
  },
  backText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});
