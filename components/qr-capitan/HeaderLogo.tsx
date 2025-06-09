import React from "react";
import { View, Text, Image, StyleSheet, useColorScheme } from "react-native";

const HeaderLogo = () => {
  const isDark = useColorScheme() === "dark";

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <Image
        source={require("@/assets/images/LogoSnake.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>
        Seleccionar Jugadores
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 16,
  },
  containerLight: {
    backgroundColor: "#FFFFFF",
  },
  containerDark: {
    backgroundColor: "#010D06",
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  titleLight: {
    color: "#1A2C23",
  },
  titleDark: {
    color: "#FFFFFF",
  },
});

export default HeaderLogo;
