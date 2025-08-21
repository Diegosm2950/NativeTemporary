import { User } from "@/types/user";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

export const updateUserProfile = async (userData: Partial<User>, token: string, refreshUser: () => Promise<void>) => {
    try {
        // Clean undefined values
        const updateData = Object.fromEntries(
            Object.entries({
                nombre: userData.nombre,
                apellido1: userData.apellido1,
                email: userData.email,
                estadoMx: userData.estadoMx,
                delegacionMunicipio: userData.delegacionMunicipio,
                ciudad: userData.ciudad,
                colonia: userData.colonia,
                cel: userData.cel,
                cp: userData.cp,
                ceNombre: userData.ceNombre,
                ceCel: userData.ceCel,
                ceTel: userData.ceTel,
                ceParentesco: userData.ceParentesco,
            }).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );
  
        if (Object.keys(updateData).length === 0) {
            throw new Error('No valid data to update');
        }
  
        const response = await fetch(`${API_BASE_URL}/api/user/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        });
  
        const data = await response.json();
  
        if (!response.ok) {
            // More detailed error message
            throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
        }
  
        await refreshUser();
        return data;
        
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
  };