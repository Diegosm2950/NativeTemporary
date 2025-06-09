import React from "react";
import { View, TextInput, StyleSheet, useColorScheme } from "react-native";
import { Search } from "lucide-react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Buscar jugador...",
}) => {
  const isDark = useColorScheme() === "dark";

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Search size={20} color={isDark ? "#53F29D" : "#6B7280"} />
      <TextInput
        style={[styles.input, isDark && styles.inputDark]}
        placeholder={placeholder}
        placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  containerDark: {
    backgroundColor: "#1A2C23",
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#1A2C23",
  },
  inputDark: {
    color: "#FFFFFF",
  },
});

export default SearchBar;
