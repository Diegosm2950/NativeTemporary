import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";

const GenerateQRButton = ({ onPress }: { onPress: () => void }) => {
  const isDark = useColorScheme() === "dark";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isDark && styles.buttonDark]}
        onPress={onPress}
      >
        <Text style={[styles.text, isDark && styles.textDark]}>
          Generar QR de Cédula
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  button: {
    backgroundColor: "#8DDCA4",
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDark: {
    backgroundColor: "#010D06",
    borderWidth: 1.5,
    borderColor: "#53F29D",
  },
  text: {
    fontWeight: "600",
    color: "#1A2C23",
    fontSize: 16,
  },
  textDark: {
    color: "#53F29D",
  },
});

export default GenerateQRButton;
