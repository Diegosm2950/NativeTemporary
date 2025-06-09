import { AuthService } from "@/services/auth";
import { User } from "@/types/user";
import { SplashScreen, useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

type AuthState = {
  logIn: (credentials: LoginProps) => Promise<void>;
  logOut: () => void;
  user: User | null;
  isLoading: boolean;
  token: string | null,
  refreshUser: () => Promise<void>;
};

type LoginProps = {
  username: string,
  password: string
}

export const AuthContext = createContext<AuthState>({
  logIn: async () => {},
  logOut: () => {},
  user: null,
  isLoading: true,
  token: null, 
  refreshUser: async () => {}
});

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const authService = new AuthService();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const [storedUser, storedToken] = await Promise.all([
          authService.getUser(),
          authService.getToken()
        ]);
        
        if (storedUser && storedToken) {
          setUser(storedUser);
          setToken(storedToken);
          router.push("/(protected)/(tabs)");
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
        SplashScreen.hideAsync();
      }
    };

    checkAuth();
  }, []);

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const updatedUser = await authService.refreshUser();
      if (updatedUser) {
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logIn = async ({ username, password }: LoginProps) => {
    if (!username || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error al iniciar sesión',
        text2: 'Faltan credenciales',
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.handleLogin(username, password);

      if (response.id !== undefined && response.token) {
        const userData = await authService.getUser();
        setUser(userData);
        setToken(response.token);

        await AsyncStorage.setItem("token", response.token);
        console.log("✔️ Token guardado:", response.token);

        if (userData?.clubId) {
          await AsyncStorage.setItem("clubId", String(userData.clubId));
          console.log("✔️ Club ID guardado:", userData.clubId);
        } else {
          console.warn("⚠️ No se encontró clubId en los datos del usuario");
          await AsyncStorage.removeItem("clubId");
        }

        Toast.show({
          type: 'success',
          text1: 'Bienvenido 👋',
          text2: 'Inicio de sesión exitoso',
        });

        router.replace("/(protected)/(tabs)/perfil");
      } else {
        throw new Error('Login failed - no user ID or token returned');
      }
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error al iniciar sesión',
        text2: error.message || 'Por favor verifica tus credenciales',
      });
    } finally {
      setIsLoading(false);
    }
  };


  const logOut = async () => {
    try {
      setIsLoading(true);
      await authService.logOut();
      setUser(null);
      setToken(null);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        logIn,
        logOut,
        user,
        isLoading,
        token,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}