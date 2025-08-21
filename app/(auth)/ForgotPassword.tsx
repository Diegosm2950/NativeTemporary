import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSend = async () => {
    if (!email.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Campo requerido',
        text2: 'Ingresa tu correo electrónico',
      });
      return;
    }
    setLoading(true);
    try {
      const API_BASE_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_BASE_URL;
      const url = `${API_BASE_URL}/api/auth/forgot-password`;
      console.log('ForgotPassword: Sending POST to', url, 'with', { email });
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = text; }
      console.log('ForgotPassword: Response status', res.status, 'body:', data);
      if (!res.ok) throw new Error(data?.error || 'No se pudo enviar el correo');
      setSent(true);
      setTimer(60);
      Toast.show({
        type: 'success',
        text1: 'Correo enviado',
        text2: 'Revisa tu correo para continuar con la recuperación de contraseña.',
      });
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('ForgotPassword: Error', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.message || 'No se pudo enviar el correo',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar contraseña</Text>
      <Text style={styles.info}>Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#A1A1A1"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSend}
        disabled={loading || (timer > 0)}
      >
        <Text style={styles.buttonText}>{sent ? (timer > 0 ? `Reenviar (${timer})` : 'Reenviar') : 'Enviar'}</Text>
      </TouchableOpacity>
      {sent && (
        <Text style={styles.sentInfo}>
          Si no recibiste el correo, puedes volver a enviarlo en {timer > 0 ? `${timer} segundos` : 'ahora'}.
        </Text>
      )}
      <Text style={styles.instructions}>
        Se enviaron instrucciones a tu correo para continuar con la recuperación de la contraseña.
      </Text>
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('login' as never)}>
        <Text style={styles.backButtonText}>Volver al login</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDark ? '#020D06' : '#fff',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: isDark ? '#fff' : '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  info: {
    fontSize: 15,
    color: isDark ? '#bbb' : '#444',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: isDark ? '#1a1a1a' : '#F6F6F6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 15,
    fontSize: 16,
    color: isDark ? '#fff' : '#000',
    minWidth: 260,
    maxWidth: 360,
    width: '100%',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#28a745',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    minWidth: 200,
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sentInfo: {
    color: isDark ? '#bbb' : '#444',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  instructions: {
    color: isDark ? '#bbb' : '#444',
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#28a745',
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: 'center',
    minWidth: 200,
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#28a745',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ForgotPassword;
