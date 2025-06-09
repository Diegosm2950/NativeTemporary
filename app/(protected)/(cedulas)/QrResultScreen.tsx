import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

const QrResultScreen = () => {
  const { params }: any = useRoute();
  const isDark = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const styles = getStyles(isDark);

  const [qrBase64, setQrBase64] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const jugadores: any[] = params?.jugadoresSeleccionados || [];

        // Aseguramos estructura correcta de cada jugador
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
    <View style={[styles.container, isDark && styles.containerDark]}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#53F29D"
          style={{ marginTop: 50 }}
        />
      ) : qrBase64 ? (
        <>
          <Image source={{ uri: qrBase64 }} style={styles.qrImage} />
          <TouchableOpacity style={styles.downloadButton}>
            <Text style={styles.downloadText}>Descargar código QR</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.errorText}>No se pudo cargar el código QR.</Text>
      )}
    </View>
  );
};

export default QrResultScreen;

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingTop: 40,
      backgroundColor: '#fff',
    },
    containerDark: {
      backgroundColor: '#010D06',
    },
    qrImage: {
      width: 250,
      height: 250,
      marginVertical: 40,
      borderRadius: 16,
    },
    downloadButton: {
      borderColor: '#1A2C23',
      borderWidth: 1,
      borderRadius: 999,
      paddingVertical: 14,
      paddingHorizontal: 20,
    },
    downloadText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1A2C23',
    },
    errorText: {
      color: 'red',
      fontSize: 16,
      marginVertical: 20,
    },
  });
