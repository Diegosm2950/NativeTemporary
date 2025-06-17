import { Stack } from 'expo-router';
import { CedulaProvider } from '@/context/CedulaContext';
import { View, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { Logo } from '@/components/ui/Logo';

export default function CedulasLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <CedulaProvider>
      <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
        <Logo />
        <Stack>
          <Stack.Screen
            name="qr-scanner"
            options={{
              headerShown: false,
              title: 'Escanear QR',
            }}
          />
          <Stack.Screen
            name="resumen-final"
            options={{
              headerShown: false,
              title: 'Resumen final',
            }}
          />
          <Stack.Screen
            name="juego"
            options={{
              headerShown: false,
              title: 'Cédula del partido',
            }}
          />
          <Stack.Screen
            name="ConfirmGenerateQR"
            options={{
              headerShown: false,
              title: 'Confirmar QR',
            }}
          />
          <Stack.Screen
            name="puntos"
            options={{
              headerShown: false,
              title: 'Registrar puntos',
            }}
          />
          <Stack.Screen
            name="cambio"
            options={{
              headerShown: false,
              title: 'Registrar cambio',
            }}
          />
          <Stack.Screen
            name="QrResultScreen"
            options={{
              headerShown: false,
              title: 'QrResult',
            }}
          />
          <Stack.Screen
            name="lesion"
            options={{
              headerShown: false,
              title: 'Registrar lesión',
            }}
          />
          <Stack.Screen
            name="tarjeta"
            options={{
              headerShown: false,
              title: 'Registrar tarjeta',
            }}
          />
          <Stack.Screen
            name="firmas"
            options={{
              headerShown: false,
              title: 'Firmas digitales',
            }}
          />
          <Stack.Screen
            name="observacion"
            options={{
              headerShown: false,
              title: 'Observación arbitral',
            }}
          />
          <Stack.Screen
            name="SeleccionarJugadores"
            options={{
              headerShown: false,
              title: 'Seleccionar jugadores',
            }}
          />
        </Stack>
      </View>
    </CedulaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});