import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCedula } from '@/context/CedulaContext';
import CancelButton from '@/components/cancelButton';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';

export default function RegistroPuntos() {
  const router = useRouter();
  const { cedulaData, setCedulaData, jugadoresLocal, jugadoresVisitante } =
    useCedula();

  const [equipo, setEquipo] = useState<'A' | 'B'>('A');
  const [jugador, setJugador] = useState('');
  const [accion, setAccion] = useState('');
  const [tiempo, setTiempo] = useState('00:00:00');
  const [puntosTemporales, setPuntosTemporales] = useState<any[]>([]);
  const colorScheme = useColorScheme();

  const { cronometro } = useCedula();

  const actionButtonSelectedStyle = {
    backgroundColor: Colors[colorScheme].buttonSelected,
  }
  
  const teamButtonSelectedStyle = {
    backgroundColor: Colors[colorScheme].buttonSelected,
  }

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
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Registro de puntos</Text>

        {/* Tipo de Acción */}
        <View style={styles.actionContainer}>
          {[
            { label: 'Tries', puntos: 5, value: 'T' },
            { label: 'Catch', puntos: 2, value: 'C' },
            { label: 'Penalties', puntos: 3, value: 'P' },
            { label: 'Drops', puntos: 3, value: 'D' },
          ].map(({ label, puntos, value }) => (
            <TouchableOpacity
              key={label}
              style={[
                styles.actionButton,
                { backgroundColor: Colors[colorScheme].cardBackground },
                accion === value && {
                  backgroundColor: Colors[colorScheme].buttonSelected
                }
              ]}
              onPress={() => setAccion(value)}
            >
              <Text style={[
                styles.actionText, 
                { color: Colors[colorScheme].text },
                accion === value && {
                  color: Colors[colorScheme].buttonText
                }
              ]}>
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
              { backgroundColor: Colors[colorScheme].cardBackground },
              equipo === 'A' && {
                backgroundColor: Colors[colorScheme].buttonSelected
              }
            ]}
            onPress={() => setEquipo('A')}
          >
            <Text style={[
              styles.teamText,
              { color: Colors[colorScheme].text },
              equipo === 'A' && {
                color: Colors[colorScheme].buttonText
              }
            ]}>
              {cedulaData.equipoLocal?.nombre || 'Equipo A'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.teamButton,
              { backgroundColor: Colors[colorScheme].cardBackground },
              equipo === 'B' && {
                backgroundColor: Colors[colorScheme].buttonSelected
              }
            ]}
            onPress={() => setEquipo('B')}
          >
            <Text style={[
              styles.teamText,
              { color: Colors[colorScheme].text },
              equipo === 'A' && {
                color: Colors[colorScheme].buttonText
              }
            ]}>
              {cedulaData.equipoLocal?.nombre || 'Equipo B'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tiempo */}
        <TextInput
          style={[styles.timerInput, { color: Colors[colorScheme].text, borderBottomColor: Colors[colorScheme].border }]}
          value={formatTiempo(cronometro)}
          editable={false}
        />

        {/* Jugador */}
        <View style={[styles.select, { backgroundColor: Colors[colorScheme].cardBackground }]}>
          {jugadores.map((j) => (
            <TouchableOpacity
              key={j.id}
              style={{
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: Colors[colorScheme].border,
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
              <Text style={{ color: Colors[colorScheme].text }}>{j.nombre}</Text>
            </TouchableOpacity>
          ))}
          {!jugadores.length && (
            <Text style={{ color: Colors[colorScheme].textSecondary }}>
              Sin jugadores escaneados para este equipo
            </Text>
          )}
        </View>

        {/* Agregar Punto */}
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: Colors[colorScheme].buttonPrimary }]}
          onPress={handleAgregarPunto}
        >
          <Text style={[styles.submitText, { color: Colors[colorScheme].buttonText }]}>Agregar Punto</Text>
        </TouchableOpacity>

        {/* Lista de puntos temporales */}
        {puntosTemporales.length > 0 && (
          <View style={[styles.pendingPointsContainer, { backgroundColor: Colors[colorScheme].cardBackground }]}>
            <Text style={[styles.pendingPointsTitle, { color: Colors[colorScheme].text }]}>Puntos pendientes:</Text>
            {puntosTemporales.map((punto, index) => (
              <View key={index} style={styles.pendingPointRow}>
                <Text style={{ color: Colors[colorScheme].text }}>
                  {punto.jugador} ({punto.accion}) - {punto.puntos} pts
                </Text>
                <TouchableOpacity onPress={() => handleCancelarPunto(index)}>
                  <Text style={{ color: Colors[colorScheme].error }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Marcador visual */}
        <View style={[styles.scoreCard, { backgroundColor: Colors[colorScheme].cardBackground }]}>
          <Text style={[styles.teamScore, { color: Colors[colorScheme].text }]}>{marcadorA}</Text>
          <Text style={[styles.vs, { color: Colors[colorScheme].text }]}>:</Text>
          <Text style={[styles.teamScore, { color: Colors[colorScheme].text }]}>{marcadorB}</Text>
        </View>
        <View style={styles.scoreInfo}>
          <Text style={[styles.teamLabel, { color: Colors[colorScheme].textSecondary }]}>
            {cedulaData.equipoLocal?.nombre || 'Equipo A'}
          </Text>
          <Text style={[styles.fecha, { color: Colors[colorScheme].text }]}>
            Inicio: {cedulaData.horaInicio || '--:--'}
          </Text>
          <Text style={[styles.teamLabel, { color: Colors[colorScheme].textSecondary }]}>
            {cedulaData.equipoVisitante?.nombre || 'Equipo B'}
          </Text>
        </View>

        {/* Guardar */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { 
              backgroundColor: Colors[colorScheme].background,
              borderWidth: 1,
              borderColor: Colors[colorScheme].buttonPrimary
            },
          ]}
          onPress={handleGuardarMarcador}
        >
          <Text style={[styles.submitText, { color: Colors[colorScheme].buttonPrimary }]}>
            Guardar marcador y continuar
          </Text>
        </TouchableOpacity>
        <CancelButton />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 40, 
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  select: {
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
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  teamButtonSelected: {
    backgroundColor: '#1B9D3B',
  },
  teamText: {
    fontWeight: '500',
  },
  timerInput: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 16,
    borderBottomWidth: 1,
    paddingVertical: 6,
    width: 120,
    alignSelf: 'center',
  },
  submitButton: {
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 12,
  },
  submitText: {
    fontWeight: '600',
    fontSize: 16,
  },
  scoreCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
    maxWidth: '40%',
  },
  fecha: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    minWidth: '22%',
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonSelected: {
    backgroundColor: '#1B9D3B',
  },
  actionText: {
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  pendingPointsContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  pendingPointsTitle: {
    fontWeight: '600',
    marginBottom: 6,
  },
  pendingPointRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
});