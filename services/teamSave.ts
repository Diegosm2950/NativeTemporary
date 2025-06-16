import { TournamentMatch } from '@/types/convocatiorias';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class matchService {
    MATCH = "match";

    async getMatch() {
        const match = await AsyncStorage.getItem(this.MATCH);
        if (!match) {
            return null;
        }
        return JSON.parse(match) as TournamentMatch;
    }

    async setMatch(match: TournamentMatch) {
        await AsyncStorage.setItem(this.MATCH, JSON.stringify(match));
    }

}