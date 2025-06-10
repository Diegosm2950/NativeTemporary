import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCedula } from '@/context/CedulaContext';

export default function RegistroPuntos() {
  const router = useRouter();
  const { cedulaData, setCedulaData, jugadoresLocal, jugadoresVisitante } = useCedula();

  const [equipo, setEquipo] = useState<'A' | 'B'>('A');
  const [jugador, setJugador] = useState('');
  const [accion, setAccion] = useState('');
  const [tiempo, setTiempo] = useState('00:00:00');

  const marcadorA = cedulaData.marcador.filter(p => p.equipo === 'A').length;
  const marcadorB = cedulaData.marcador.filter(p => p.equipo === 'B').length;

  const jugadores = equipo === 'A' ? jugadoresLocal : jugadoresVisitante;

  const handleAgregarPunto = () => {
    if (!equipo || !jugador || !accion || !tiempo) {
      Alert.alert('Faltan campos', 'Completa todos los datos del punto.');
      return;
    }

    const nuevoPunto = {
      equipo,
      jugador,
      accion,
      tiempo,
    };

    setCedulaData(prev => ({
      ...prev,
      marcador: [...prev.marcador, nuevoPunto],
    }));

    setJugador('');
    setAccion('');
    setTiempo('00:00:00');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" />
      <Image
        source={require('@/assets/images/FMRUU.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Registro de puntos</Text>

      {/* Tipo de Acción */}
      <TouchableOpacity style={styles.select} onPress={() => setAccion('Try')}>
        <Text style={styles.selectText}>{accion || 'Tipo de Acción'}</Text>
      </TouchableOpacity>

      {/* Equipo A / B */}
      <View style={styles.teamSwitch}>
        <TouchableOpacity
          style={[styles.teamButton, equipo === 'A' && styles.teamButtonSelected]}
          onPress={() => setEquipo('A')}
        >
          <Text style={styles.teamText}>{cedulaData.equipoLocal?.nombre || 'Equipo A'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.teamButton, equipo === 'B' && styles.teamButtonSelected]}
          onPress={() => setEquipo('B')}
        >
          <Text style={styles.teamText}>{cedulaData.equipoVisitante?.nombre || 'Equipo B'}</Text>
        </TouchableOpacity>
      </View>

      {/* Tiempo */}
      <TextInput
        style={styles.timerInput}
        value={tiempo}
        onChangeText={setTiempo}
        placeholder="00:00:00"
        keyboardType="numeric"
        maxLength={8}
      />

      {/* Jugador */}
      <View style={styles.select}>
        {jugadores.map((j) => (
          <TouchableOpacity
            key={j.id}
            style={{
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: '#ccc',
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => setJugador(j.nombre)}
          >
            <Image source={{ uri: j.foto }} style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }} />
            <Text>{j.nombre}</Text>
          </TouchableOpacity>
        ))}
        {!jugadores.length && (
          <Text style={{ color: '#999' }}>Sin jugadores escaneados para este equipo</Text>
        )}
      </View>

      {/* Agregar Punto */}
      <TouchableOpacity style={styles.submitButton} onPress={handleAgregarPunto}>
        <Text style={styles.submitText}>Agregar Punto</Text>
      </TouchableOpacity>

      {/* Marcador visual */}
      <View style={styles.scoreCard}>
        <Text style={styles.teamScore}>{marcadorA}</Text>
        <Text style={styles.vs}>:</Text>
        <Text style={styles.teamScore}>{marcadorB}</Text>
      </View>
      <View style={styles.scoreInfo}>
        <Text style={styles.teamLabel}>{cedulaData.equipoLocal?.nombre || 'Equipo A'}</Text>
        <Text style={styles.fecha}>Inicio: {cedulaData.horaInicio || '--:--'}</Text>
        <Text style={styles.teamLabel}>{cedulaData.equipoVisitante?.nombre || 'Equipo B'}</Text>
      </View>

      {/* Guardar */}
      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#1B9D3B' }]}
        onPress={() => router.back()}
      >
        <Text style={[styles.submitText, { color: '#1B9D3B' }]}>
          Guardar marcador y continuar
        </Text>
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
    marginVertical: 12,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  scoreCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
  },
  teamScore: {
    fontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
  vs: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 8,
  },
  teamLabel: {
    fontSize: 12,
    color: '#555',
    maxWidth: '40%',
  },
  fecha: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
});
