import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { SplashScreen } from 'expo-router';
import { AuthProvider } from "@/context/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    useFrameworkReady();

    const [fontsLoaded, fontError] = useFonts({
      'Inter-Regular': Inter_400Regular,
      'Inter-Medium': Inter_500Medium,
      'Inter-SemiBold': Inter_600SemiBold,
      'Inter-Bold': Inter_700Bold,
      'Poppins-Medium': Poppins_500Medium,
      'Poppins-SemiBold': Poppins_600SemiBold, 
      'Poppins-Bold': Poppins_700Bold,
    });
  
    useEffect(() => {
      if (fontsLoaded || fontError) {
        SplashScreen.hideAsync();
      }
    }, [fontsLoaded, fontError]);
  
    if (!fontsLoaded && !fontError) {
      return null;
    }
    return (
        <AuthProvider>
            <React.Fragment>
                <StatusBar style="auto" />
                <Stack>
                    <Stack.Screen name="(protected)" options={{
                        headerShown: false
                    }}/>
                </Stack>
            </React.Fragment>
        </AuthProvider>
    )
}