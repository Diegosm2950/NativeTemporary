import { HistoricoTorneoResponse } from "@/types/convocatiorias";

const API_BASE_URL = "https://fmru-next-js.vercel.app"

interface ConvocatoriaResponse {
  convocado: boolean;
  torneos: any[];
  amistosos: any[];
  error?: string;
}

export const fetchConvocatorias = async (id: number, token: string): Promise<ConvocatoriaResponse> => {
  try {

    if (!id || !token) {
      throw new Error('ID and token are required');
    }
    
    const response = await fetch(`${API_BASE_URL}/api/app-native-api/convocatorias/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error fetching convocatorias');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fetchConvocatorias:', error);
    throw error;
  }
};

export const fetchTournamentReport = async (torneoId: string): Promise<HistoricoTorneoResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/app-native-api/historicos/torneos/${torneoId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tournament report:', error);
    throw error;
  }
};