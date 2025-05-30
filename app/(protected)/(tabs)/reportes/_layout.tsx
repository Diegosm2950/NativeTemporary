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
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="torneos"
        options={{
          title: 'Estadísticas por Torneo',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="partidos"
        options={{
          title: 'Estadísticas por Partidos',
          headerShown: true,
        }}
      />
    </Stack>
  );
}