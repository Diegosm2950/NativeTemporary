import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Player } from "@/types/user";

interface PlayerListProps {
  filter: string;
  page: number;
  selected: Player[];
  onUpdateSelection: (player: Player) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({ filter, page, selected, onUpdateSelection }) => {
  const isDark = useColorScheme() === "dark";
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const clubId = await AsyncStorage.getItem("clubId");
        const token = await AsyncStorage.getItem("token");

        if (!clubId || !token) {
          console.warn("❌ Falta clubId o token");
          Alert.alert("Sesión expirada", "Vuelve a iniciar sesión.");
          return;
        }

        const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
        if (!API_BASE_URL) {
          console.error("❌ EXPO_PUBLIC_API_BASE_URL no definido");
          Alert.alert("Error de configuración", "No se ha definido la URL base.");
          return;
        }

        const url = `${API_BASE_URL}/api/app-native-api/jugadores/equipo?id=${clubId}&nombre=${filter}&page=${page}`;
        console.log("🔗 Solicitando jugadores desde:", url);

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.jugadores)) {
          console.warn("⚠️ Estructura inesperada:", data);
          Alert.alert("Atención", "No se pudieron obtener los jugadores.");
          return;
        }

        const jugadoresFormateados = data.jugadores.map((jugador: any) => ({
          id: jugador.id.toString(),
          name:
            jugador.name ||
            `${jugador.nombre || ""} ${jugador.apellido1 || ""} ${jugador.apellido2 || ""}`.trim(),
          clubId: jugador.clubId?.toString() || "",
          club: jugador.club || "Sin club",
          foto: jugador.foto || "",
        }));

        setPlayers(jugadoresFormateados);
      } catch (err: any) {
        console.error("Error cargando jugadores:", err.message);
        Alert.alert("Error", "No se pudieron cargar los jugadores.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [filter, page]);

  const togglePlayer = (player: Player) => {
    onUpdateSelection(player);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#53F29D" />;
  }

  if (players.length === 0) {
    return (
      <View style={[styles.container, { alignItems: "center", paddingVertical: 32 }]}>
        <Text style={{ color: isDark ? "#fff" : "#000" }}>No se encontraron jugadores.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>Lista de Jugadores del Club</Text>
      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => {
          const isSelected = selected.some((p) => p.id === item.id);
          return (
            <TouchableOpacity style={[styles.row, isDark && styles.rowDark]} onPress={() => togglePlayer(item)}>
              <Image
                source={item.foto ? { uri: item.foto } : require("@/assets/images/LogoSnake.png")}
                style={styles.avatar}
              />
              <Text style={[styles.name, isDark && styles.nameDark]}>{item.name}</Text>
              <View
                style={[
                  styles.radio,
                  isDark && styles.radioDark,
                  isSelected && { backgroundColor: "#53F29D", borderColor: "#53F29D" },
                ]}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  containerLight: { backgroundColor: "#FFFFFF" },
  containerDark: { backgroundColor: "#0B1612" },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 12, color: "#1A2C23" },
  titleDark: { color: "#FFFFFF" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#F3F4F6",
    padding: 10,
    borderRadius: 12,
  },
  rowDark: { backgroundColor: "#1A2C23" },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  name: { flex: 1, fontSize: 14, color: "#1A2C23" },
  nameDark: { color: "#FFFFFF" },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: "#999" },
  radioDark: { borderColor: "#53F29D" },
});

export default PlayerList;
