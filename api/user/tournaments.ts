import { CedulaResponse } from "@/types/cedulas";
import { ConvocatoriaResponse, PartidosTorneoResponse, ResponseTorneoInfo } from "@/types/convocatiorias";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

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

export const fetchTournamentReport = async (torneoId: string): Promise<CedulaResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/app-native-api/cedulas/por-torneo/${torneoId}`);
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

export const fetchMatchReports = async (matchId: string): Promise<CedulaResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/app-native-api/cedulas/por-partido/${matchId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching match reports:', error);
    throw error;
  }
};

export async function fetchPartidosTorneo(id: string, token: string): Promise<PartidosTorneoResponse> {
  try {

    if (!id || !token) {
      throw new Error('ID and token are required');
    }

    const response = await fetch(`${API_BASE_URL}/api/app-native-api/partidos/listar-partidos-torneo/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch partido');
    }

    return data;
  } catch (error) {
    console.error('Error fetching partido:', error);
    throw error;
  }
}

export async function fetchTorneosByEquipo(
  idEquipo: string,
  token: string
): Promise<ResponseTorneoInfo> {
  try {
    const url = new URL(`${API_BASE_URL}/api/app-native-api/torneos/consultar-torneo`);
    url.searchParams.append('idTorneo', idEquipo.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch tournaments');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching partido:', error);
    throw error;
  }
}