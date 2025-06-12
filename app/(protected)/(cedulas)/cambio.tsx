import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCedula } from '@/context/CedulaContext';

export default function RegistrarCambio() {
  const router = useRouter();
  const { cedulaData, setCedulaData, jugadoresLocal, jugadoresVisitante, cronometro } = useCedula();

  const [equipo, setEquipo] = useState<'A' | 'B' | null>(null);
  const [jugadorSale, setJugadorSale] = useState('');
  const [jugadorEntra, setJugadorEntra] = useState('');
  const [motivo, setMotivo] = useState<'tactico' | 'lesion' | 'otro' | null>(null);

  const jugadores = equipo === 'A' ? jugadoresLocal : equipo === 'B' ? jugadoresVisitante : [];

  const formatTiempo = (milis: number) => {
    const h = Math.floor(milis / 3600000).toString().padStart(2, '0');
    const m = Math.floor((milis % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((milis % 60000) / 1000).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const tiempoActual = formatTiempo(cronometro);

  const handleGuardarCambio = () => {
    if (!equipo || !jugadorSale || !jugadorEntra) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos requeridos.');
      return;
    }

    const nombreEquipo =
      equipo === 'A' ? cedulaData.equipoLocal?.nombre : cedulaData.equipoVisitante?.nombre;

    const nuevoCambio = {
      equipo: nombreEquipo || 'Equipo',
      sale: jugadorSale,
      entra: jugadorEntra,
      tiempo: tiempoActual,
      motivo,
    };

    setCedulaData(prev => ({
      ...prev,
      cambios: Array.isArray(prev.cambios) ? [...prev.cambios, nuevoCambio] : [nuevoCambio],
    }));

    router.replace('/(protected)/(cedulas)/juego');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" />
      <Image
        source={require('@/assets/images/FMRUU.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Registrar cambio de jugador</Text>

      <View style={styles.select}>
        <Text style={{ marginBottom: 8, fontWeight: '500' }}>Selecciona el equipo:</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity onPress={() => setEquipo('A')}>
            <Text style={[styles.selectText, equipo === 'A' && { fontWeight: 'bold', color: '#1B9D3B' }]}>
              {cedulaData.equipoLocal?.nombre || 'Equipo A'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setEquipo('B')}>
            <Text style={[styles.selectText, equipo === 'B' && { fontWeight: 'bold', color: '#1B9D3B' }]}>
              {cedulaData.equipoVisitante?.nombre || 'Equipo B'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.select}>
        <Text style={{ marginBottom: 8 }}>Jugador que sale:</Text>
        {jugadores.map(j => (
          <TouchableOpacity
            key={`sale-${j.id}`}
            onPress={() => setJugadorSale(j.nombre)}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}
          >
            <Image source={{ uri: j.foto }} style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }} />
            <Text style={{ color: jugadorSale === j.nombre ? '#1B9D3B' : '#111' }}>{j.nombre}</Text>
          </TouchableOpacity>
        ))}
        {!jugadores.length && <Text style={{ color: '#999' }}>Selecciona primero un equipo</Text>}
      </View>

      <View style={styles.select}>
        <Text style={{ marginBottom: 8 }}>Jugador que entra:</Text>
        {jugadores.map(j => (
          <TouchableOpacity
            key={`entra-${j.id}`}
            onPress={() => setJugadorEntra(j.nombre)}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}
          >
            <Image source={{ uri: j.foto }} style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }} />
            <Text style={{ color: jugadorEntra === j.nombre ? '#1B9D3B' : '#111' }}>{j.nombre}</Text>
          </TouchableOpacity>
        ))}
        {!jugadores.length && <Text style={{ color: '#999' }}>Selecciona primero un equipo</Text>}
      </View>

      <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>
        Tiempo actual: <Text style={{ fontWeight: 'bold' }}>{tiempoActual}</Text>
      </Text>

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
          onPress={() => setMotivo(value as 'tactico' | 'lesion' | 'otro')}
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
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
