import React from 'react';
import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="edit"
        options={{ headerShown: false, presentation: 'modal' }}
      />
      <Stack.Screen
        name="TeamPlayerScreen"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}