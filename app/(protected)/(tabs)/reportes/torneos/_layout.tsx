import { Stack } from 'expo-router';

export default function PartidosLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[torneoId]"
        options={{
          title: 'Estadisticas de torneo',
          headerShown: false,
        }}
      />
    </Stack>
  );
}