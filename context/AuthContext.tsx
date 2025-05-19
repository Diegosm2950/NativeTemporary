import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen, useRouter } from "expo-router";
import { createContext, PropsWithChildren, use, useEffect, useState } from "react";
import { Alert } from "react-native";
import Constants from 'expo-constants';
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

type AuthState = {
  isLoggedIn: boolean;
  isReady: boolean;
  user: UserData | null;
  logIn: (credentials: LoginProps) => void;
  logOut: () => void;
  fetchUserData: () => Promise<void>;
};

type LoginProps = {
  username: string,
  password: string
}

type UserData = {
  id: number;
  nombreCompleto: string;
  foto: string | null;
  tipoRegistro: string[];
  rol: string | null;
};

const authStorageKey = "auth-key";

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isReady: false,
  user: null,
  logIn: async () => {},
  logOut: () => {},
  fetchUserData: async () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);


  const storeAuthState = async (newState: { isLoggedIn: boolean }) => {
    try {
      const jsonValue = JSON.stringify(newState);
      await AsyncStorage.setItem(authStorageKey, jsonValue);
    } catch (error) {
      console.log("Error saving", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const id = await AsyncStorage.getItem("admin-id");
      if (!id) return;

      const API_BASE_URL = "https://fmru-next-js.vercel.app";
      const url = `${API_BASE_URL}/api/app-native-api/usuario/me?id=${id}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem("admin-token")}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch user data');

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  

  const logIn = async ({username, password}: LoginProps ) => {
    if (!username || !password) {
      Alert.alert("Campos requeridos", "Ingresa usuario y contraseña.");
      return;
    }
    try {
      const API_BASE_URL = "https://fmru-next-js.vercel.app";
      const url = `${API_BASE_URL}/api/auth/login`;

      console.log(username, password, url)
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, contrasenia: password }),
      });

      const contentType = response.headers.get("content-type");
      const rawText = await response.text();

      console.log(rawText)

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

      await AsyncStorage.setItem("admin-token", data.token);
      if (data.id) await AsyncStorage.setItem("admin-id", String(data.id));
      
      setIsLoggedIn(true);
      await storeAuthState({ isLoggedIn: true });
      await fetchUserData();
      
    } catch (error: any) {
      console.log(error)
      Toast.show({
        type: 'error',
        text1: 'Error al iniciar sesión',
        text2: error.message || 'Por favor verifica tus credenciales',
      });
    }
    router.replace("/(protected)/(tabs)/perfil");
    console.log(isLoggedIn)
  };

  const logOut = () => {
    setIsLoggedIn(false);
    storeAuthState({ isLoggedIn: false });
    router.replace("/login");
  };

  useEffect(() => {
    const getAuthFromStorage = async () => {
      await new Promise((res) => setTimeout(() => res(null), 1000));
      try {
        const value = await AsyncStorage.getItem(authStorageKey);
        if (value !== null) {
          const auth = JSON.parse(value);
          setIsLoggedIn(auth.isLoggedIn);
        }
      } catch (error) {
        console.log("Error fetching from storage", error);
      }
      setIsReady(true);
    };
    getAuthFromStorage();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return (
    <AuthContext.Provider
      value={{
        isReady,
        isLoggedIn,
        user,
        logIn,
        logOut,
        fetchUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}