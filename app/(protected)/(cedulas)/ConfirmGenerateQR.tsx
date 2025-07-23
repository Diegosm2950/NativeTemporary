import React, { useContext } from "react";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Colors from '@/constants/Colors';
import useColorScheme from "@/hooks/useColorScheme";
import { sendNotification } from "@/api/notifications/notifications";
import { Player } from "@/types/user";
import { AuthContext } from "@/context/AuthContext";


type RootStackParamList = {
  QrResultScreen: { jugadoresSeleccionados: any };
};

const ConfirmGenerateQRScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "QrResultScreen">>();
  const route = useRoute();
  const colorScheme = useColorScheme();
  const { jugadoresSeleccionados } = route.params as { jugadoresSeleccionados: Player[] };
  const { token } = useContext(AuthContext);

  if (!token) return

  const handleGenerate = async () => {
    try {
      await sendNotification(token, jugadoresSeleccionados);
      
      navigation.navigate("QrResultScreen", {
        jugadoresSeleccionados: jugadoresSeleccionados,
      });
    } catch (error) {
      console.error("Error in handleGenerate:", error);
    }
  };  

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>

        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Generar QR de cédula</Text>
        <Text style={[styles.subtitle, { color: Colors[colorScheme].textSecondary }]}>
          ¿Confirmás la convocatoria y generación del QR?
        </Text>

        <Text style={[styles.section, { color: Colors[colorScheme].text }]}>
          Jugadores Seleccionados
        </Text>

        <View style={[styles.alertBox, { backgroundColor: Colors[colorScheme].cardBackground }]}>
          <Text style={[styles.alertText, { color: Colors[colorScheme].text }]}>
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
                <Text style={[styles.name, { color: Colors[colorScheme].text }]}>
                {jugador.name}
                </Text>
                <Text style={[styles.role, { color: Colors[colorScheme].textSecondary }]}>Convocado</Text>
            </View>
            ))}
        </View>
      </ScrollView>

      <View style={styles.buttons}>
        <TouchableOpacity 
          style={[styles.primaryBtn, { backgroundColor: Colors[colorScheme].buttonPrimary }]} 
          onPress={handleGenerate}
        >
          <Text style={[styles.primaryText, { color: Colors[colorScheme].buttonText }]}>Sí, generar QR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryBtn, { backgroundColor: Colors[colorScheme].cardBackground }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.secondaryText, { color: Colors[colorScheme].text }]}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConfirmGenerateQRScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 16 
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 60,
  },
  subtitle: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 16,
  },
  section: {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 8,
  },
  textGray: {
    color: "#A1A1AA",
  },
  alertBox: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  alertText: {
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
  },
  role: {
    fontSize: 12,
    textAlign: "center",
  },
  buttons: {
    marginBottom: 40,
    flexDirection: "column",
    gap: 16,
    paddingHorizontal: 16,
  },
  primaryBtn: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  primaryText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryBtn: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  secondaryText: {
    fontWeight: "600",
    fontSize: 16,
  },
});