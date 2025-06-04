import { AuthService } from "@/services/auth";
import { User } from "@/types/user";
import { SplashScreen, useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

type AuthState = {
  logIn: (credentials: LoginProps) => Promise<void>;
  logOut: () => void;
  user: User | null;
  isLoading: boolean;
  token: string | null
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
  token: null
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
        // Get both user and token from storage
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
      setToken(null); // Clear the token from state
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
        token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}