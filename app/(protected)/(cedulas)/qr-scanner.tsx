import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { useCedula } from '@/context/CedulaContext';
import useColorScheme from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';

type Player = {
  id: number;
  nombre: string;
  dorsal: number;
  posicion: number;
  foto: string;
};

export default function QRScanner() {
  const router = useRouter();
  const { match } = useLocalSearchParams();
  const matchData = useMemo(() => {
    return match ? JSON.parse(match as string) : null;
  }, [match]);
  const colorScheme = useColorScheme();

  const { setCedulaData, setJugadoresLocal, setJugadoresVisitante } = useCedula();
  const [permission, requestPermission] = useCameraPermissions();

  const [scanningTeam, setScanningTeam] = useState<'local' | 'visitante' | null>(null);
  const [localPlayers, setLocalPlayers] = useState<Player[]>([]);
  const [visitorPlayers, setVisitorPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (matchData) {
      setCedulaData(prev => ({
        ...prev,
        partidoId: matchData.id,
        tipoPartido: matchData.tipo || 'torneo',
        horaInicio: matchData.hora || '16:00',
        estadoTerreno: matchData.estado || 'Bueno',
        equipoLocal: matchData.equipoLocal,
        equipoVisitante: matchData.equipoVisitante,
        torneo: matchData.torneo,
      }));
    }
  }, [matchData]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    try {
      const players = JSON.parse(data);

      if (!Array.isArray(players)) throw new Error();

      if (scanningTeam === 'local') {
        setLocalPlayers(players);
        setJugadoresLocal(players);
        setCedulaData(prev => ({
          ...prev,
          participantesLocal: players,
        }));
      } else if (scanningTeam === 'visitante') {
        setVisitorPlayers(players);
        setJugadoresVisitante(players);
        setCedulaData(prev => ({
          ...prev,
          participantesVisitante: players,
        }));
      }
    } catch (error) {
      alert('QR inválido o estructura incorrecta.');
    } finally {
      setScanningTeam(null);
    }
  };

  const renderPlayerList = (players: Player[], label: string) => (
    <View style={styles.playerListContainer}>
      <View style={styles.teamHeader}>
        <Text style={styles.teamHeaderText}>{label}</Text>
      </View>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableCell, { flex: 0.5, fontWeight: 'bold', color: Colors[colorScheme].text }]}>#</Text>
        <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold', color: Colors[colorScheme].text }]}>Nombre</Text>
        <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold', color: Colors[colorScheme].text }]}>ID</Text>
        <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold', color: Colors[colorScheme].text }]}>Posición</Text>
      </View>
      <FlatList
        data={players}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: p }) => (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 0.5 }]}>{p.dorsal}</Text>
            <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
              <Image source={{ uri: p.foto }} style={styles.avatar} />
              <Text style={[styles.tableCell, { marginLeft: 6, color: Colors[colorScheme].text }]}>{p.nombre}</Text>
            </View>
            <Text style={[styles.tableCell, { flex: 1, color: Colors[colorScheme].text }]}>{p.id}</Text>
            <Text style={[styles.tableCell, { flex: 1, color: Colors[colorScheme].text }]}>{p.posicion}</Text>
          </View>
        )}
        scrollEnabled={false}
      />
    </View>
  );
  

  if (!permission) {
    return <View style={styles.container}><Text>Cargando permisos de cámara...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
        <Text style={[styles.permissionText, {color: Colors[colorScheme].text} ]}>Se necesita permiso para usar la cámara</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
          <Text style={[styles.buttonText, {color: Colors[colorScheme].buttonSecondary}]}>Permitir cámara</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={[styles.secondaryButtonText, { color: Colors[colorScheme].buttonSecondary }]}>Cancelar o Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, {color: Colors[colorScheme].text}]}>Escanear Equipos</Text>
        </View>

        {scanningTeam && (
          <>
            <View style={styles.cameraContainer}>
              <CameraView
                style={styles.camera}
                onBarcodeScanned={handleBarCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              />
            </View>
            <TouchableOpacity style={[styles.secondaryButton, { marginTop: 12 }, {backgroundColor: Colors[colorScheme].cardBackground}]} onPress={() => setScanningTeam(null)}>
              <Text style={[styles.secondaryButtonText, {color: Colors[colorScheme].buttonPrimary}]}>Cancelar escaneo</Text>
            </TouchableOpacity>
          </>
        )}

        {!scanningTeam && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setScanningTeam('local')}>
              <Text style={styles.buttonText}>{localPlayers.length ? 'Reescanear Equipo Local' : 'Escanear Equipo Local'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setScanningTeam('visitante')}>
              <Text style={styles.buttonText}>{visitorPlayers.length ? 'Reescanear Equipo Visitante' : 'Escanear Equipo Visitante'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {localPlayers.length > 0 && renderPlayerList(localPlayers, 'Equipo A')}
        {visitorPlayers.length > 0 && renderPlayerList(visitorPlayers, 'Equipo B')}

        {(localPlayers.length || visitorPlayers.length) > 0 && (
          <TouchableOpacity style={styles.secondaryButton} onPress={() => {
            setLocalPlayers([]);
            setVisitorPlayers([]);
          }}>
            <Text style={styles.secondaryButtonText}>Borrar escaneos</Text>
          </TouchableOpacity>
        )}

        {localPlayers.length > 0 && visitorPlayers.length > 0 && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(protected)/(cedulas)/juego')}>
              <Text style={styles.buttonText}>Empezar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
              <Text style={styles.secondaryButtonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  cameraContainer: {
    height: 300,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  primaryButton: {
    backgroundColor: '#1B9D3B',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 6,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: "#fff"
  },
  secondaryButton: {
    backgroundColor: '#F0F7F0',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 6,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  permissionText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  playerListContainer: {
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  teamHeader: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  teamHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1B9D3B',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
});
