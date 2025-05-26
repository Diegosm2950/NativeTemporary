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

export default function RegistrarTarjeta() {
  const router = useRouter();
  const { setCedulaData } = useCedula();

  const [equipo, setEquipo] = useState('');
  const [jugador, setJugador] = useState('');
  const [color, setColor] = useState<'amarilla' | 'roja' | null>(null);
  const [observacion, setObservacion] = useState('');
  const [tiempo, setTiempo] = useState('00:00:00');

  const handleRegistrar = () => {
    if (!equipo || !jugador || !color || !tiempo || !observacion.trim()) {
      Alert.alert('Faltan campos', 'Completa todos los campos para registrar la tarjeta.');
      return;
    }

    const nuevaTarjeta = {
      equipo,
      jugador,
      tipo: color,
      tiempo,
      observacion,
    };

    setCedulaData(prev => ({
      ...prev,
      tarjetas: [...prev.tarjetas, nuevaTarjeta],
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
      <Text style={styles.title}>Registrar Tarjeta</Text>

      <TouchableOpacity style={styles.select} onPress={() => setEquipo('Equipo A')}>
        <Text style={styles.selectText}>{equipo || 'Seleccionar Equipo'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.select} onPress={() => setJugador('Jugador X')}>
        <Text style={styles.selectText}>{jugador || 'Seleccionar Jugador'}</Text>
      </TouchableOpacity>

      <View style={styles.colorRow}>
        <TouchableOpacity
          onPress={() => setColor('amarilla')}
          style={styles.colorOption}
        >
          <View
            style={[
              styles.colorBox,
              {
                backgroundColor: '#FFD700',
                borderColor: color === 'amarilla' ? '#000' : '#FFD700',
              },
            ]}
          />
          <Text style={styles.colorText}>Amarilla</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setColor('roja')}
          style={styles.colorOption}
        >
          <View
            style={[
              styles.colorBox,
              {
                backgroundColor: '#FF4C4C',
                borderColor: color === 'roja' ? '#000' : '#FF4C4C',
              },
            ]}
          />
          <Text style={styles.colorText}>Roja</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.timerInput}
        value={tiempo}
        onChangeText={setTiempo}
        placeholder="00:00:00"
        keyboardType="numeric"
        maxLength={8}
      />

      <TextInput
        style={styles.input}
        placeholder="Observación Breve"
        value={observacion}
        onChangeText={setObservacion}
        placeholderTextColor="#555"
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleRegistrar}>
        <Text style={styles.submitText}>Registrar Tarjeta</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace('/(protected)/cedulas/juego' as any)}
      >
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
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  colorOption: {
    alignItems: 'center',
  },
  colorBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 6,
  },
  colorText: {
    fontSize: 14,
    color: '#333',
  },
  timer: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    marginVertical: 16,
  },
  input: {
    backgroundColor: '#E6EFE6',
    padding: 14,
    borderRadius: 12,
    fontSize: 14,
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: 'top',
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#1B9D3B',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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
