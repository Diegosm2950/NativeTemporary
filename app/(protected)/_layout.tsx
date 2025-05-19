import { AuthContext } from '@/context/AuthContext';
import { Redirect, Stack } from 'expo-router';
import { useContext } from 'react';

export const unsetable_settings = {
  initialRouteName: "(tabs)",
}

export default function ProtectedLayout() {

  const authState = useContext(AuthContext);

  if (!authState.isLoggedIn) {
    return <Redirect href="/login"/>
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}