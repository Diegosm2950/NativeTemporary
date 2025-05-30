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
        name="[matchId]"
        options={{
          title: 'Estadisticas de partido',
          headerShown: false,
        }}
      />
    </Stack>
  );
}