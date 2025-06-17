import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';

const QrResultScreen = () => {
  const { params }: any = useRoute();
  const colorScheme = useColorScheme();
  const [qrBase64, setQrBase64] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const jugadores: any[] = params?.jugadoresSeleccionados || [];

        const jugadoresFormatted = jugadores.map((j) => {
          const partes = j.name?.split(' ') || [];
          return {
            id: j.id,
            nombre: partes[0] || '',
            apellido_paterno: partes[1] || '',
            apellido_materno: partes[2] || '',
            clubId: j.clubId,
            club: j.club,
          };
        });

        const API_BASE_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_BASE_URL;
        const response = await fetch(`${API_BASE_URL}/api/app-native-api/qrs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jugadores: jugadoresFormatted }),
        });

        const data = await response.json();

        if (!response.ok || !data.qr) {
          throw new Error(data?.mensaje || 'Error al generar QR');
        }

        setQrBase64(data.qr);
      } catch (error: any) {
        console.error(error);
        Alert.alert(
          'Error',
          error.message || 'No se pudo generar el código QR'
        );
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [params]);

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme].buttonPrimary}
          style={{ marginTop: 50 }}
        />
      ) : qrBase64 ? (
        <>
          <Image source={{ uri: qrBase64 }} style={styles.qrImage} />
          <TouchableOpacity style={[styles.downloadButton, { borderColor: Colors[colorScheme].border }]}>
            <Text style={[styles.downloadText, { color: Colors[colorScheme].text }]}>
              Toma una captura de pantalla
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={[styles.errorText, { color: Colors[colorScheme].error }]}>
          No se pudo cargar el código QR.
        </Text>
      )}
    </View>
  );
};

export default QrResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrImage: {
    width: 250,
    height: 250,
    marginVertical: 40,
    borderRadius: 16,
  },
  downloadButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  downloadText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    marginVertical: 20,
  },
});