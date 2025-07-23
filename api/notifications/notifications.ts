import { Player } from "@/types/user";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

export async function sendNotification(token: string, jugadoresSeleccionados: Player[]) {
  try {

    const notificationData = {
      title: "Convocatoria de Partido",
      message: "Haz sido convocado a un partido",
      jugadores: jugadoresSeleccionados.map(player => ({ id: player.id }))
    };

    const response = await fetch(`${API_BASE_URL}/api/app-native-api/notificaciones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`HTTP error! status: ${response.status}`, {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorBody,
      });
      throw new Error(`HTTP ${response.status}: ${response.statusText}\n${errorBody}`);
    }

    const result = await response.json();
    console.log("Notification sent successfully:", result);
    return result;

  } catch (error) {
    console.error('Failed to send notification:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}