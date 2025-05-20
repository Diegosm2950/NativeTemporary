// services/auth.ts
import { fetchUserData, login } from '@/api/auth/login';
import { User } from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthService {
    AUTH = "auth"

    async handleLogin(username: string, password: string) {
        const response = await login(username, password);

        if (response.id !== undefined) {
            const user = await fetchUserData(response.id);
            this.setUser(user.user)
            console.log(JSON.stringify(user))
        }
        
        await AsyncStorage.setItem("admin-token", response.token);
        if (response.id) {
          await AsyncStorage.setItem("admin-id", String(response.id));
        }
        
        return response;
    };

    async getUser() {
        const user = await AsyncStorage.getItem(this.AUTH)
        if (user == undefined) {
            return null
        }
        return JSON.parse(user) as User
    }

    async logOut() {
        await AsyncStorage.clear();
    }

    async setUser(user: User) {
        await AsyncStorage.setItem(this.AUTH, JSON.stringify(user))
    }
}