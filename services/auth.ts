// services/auth.ts
import { fetchUserData, login } from '@/api/auth/login';
import { User } from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthService {
    AUTH = "auth";
    TOKEN = "admin-token";
    ADMIN_ID = "admin-id";

    async handleLogin(username: string, password: string, expoPushToken?: string | undefined) {
        const response = await login(username, password, expoPushToken);

        if (response.id !== undefined) {
            const user = await fetchUserData(String(response.id));
            await this.setUser(user.user);
            console.log(JSON.stringify(user));
        }
        
        if (response.token) {
            await this.setToken(response.token);
        }
        
        if (response.id) {
            await AsyncStorage.setItem(this.ADMIN_ID, String(response.id));
        }
        
        return response;
    };

    async getUser() {
        const user = await AsyncStorage.getItem(this.AUTH);
        if (!user) {
            return null;
        }
        return JSON.parse(user) as User;
    }

    async getToken() {
        return await AsyncStorage.getItem(this.TOKEN);
    }

    async setToken(token: string) {
        await AsyncStorage.setItem(this.TOKEN, token);
    }

    async logOut() {
        await AsyncStorage.multiRemove([this.AUTH, this.TOKEN, this.ADMIN_ID]);
    }

    async setUser(user: User) {
        await AsyncStorage.setItem(this.AUTH, JSON.stringify(user));
    }
    
    async refreshUser() {
        const userId = await AsyncStorage.getItem(this.ADMIN_ID);
        if (!userId) return null;
        
        const user = await fetchUserData(userId);
        await this.setUser(user.user);
        return user.user;
    }
}