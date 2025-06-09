import React from "react";
import { View, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const BackButton = () => {
  const isDark = useColorScheme() === "dark";
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[styles.button, isDark && styles.buttonDark]}
      >
        <ChevronLeft size={24} color={isDark ? "#B8E0C51F" : "#B8E0C51F"} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 40,
    left: 16,
    zIndex: 10,
  },
  button: {
    backgroundColor: "#F0F0F0",
    padding: 8,
    borderRadius: 100,
  },
  buttonDark: {
    backgroundColor: "#1A2C23",
  },
});

export default BackButton;
