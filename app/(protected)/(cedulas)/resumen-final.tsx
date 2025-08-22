import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useCedula } from '@/context/CedulaContext';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';

export default function ResumenFinalScreen() {
  const { cedulaData, cronometro } = useCedula();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const formatTiempo = (milis: number) => {
    const h = Math.floor(milis / 3600000).toString().padStart(2, '0');
    const m = Math.floor((milis % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((milis % 60000) / 1000).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleAccept = () => {
    router.dismissTo("/");
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Resumen del Partido</Text>

      <View style={[styles.section, { backgroundColor: Colors[colorScheme].inputBackground }]}>
        <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Partido:</Text>
        <Text style={[styles.text, { color: Colors[colorScheme].text }]}>
          {cedulaData.equipoLocal?.nombre} vs {cedulaData.equipoVisitante?.nombre}
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: Colors[colorScheme].inputBackground }]}>
        <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Hora de inicio:</Text>
        <Text style={[styles.text, { color: Colors[colorScheme].text }]}>{cedulaData.horaInicio}</Text>
      </View>

      <View style={[styles.section, { backgroundColor: Colors[colorScheme].inputBackground }]}>
        <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Tiempo registrado:</Text>
        <Text style={[styles.text, { color: Colors[colorScheme].text }]}>{formatTiempo(cronometro)}</Text>
      </View>

      <View style={[styles.section, { backgroundColor: Colors[colorScheme].inputBackground }]}>
        <Text style={[styles.label, { color: Colors[colorScheme].text }]}>Puntos registrados:</Text>
        {(cedulaData.marcador || []).length > 0 ? (
          (cedulaData.marcador || []).map((p, i) => (
            <View key={i} style={styles.pointItem}>
              <Text style={[styles.pointText, { color: Colors[colorScheme].text }]}>
                [{p.tiempo}] {p.equipo}: {p.jugador} ({p.accion})
              </Text>
            </View>
          ))
        ) : (
          <Text style={[styles.text, { color: Colors[colorScheme].textSecondary }]}>
            Sin puntos registrados
          </Text>
        )}
      </View>

      <TouchableOpacity 
        style={[
          styles.button, 
          { backgroundColor: Colors[colorScheme].buttonPrimary }
        ]} 
        onPress={handleAccept}
      >
        <Text style={[styles.buttonText, { color: Colors[colorScheme].buttonText }]}>
          Aceptar y volver al inicio
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
  },
  pointItem: {
    marginBottom: 8,
  },
  pointText: {
    fontSize: 14,
  },
  button: {
    marginTop: 30,
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});