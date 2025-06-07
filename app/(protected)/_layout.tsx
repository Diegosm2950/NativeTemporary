import { Stack } from 'expo-router';

export const unsetable_settings = {
  initialRouteName: "(tabs)",
}

export default function ProtectedLayout() {

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}