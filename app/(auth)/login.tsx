import React, { useContext, useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { AuthContext } from '@/context/AuthContext';
import { router } from 'expo-router';
import { usePushNotifications } from '@/hooks/usePushNotifications';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { expoPushToken } = usePushNotifications();
  const expoPushTokenString = expoPushToken?.data

  const authContext = useContext(AuthContext)

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);

  const handleLogin = () => {
    const lowercaseUsername = username.toLowerCase();
    authContext.logIn({ username: lowercaseUsername, password, expoPushTokenString });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>¡Bienvenido de nuevo!</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#555"
        autoCapitalize="none" 
        keyboardType="email-address" 
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#555"
      />

      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={handleLogin}
      >
        <Text style={styles.loginText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.push("/(auth)/ForgotPassword")}
      >
        <Text style={styles.linkText}>Olvidé mi contraseña</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/(auth)/RegisterContainer")}
      >
        <Text style={styles.createText}>Crear cuenta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default LoginScreen;

const getStyles = (dark: boolean) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: dark ? '#020D06' : '#fff',
      padding: 24,
      justifyContent: 'center',
    },
    logo: {
      width: 130,
      height: 130,
      alignSelf: 'center',
      marginBottom: 32,
    },
    title: {
      fontSize: 34,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 32,
      color: dark ? '#fff' : '#000',
    },
    input: {
      backgroundColor: dark ? '#B8E0C51F' : '#EFF3F0',
      padding: 14,
      borderRadius: 12,
      fontSize: 16,
      marginBottom: 16,
      color: dark ? '#fff' : '#000',
    },
    loginButton: {
      backgroundColor: '#1B9142',
      paddingVertical: 14,
      borderRadius: 25,
      alignItems: 'center',
      marginTop: 12,
    },
    loginText: {
      color: '#fff',
      fontWeight: '500',
      fontSize: 16,
    },
    linkButton: {
      marginTop: 16,
      alignItems: 'center',
      backgroundColor: dark ? '#B8E0C51F' : '#31724717',
      borderRadius: 25,
      paddingVertical: 12,
    },
    linkText: {
      color: dark ? '#fff' : '#000',
      fontWeight: '500',
      fontSize: 14,
    },
    createButton: {
      marginTop: 24,
      borderWidth: 1,
      borderColor: '#1B9142',
      borderRadius: 25,
      paddingVertical: 12,
      alignItems: 'center',
    },
    createText: {
      color: dark ? '#fff' : '#000',
      fontWeight: '500',
      fontSize: 15,
    },
  });