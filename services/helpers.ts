import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAdminToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('admin-token');
  } catch (error) {
    console.error('Error getting admin token:', error);
    return null;
  }
};