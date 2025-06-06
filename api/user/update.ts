import { User } from "@/types/user";

const API_BASE_URL = "https://fmru-next-js.vercel.app"

export const updateUserProfile = async (userData: Partial<User>, token: string, refreshUser: () => Promise<void>) => {
  try {
      const updateData = {
          nombre: userData.nombre,
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
      };

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
          throw new Error(data.error || 'Error al actualizar el perfil');
      }

      await refreshUser();

      return data;
  } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
  }
};