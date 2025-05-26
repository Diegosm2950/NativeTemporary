import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { useCedula } from '@/context/CedulaContext';

type Player = {
  id: number;
  nombre: string;
  dorsal: number;
  posicion: number;
  foto: string;
};

export default function QRScanner() {
  const router = useRouter();
  const { matchId } = useLocalSearchParams();
  const { setCedulaData } = useCedula();
  const [permission, requestPermission] = useCameraPermissions();

  const [scanningTeam, setScanningTeam] = useState<'local' | 'visitante' | null>(null);
  const [localPlayers, setLocalPlayers] = useState<Player[]>([]);
  const [visitorPlayers, setVisitorPlayers] = useState<Player[]>([]);

  if (!matchId) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 16, color: '#333' }}>
          ❌ No se proporcionó un ID de partido.
        </Text>
      </View>
    );
  }

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await fetch(
          `https://fmru-next-js.vercel.app/api/app-native-api/partidos/listar-partido-especifico-torneo?id=${matchId}`
        );
        const data = await res.json();

        setCedulaData(prev => ({
          ...prev,
          partidoId: Number(matchId),
          tipoPartido: data.tipo || 'torneo',
          horaInicio: data.horario || '16:00',
          estadoTerreno: data.estado || 'Bueno',
        }));
      } catch (err) {
        console.error('Error al obtener el partido:', err);
      }
    };

    fetchMatch();
  }, [matchId]);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Cargando permisos de cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Se necesita permiso para usar la cámara</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Permitir cámara</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Cancelar o Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    try {
      const players: Player[] = JSON.parse(data);
      if (scanningTeam === 'local') setLocalPlayers(players);
      else if (scanningTeam === 'visitante') setVisitorPlayers(players);
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
        <Text style={[styles.tableCell, { flex: 0.5, fontWeight: 'bold' }]}>#</Text>
        <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Nombre</Text>
        <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]}>ID</Text>
        <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]}>Posición</Text>
      </View>
      {players.map((p) => (
        <View key={p.id} style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 0.5 }]}>{p.dorsal}</Text>
          <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: p.foto }} style={styles.avatar} />
            <Text style={[styles.tableCell, { marginLeft: 6 }]}>{p.nombre}</Text>
          </View>
          <Text style={[styles.tableCell, { flex: 1 }]}>{p.id}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{p.posicion}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/FMRUU.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Escanear Equipos</Text>
        </View>

        {scanningTeam && (
          <View style={{ marginBottom: 20 }}>
            <View style={styles.cameraContainer}>
              <CameraView
                style={styles.camera}
                onBarcodeScanned={handleBarCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              />
            </View>
            <TouchableOpacity
              style={[styles.secondaryButton, { marginTop: 12 }]}
              onPress={() => setScanningTeam(null)}
            >
              <Text style={styles.secondaryButtonText}>Cancelar escaneo</Text>
            </TouchableOpacity>
          </View>
        )}

        {!scanningTeam && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setScanningTeam('local')}
            >
              <Text style={styles.buttonText}>
                {localPlayers.length ? 'Reescanear Equipo Local' : 'Escanear Equipo Local'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setScanningTeam('visitante')}
            >
              <Text style={styles.buttonText}>
                {visitorPlayers.length ? 'Reescanear Equipo Visitante' : 'Escanear Equipo Visitante'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {localPlayers.length > 0 && renderPlayerList(localPlayers, 'Equipo A')}
        {visitorPlayers.length > 0 && renderPlayerList(visitorPlayers, 'Equipo B')}

        {(localPlayers.length || visitorPlayers.length) > 0 && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                setLocalPlayers([]);
                setVisitorPlayers([]);
              }}
            >
              <Text style={styles.secondaryButtonText}>Borrar escaneos</Text>
            </TouchableOpacity>
          </View>
        )}

        {localPlayers.length > 0 && visitorPlayers.length > 0 && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/(protected)/(cedulas)/juego' as any)}
            >
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
    backgroundColor: '#fff',
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
  logo: {
    width: 80,
    height: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
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
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
    color: '#333',
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
    backgroundColor: '#F9F9F9',
  },
  teamHeader: {
    backgroundColor: '#E7F4EC',
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
    backgroundColor: '#F0F0F0',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
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
