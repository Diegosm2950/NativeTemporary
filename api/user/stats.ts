const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

export async function fetchTeamSummary(id?: number) {
    try {
    if (!id) {
        throw new Error('ID is required');
        }
      const response = await fetch(`${API_BASE_URL}/api/historicos/equipos/${id}/resumen`);
      
      if (!response.ok) {
        throw new Error(`Error fetching team summary: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch team summary:', error);
      throw error;
    }
  }
  
  export async function fetchPlayerSummary(id?: number) {
    try {
        
    if (!id) {
        throw new Error('ID is required');
        }
      const response = await fetch(`${API_BASE_URL}/api/historicos/jugadores/${id}/resumen`);
      
      if (!response.ok) {
        throw new Error(`Error fetching player summary: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch player summary:', error);
      throw error;
    }
  }