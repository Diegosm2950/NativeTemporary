import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCedula } from '@/context/CedulaContext';
import CancelButton from '@/components/cancelButton';

export default function RegistroPuntos() {
  const router = useRouter();
  const { cedulaData, setCedulaData, jugadoresLocal, jugadoresVisitante } =
    useCedula();

  const [equipo, setEquipo] = useState<'A' | 'B'>('A');
  const [jugador, setJugador] = useState('');
  const [accion, setAccion] = useState('');
  const [tiempo, setTiempo] = useState('00:00:00');
  const [puntosTemporales, setPuntosTemporales] = useState<any[]>([]);

  const { cronometro } = useCedula();

  const formatTiempo = (milis: number) => {
    const h = Math.floor(milis / 3600000).toString().padStart(2, '0');
    const m = Math.floor((milis % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((milis % 60000) / 1000).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const calcularPuntos = (equipo: 'A' | 'B') => {
    return cedulaData.marcador
      .filter((p) => p.equipo === equipo)
      .reduce((total, punto) => {
        switch (punto.accion) {
          case 'T':
            return total + 5;
          case 'C':
            return total + 2;
          case 'P':
            return total + 3;
          case 'D':
            return total + 3;
          default:
            return total;
        }
      }, 0);
  };

  const marcadorA =
    calcularPuntos('A') +
    puntosTemporales
      .filter((p) => p.equipo === 'A')
      .reduce((acc, p) => acc + p.puntos, 0);
  const marcadorB =
    calcularPuntos('B') +
    puntosTemporales
      .filter((p) => p.equipo === 'B')
      .reduce((acc, p) => acc + p.puntos, 0);

  const jugadores = equipo === 'A' ? jugadoresLocal : jugadoresVisitante;

  const getPuntos = (accion: string) => {
    switch (accion) {
      case 'T':
        return 5;
      case 'C':
        return 2;
      case 'P':
        return 3;
      case 'D':
        return 3;
      default:
        return 0;
    }
  };

  const handleAgregarPunto = () => {
    const tiempoActual = formatTiempo(cronometro);

    if (!equipo || !jugador || !accion) {
      Alert.alert('Faltan campos', 'Completa todos los datos del punto.');
      return;
    }

    const nuevoPunto = {
      equipo,
      jugador,
      accion,
      tiempo: tiempoActual,
      puntos: getPuntos(accion),
    };

    setPuntosTemporales((prev) => [...prev, nuevoPunto]);

    setJugador('');
    setAccion('');
    setTiempo('00:00:00');
  };

  const handleCancelarPunto = (index: number) => {
    setPuntosTemporales((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGuardarMarcador = () => {
    setCedulaData((prev) => ({
      ...prev,
      marcador: [...prev.marcador, ...puntosTemporales],
    }));
    setPuntosTemporales([]);
    router.back();
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
      <View style={styles.actionContainer}>
        {[
          { label: 'T', puntos: 5 },
          { label: 'C', puntos: 2 },
          { label: 'P', puntos: 3 },
          { label: 'D', puntos: 3 },
        ].map(({ label, puntos }) => (
          <TouchableOpacity
            key={label}
            style={[
              styles.actionButton,
              accion === label && styles.actionButtonSelected,
            ]}
            onPress={() => setAccion(label)}
          >
            <Text style={styles.actionText}>
              {label} ({puntos} pts)
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Equipo A / B */}
      <View style={styles.teamSwitch}>
        <TouchableOpacity
          style={[
            styles.teamButton,
            equipo === 'A' && styles.teamButtonSelected,
          ]}
          onPress={() => setEquipo('A')}
        >
          <Text style={styles.teamText}>
            {cedulaData.equipoLocal?.nombre || 'Equipo A'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.teamButton,
            equipo === 'B' && styles.teamButtonSelected,
          ]}
          onPress={() => setEquipo('B')}
        >
          <Text style={styles.teamText}>
            {cedulaData.equipoVisitante?.nombre || 'Equipo B'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tiempo */}
      <TextInput
        style={styles.timerInput}
        value={formatTiempo(cronometro)}
        editable={false}
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
            <Image
              source={{ uri: j.foto }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                marginRight: 8,
              }}
            />
            <Text>{j.nombre}</Text>
          </TouchableOpacity>
        ))}
        {!jugadores.length && (
          <Text style={{ color: '#999' }}>
            Sin jugadores escaneados para este equipo
          </Text>
        )}
      </View>

      {/* Agregar Punto */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleAgregarPunto}
      >
        <Text style={styles.submitText}>Agregar Punto</Text>
      </TouchableOpacity>

      {/* Lista de puntos temporales */}
      {puntosTemporales.length > 0 && (
        <View style={{ marginTop: 10, padding: 10, backgroundColor: '#F3F8F3', borderRadius: 10 }}>
          <Text style={{ fontWeight: '600', marginBottom: 6 }}>Puntos pendientes:</Text>
          {puntosTemporales.map((punto, index) => (
            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text>{punto.jugador} ({punto.accion}) - {punto.puntos} pts</Text>
              <TouchableOpacity onPress={() => handleCancelarPunto(index)}>
                <Text style={{ color: 'red' }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Marcador visual */}
      <View style={styles.scoreCard}>
        <Text style={styles.teamScore}>{marcadorA}</Text>
        <Text style={styles.vs}>:</Text>
        <Text style={styles.teamScore}>{marcadorB}</Text>
      </View>
      <View style={styles.scoreInfo}>
        <Text style={styles.teamLabel}>
          {cedulaData.equipoLocal?.nombre || 'Equipo A'}
        </Text>
        <Text style={styles.fecha}>
          Inicio: {cedulaData.horaInicio || '--:--'}
        </Text>
        <Text style={styles.teamLabel}>
          {cedulaData.equipoVisitante?.nombre || 'Equipo B'}
        </Text>
      </View>

      {/* Guardar */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: '#fff', borderWidth: 1, borderColor: '#1B9D3B' },
        ]}
        onPress={handleGuardarMarcador}
      >
        <Text style={[styles.submitText, { color: '#1B9D3B' }]}>
          Guardar marcador y continuar
        </Text>
      </TouchableOpacity>
      <CancelButton />
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
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#E6EFE6',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonSelected: {
    backgroundColor: '#1B9D3B',
  },
  actionText: {
    color: '#111',
    fontWeight: '600',
  },
});
