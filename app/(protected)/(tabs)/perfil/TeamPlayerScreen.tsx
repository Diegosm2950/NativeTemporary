import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';

interface Player {
  id: string;
  nombre: string;
  apellido1: string;
  foto?: string;
  estatus?: string;
}

export default function TeamPlayersScreen() {
  const [players, setPlayers] = useState<Player[]>([]);
  const { user, token } = useContext(AuthContext);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/app-native-api/jugadores/equipo?id=${user?.clubId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const contentType = response.headers.get("content-type");

        if (!response.ok || !contentType?.includes("application/json")) {
          const text = await response.text();
          console.warn("Respuesta no válida:", text);
          return;
        }

        const data = await response.json();
        setPlayers(data.jugadores || []);
      } catch (error) {
        console.error("Error de red:", error);
      }
    };

    if (user?.clubId && token) fetchPlayers();
  }, [user?.clubId, token]);

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Jugadores de {user?.club}</Text>
      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, {backgroundColor: Colors[colorScheme].buttonSecondary}]}>
            <Image source={{ uri: item.foto }} style={styles.avatar} />
            <View>
              <Text style={[styles.name, { color: Colors[colorScheme].text }]}>
                {item.nombre} {item.apellido1}
              </Text>
              <Text style={[styles.status, { color: Colors[colorScheme].textSecondary }]}>
                {item.estatus || 'Sin estatus'}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  status: {
    fontSize: 13,
    marginTop: 4,
  },
});
