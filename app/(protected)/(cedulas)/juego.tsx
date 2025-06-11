import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Flag, Repeat, Pencil, Bandage } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCedula } from '@/context/CedulaContext';

export default function JuegoScreen() {
  const router = useRouter();
  const { cedulaData } = useCedula();

  const marcadorA = cedulaData.marcador.filter(p => p.equipo === 'A');
  const marcadorB = cedulaData.marcador.filter(p => p.equipo === 'B');

  const puntosA = marcadorA.length;
  const puntosB = marcadorB.length;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Image
        source={require('@/assets/images/FMRUU.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Cédula del partido</Text>

      {/* Encabezado del partido */}
      <View style={styles.matchCard}>
        <View style={styles.matchHeader}>
          <Text style={styles.badge}>
            {cedulaData.torneo || (cedulaData.tipoPartido === 'torneo' ? 'Torneo' : 'Amistoso')}
          </Text>
          <Text style={styles.badge}>Inicio: {cedulaData.horaInicio || '--:--'}</Text>
        </View>

        <View style={styles.scoreSection}>
          <Image
            style={styles.teamLogo}
            source={cedulaData.equipoLocal?.logo ? { uri: cedulaData.equipoLocal.logo } : require('@/assets/images/FMRUU.png')}
          />
          <Text style={styles.score}>{puntosA} : {puntosB}</Text>
          <Image
            style={styles.teamLogo}
            source={cedulaData.equipoVisitante?.logo ? { uri: cedulaData.equipoVisitante.logo } : require('@/assets/images/FMRUU.png')}
          />
        </View>

        <View style={styles.teamNames}>
          <Text style={styles.teamName}>{cedulaData.equipoLocal?.nombre || 'Equipo A'}</Text>
          <Text style={styles.teamName}>{cedulaData.equipoVisitante?.nombre || 'Equipo B'}</Text>
        </View>
      </View>

      {/* Tabla de puntos */}
      <View style={styles.statsTable}>
        <View style={styles.statsHeader}>
          {['#', 'Jugador', 'Acción', 'Tiempo'].map((h, i) => (
            <Text key={i} style={styles.statsCell}>{h}</Text>
          ))}
        </View>

        {[...marcadorA, ...marcadorB].map((punto, index) => (
          <View key={index} style={styles.statsRow}>
            <Text style={styles.statsCell}>{index + 1}</Text>
            <Text style={styles.statsCell}>{punto.jugador}</Text>
            <Text style={styles.statsCell}>{punto.accion}</Text>
            <Text style={styles.statsCell}>{punto.tiempo}</Text>
          </View>
        ))}
      </View>

      {/* Botones */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => router.push('/(protected)/(cedulas)/puntos')}
      >
        <Text style={styles.mainButtonText}>Agregar punto</Text>
      </TouchableOpacity>

      <View style={styles.actionGrid}>
        {[
          { label: 'Tarjetas', icon: <Flag size={28} color="#111" />, route: '/(protected)/(cedulas)/tarjeta' },
          { label: 'Cambios', icon: <Repeat size={28} color="#111" />, route: '/(protected)/(cedulas)/cambio' },
          { label: 'Observaciones', icon: <Pencil size={28} color="#111" />, route: '/(protected)/(cedulas)/observacion' },
          { label: 'Lesiones', icon: <Bandage size={28} color="#111" />, route: '/(protected)/(cedulas)/lesion' }
        ].map(({ label, icon, route }, index) => (
          <TouchableOpacity
            key={index}
            style={styles.iconButton}
            onPress={() => router.push(route)}
          >
            {icon}
            <Text style={styles.iconLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.digitalSignButton}
        onPress={() => router.push('/(protected)/(cedulas)/firmas')}
      >
        <Text style={styles.secondaryText}>Firmas Digitales</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 80,
    height: 40,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 30
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  matchCard: {
    backgroundColor: '#eee',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#ccc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
  },
  scoreSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 6,
  },
  teamLogo: {
    width: 50,
    height: 50,
  },
  score: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  teamNames: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teamName: {
    fontSize: 14,
    width: '45%',
    textAlign: 'center',
  },
  statsTable: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 4,
  },
  statsCell: {
    width: 40,
    textAlign: 'center',
    fontSize: 13,
  },
  mainButton: {
    backgroundColor: '#1B9D3B',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 16,
  },
  mainButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: '#E6EFE6',
    borderRadius: 12,
    padding: 12,
    width: '48%',
    alignItems: 'center',
    marginBottom: 8,
  },
  secondaryText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  digitalSignButton: {
    backgroundColor: '#D8F0D8',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: '#E6EFE6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    width: '22%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#111',
    textAlign: 'center',
    fontWeight: '500',
  }
});
