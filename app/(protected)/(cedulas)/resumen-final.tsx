import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useCedula } from '@/context/CedulaContext';

export default function ResumenFinalScreen() {
  const { cedulaData, cronometro } = useCedula();
  const router = useRouter();

  const formatTiempo = (milis: number) => {
    const h = Math.floor(milis / 3600000).toString().padStart(2, '0');
    const m = Math.floor((milis % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((milis % 60000) / 1000).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Resumen del Partido</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Partido:</Text>
        <Text style={styles.text}>{cedulaData.equipoLocal?.nombre} vs {cedulaData.equipoVisitante?.nombre}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Hora de inicio:</Text>
        <Text style={styles.text}>{cedulaData.horaInicio}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Tiempo registrado:</Text>
        <Text style={styles.text}>{formatTiempo(cronometro)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Puntos registrados:</Text>
        {(cedulaData.marcador || []).map((p, i) => (
          <Text key={i} style={styles.text}>
            [{p.tiempo}] {p.equipo}: {p.jugador} ({p.accion})
          </Text>
        ))}
        {cedulaData.marcador?.length === 0 && <Text style={styles.text}>Sin puntos registrados</Text>}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}>
        <Text style={styles.buttonText}>Aceptar y volver al inicio</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  text: {
    fontSize: 14,
    marginTop: 4,
    color: '#333',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#1B9D3B',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
