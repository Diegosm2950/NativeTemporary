import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";

interface PlayerCounterProps {
  selected: number;
  total: number;
}

const PlayerCounter: React.FC<PlayerCounterProps> = ({ selected, total }) => {
  const isDark = useColorScheme() === "dark";

  return (
    <View style={styles.wrapper}>
      <View style={[styles.badge, isDark && styles.badgeDark]}>
        <Text style={[styles.text, isDark && styles.textDark]}>
          {selected} / {total} convocados
        </Text>
      </View>

      <View style={[styles.badge, isDark && styles.badgeDark]}>
        <Text style={[styles.text, isDark && styles.textDark]}>Posición</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  badge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  badgeDark: {
    backgroundColor: "#1A2C23",
  },
  text: {
    color: "#1A2C23",
    fontSize: 14,
    fontWeight: "600",
  },
  textDark: {
    color: "#FFFFFF",
  },
});

export default PlayerCounter;
