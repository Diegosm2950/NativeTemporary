import { AuthContext } from '@/context/AuthContext';
import { Redirect, Stack } from 'expo-router';
import { useContext } from 'react';

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