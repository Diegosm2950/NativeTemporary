import React from "react";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, useColorScheme } from "react-native";

type Player = {
  id: string;
  name: string;
  foto?: string;
};
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  QrResultScreen: { jugadoresSeleccionados: any };
};

const ConfirmGenerateQRScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "QrResultScreen">>();
  const route = useRoute();
  const isDark = useColorScheme() === "dark";

  const { jugadoresSeleccionados } = route.params as { jugadoresSeleccionados: Player[] };

  const handleGenerate = () => {
    navigation.navigate("QrResultScreen", {
      jugadoresSeleccionados: jugadoresSeleccionados,
    });
  };  

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>

        <Text style={[styles.title, isDark && styles.textDark]}>Generar QR de cédula</Text>
        <Text style={[styles.subtitle, isDark && styles.textGray]}>
          ¿Confirmás la convocatoria y generación del QR?
        </Text>

        <Text style={[styles.section, isDark && styles.textDark]}>
          Jugadores Seleccionados
        </Text>

        <View style={styles.alertBox}>
          <Text style={[styles.alertText, isDark && styles.textDark]}>
            ⚠️ Una vez generado el código QR, no podrás modificar la lista de
            jugadores convocados.
          </Text>
        </View>

        <View style={styles.grid}>
        {jugadoresSeleccionados.map((jugador: Player) => (
            <View key={jugador.id} style={styles.playerCard}>
                <Image
                source={jugador.foto ? { uri: jugador.foto } : require("../../../assets/images/LogoSnake.png")}
                style={styles.avatar}
                />
                <Text style={[styles.name, isDark && styles.textDark]}>
                {jugador.name}
                </Text>
                <Text style={styles.role}>Convocado</Text>
            </View>
            ))}
        </View>
      </ScrollView>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleGenerate}>
          <Text style={styles.primaryText}>Sí, generar QR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConfirmGenerateQRScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  containerDark: { backgroundColor: "#010D06" },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 12,
    color: "#1A2C23",
  },
  subtitle: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 16,
    color: "#4B5563",
  },
  section: {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 8,
    color: "#1A2C23",
  },
  textDark: {
    color: "#FFFFFF",
  },
  textGray: {
    color: "#A1A1AA",
  },
  alertBox: {
    backgroundColor: "#E5F4F0",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  alertText: {
    color: "#1A2C23",
    fontSize: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
  },
  playerCard: {
    alignItems: "center",
    width: 100,
    marginBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 6,
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    color: "#1A2C23",
  },
  role: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  buttons: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  secondaryText: {
    color: "#111827",
    fontWeight: "600",
    fontSize: 16,
  },
});
