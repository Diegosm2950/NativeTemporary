import { AuthContext } from '@/context/AuthContext';
import { Redirect, Stack } from 'expo-router';
import { useContext } from 'react';

export default function AuthLayout() {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Redirect href="/(protected)/(tabs)/perfil" />;
    
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="RegisterStepper" options={{ headerShown: false }} />
    </Stack>
  );
}