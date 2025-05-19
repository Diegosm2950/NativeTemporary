// src/api/auth.ts
import Constants from 'expo-constants';
import Toast from 'react-native-toast-message';

export const login = async (email: string, password: string) => {
  try {
    const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
    const url = `${API_BASE_URL}/api/auth/login`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, contrasenia: password }),
    });

    const contentType = response.headers.get("content-type");
    const rawText = await response.text();

    if (!response.ok) {
      const mensaje = contentType?.includes("application/json")
        ? JSON.parse(rawText).mensaje || JSON.parse(rawText).error || "Error desconocido"
        : "Error inesperado del servidor";
      throw new Error(mensaje);
    }

    const data = contentType?.includes("application/json") ? JSON.parse(rawText) : null;

    if (!data || !data.token) {
      throw new Error("Respuesta inválida del servidor");
    }

    Toast.show({
      type: 'success',
      text1: 'Bienvenido 👋',
      text2: 'Inicio de sesión exitoso',
    });

    return data;
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Error al iniciar sesión',
    });
    throw error;
  }
};