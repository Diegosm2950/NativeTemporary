import { Stack } from 'expo-router';
import { CedulaProvider } from '@/context/CedulaContext';

export default function CedulasLayout() {
  return (
    <CedulaProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="qr-scanner"
          options={{
            headerShown: false,
            title: 'Escanear QR',
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
      </Stack>
    </CedulaProvider>
  );
}
