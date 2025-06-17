import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";

const filters = ["Todos", "Disponibles", "Lesionados", "Suspendidos"];

const FilterBar = ({
  active,
  onChange,
}: {
  active: string;
  onChange: (f: string) => void;
}) => {
  const theme = useColorScheme();
  const isDark = theme === "dark";

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {filters.map((f) => (
        <TouchableOpacity key={f} onPress={() => onChange(f)} style={styles.item}>
          <Text
            style={[
              styles.text,
              isDark && styles.textDark,
              active === f && styles.active,
            ]}
          >
            {f}
          </Text>
          {active === f && <View style={styles.underline} />}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    flexDirection: "row",
    maxHeight: 40
  },
  item: {
    marginRight: 24,
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: "#6B7280",
  },
  textDark: {
    color: "#D1D5DB",
  },
  active: {
    color: "#53F29D",
    fontWeight: "bold",
  },
  underline: {
    height: 2,
    backgroundColor: "#53F29D",
    marginTop: 4,
    width: 24,
    borderRadius: 999,
  },
});

export default FilterBar;
