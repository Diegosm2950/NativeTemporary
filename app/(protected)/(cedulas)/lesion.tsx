import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCedula } from '@/context/CedulaContext';

export default function RegistrarLesion() {
  const router = useRouter();
  const { setCedulaData } = useCedula();

  const [equipo, setEquipo] = useState('');
  const [jugador, setJugador] = useState('');
  const [parte, setParte] = useState<string | null>(null);
  const [gravedad, setGravedad] = useState<'Leve' | 'Media' | 'Grave'>('Leve');
  const [ambulancia, setAmbulancia] = useState<boolean | null>(null);
  const [observacion, setObservacion] = useState('');

  const partesCuerpo = ['Cabeza', 'Hombro', 'Brazo', 'Pierna'];

  const handleRegistrarLesion = () => {
    if (!equipo || !jugador || !parte || ambulancia === null) {
      Alert.alert('Faltan campos', 'Completa todos los datos requeridos.');
      return;
    }

    const nuevaLesion = {
      equipo,
      jugador,
      parte,
      gravedad,
      ambulancia,
      observacion,
    };

    setCedulaData(prev => ({
      ...prev,
      lesiones: [...prev.lesiones, nuevaLesion],
    }));

    router.replace('/(protected)/(cedulas)/juego' as any);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" />
      <Image
        source={require('@/assets/images/FMRUU.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Registrar Lesión</Text>

      <TouchableOpacity style={styles.select} onPress={() => setEquipo('Equipo A')}>
        <Text style={styles.selectText}>{equipo || 'Selección de equipo'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.select} onPress={() => setJugador('Jugador X')}>
        <Text style={styles.selectText}>{jugador || 'Seleccionar jugador lesionado'}</Text>
      </TouchableOpacity>

      <View style={styles.bodyParts}>
        {partesCuerpo.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.partButton, parte === p && styles.partButtonSelected]}
            onPress={() => setParte(p)}
          >
            <Text style={styles.partText}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.gravedadContainer}>
        {['Leve', 'Media', 'Grave'].map((nivel) => (
          <TouchableOpacity
            key={nivel}
            style={[styles.gravedadButton, gravedad === nivel && styles.gravedadSelected]}
            onPress={() => setGravedad(nivel as typeof gravedad)}
          >
            <Text style={styles.gravedadText}>{nivel}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>¿Requiere ambulancia?</Text>
      <TouchableOpacity
        style={[styles.optionButton, ambulancia === true && styles.selected]}
        onPress={() => setAmbulancia(true)}
      >
        <Text style={styles.optionText}>Sí</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.optionButton, ambulancia === false && styles.selectedNo]}
        onPress={() => setAmbulancia(false)}
      >
        <Text style={styles.optionText}>No</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Observación</Text>
      <TextInput
        style={styles.textarea}
        placeholder="Nota del árbitro"
        value={observacion}
        onChangeText={setObservacion}
        multiline
        placeholderTextColor="#555"
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleRegistrarLesion}>
        <Text style={styles.submitText}>Registrar Lesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(protected)/(cedulas)/juego' as any)}>
        <Text style={styles.backText}>Volver</Text>
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
  bodyParts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  partButton: {
    backgroundColor: '#E6EFE6',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  partButtonSelected: {
    backgroundColor: '#C2EAC2',
    borderWidth: 1,
    borderColor: '#1B9D3B',
  },
  partText: {
    color: '#111',
    fontSize: 14,
  },
  gravedadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  gravedadButton: {
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  gravedadSelected: {
    borderColor: '#1B9D3B',
  },
  gravedadText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  optionButton: {
    padding: 14,
    borderRadius: 25,
    backgroundColor: '#F0F7F0',
    alignItems: 'center',
    marginBottom: 12,
  },
  selected: {
    backgroundColor: '#1B9D3B',
  },
  selectedNo: {
    backgroundColor: '#DCEADC',
  },
  optionText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '500',
  },
  textarea: {
    backgroundColor: '#E6EFE6',
    padding: 14,
    borderRadius: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    color: '#000',
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
