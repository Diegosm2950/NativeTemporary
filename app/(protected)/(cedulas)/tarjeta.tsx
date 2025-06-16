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
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCedula } from '@/context/CedulaContext';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';

export default function RegistrarTarjeta() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const {
    cedulaData,
    setCedulaData,
    jugadoresLocal,
    jugadoresVisitante,
    cronometro,
  } = useCedula();

  const [equipo, setEquipo] = useState<'A' | 'B' | null>(null);
  const [jugador, setJugador] = useState('');
  const [color, setColor] = useState<'T-A' | 'T-R' | null>(null);
  const [observacion, setObservacion] = useState('');

  const formatTiempo = (milis: number) => {
    const h = Math.floor(milis / 3600000).toString().padStart(2, '0');
    const m = Math.floor((milis % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((milis % 60000) / 1000).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleRegistrar = () => {
    const tiempoActual = formatTiempo(cronometro);

    if (!equipo || !jugador || !color || !observacion.trim()) {
      Alert.alert('Faltan campos', 'Completa todos los campos para registrar la tarjeta.');
      return;
    }

    const nombreEquipo =
      equipo === 'A' ? cedulaData.equipoLocal?.nombre : cedulaData.equipoVisitante?.nombre;

    const nuevaTarjeta = {
      equipo: nombreEquipo,
      jugador,
      tipo: color,
      minuto: tiempoActual,
      observacion,
    };

    setCedulaData((prev) => ({
      ...prev,
      tarjetas: [...prev.tarjetas, nuevaTarjeta],
    }));

    router.replace('/(protected)/(cedulas)/juego' as any);
  };

  const jugadores = equipo === 'A' ? jugadoresLocal : equipo === 'B' ? jugadoresVisitante : [];

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: Colors[colorScheme].background }]}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Image
          source={require('@/assets/images/FMRUU.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Registrar Tarjeta</Text>

        <View style={styles.teamSwitch}>
          <TouchableOpacity
            style={[
              styles.teamButton, 
              { backgroundColor: Colors[colorScheme].buttonSecondary },
              equipo === 'A' && [styles.teamButtonSelected, { backgroundColor: Colors[colorScheme].buttonPrimary }]
            ]}
            onPress={() => setEquipo('A')}
          >
            <Text style={[styles.teamText, { color: Colors[colorScheme].buttonTextSecondary }]}>
              {cedulaData.equipoLocal?.nombre || 'Equipo A'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.teamButton, 
              { backgroundColor: Colors[colorScheme].buttonSecondary },
              equipo === 'B' && [styles.teamButtonSelected, { backgroundColor: Colors[colorScheme].buttonPrimary }]
            ]}
            onPress={() => setEquipo('B')}
          >
            <Text style={[styles.teamText, { color: Colors[colorScheme].buttonTextSecondary }]}>
              {cedulaData.equipoVisitante?.nombre || 'Equipo B'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.select, { backgroundColor: Colors[colorScheme].inputBackground }]}>
          <Text style={[styles.selectText, { color: jugador ? Colors[colorScheme].text : Colors[colorScheme].textSecondary }]}>
            {jugador || 'Seleccionar jugador'}
          </Text>
        </TouchableOpacity>

        {jugadores.map((j) => (
          <TouchableOpacity 
            key={j.id} 
            style={[styles.select, { backgroundColor: Colors[colorScheme].inputBackground }]} 
            onPress={() => setJugador(j.nombre)}
          >
            <Text style={[styles.selectText, { color: Colors[colorScheme].text }]}>{j.nombre}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.colorRow}>
          <TouchableOpacity onPress={() => setColor('T-A')} style={styles.colorOption}>
            <View
              style={[
                styles.colorBox,
                {
                  backgroundColor: '#FFD700',
                  borderColor: color === 'T-A' ? Colors[colorScheme].text : '#FFD700',
                },
              ]}
            />
            <Text style={[styles.colorText, { color: Colors[colorScheme].text }]}>Amarilla</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setColor('T-R')} style={styles.colorOption}>
            <View
              style={[
                styles.colorBox,
                {
                  backgroundColor: '#FF4C4C',
                  borderColor: color === 'T-R' ? Colors[colorScheme].text : '#FF4C4C',
                },
              ]}
            />
            <Text style={[styles.colorText, { color: Colors[colorScheme].text }]}>Roja</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[
            styles.timerInput, 
            { 
              backgroundColor: Colors[colorScheme].inputBackground,
              color: Colors[colorScheme].text,
              borderColor: Colors[colorScheme].border
            }
          ]}
          value={formatTiempo(cronometro)}
          editable={false}
        />

        <TextInput
          style={[
            styles.input, 
            { 
              backgroundColor: Colors[colorScheme].inputBackground,
              color: Colors[colorScheme].text,
              borderColor: Colors[colorScheme].border
            }
          ]}
          placeholder="Observación Breve"
          value={observacion}
          onChangeText={setObservacion}
          placeholderTextColor={Colors[colorScheme].textSecondary}
          multiline
        />

        <TouchableOpacity 
          style={[styles.submitButton, { backgroundColor: Colors[colorScheme].buttonPrimary }]} 
          onPress={handleRegistrar}
        >
          <Text style={[styles.submitText, { color: Colors[colorScheme].buttonText }]}>Registrar Tarjeta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: Colors[colorScheme].buttonSecondary }]}
          onPress={() => router.replace('/(protected)/(cedulas)/juego' as any)}
        >
          <Text style={[styles.backText, { color: Colors[colorScheme].buttonTextSecondary }]}>Volver</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 8,
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
  teamSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  teamButton: {
    flex: 1,
    backgroundColor: '#E6EFE6',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  teamButtonSelected: {
    backgroundColor: '#1B9D3B',
  },
  teamText: {
    color: '#111',
    fontWeight: '500',
  },
});
