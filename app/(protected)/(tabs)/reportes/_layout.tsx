import { Stack } from 'expo-router';

export default function ReportesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="globales"
        options={{
          title: 'Estadísticas Globales',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="torneos"
        options={{
          title: 'Estadísticas por Torneo',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="partidos"
        options={{
          title: 'Estadísticas por Partidos',
          headerShown: false,
        }}
      />
    </Stack>
  );
}