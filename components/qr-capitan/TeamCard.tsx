import React from "react";
import { View, Text, StyleSheet, useColorScheme, Image } from "react-native";
import { BadgeCheck } from "lucide-react-native";

const TeamCard: React.FC = () => {
  const isDark = useColorScheme() === "dark";

  return (
    <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
      {/* Etiquetas superiores */}
      <View style={styles.tagsContainer}>
        <View style={[styles.tag, isDark ? styles.tagDark : styles.tagLight]}>
          <Text style={[styles.tagText, isDark && styles.tagTextDark]}>
            Torneo Nacional
          </Text>
        </View>
        <View style={[styles.tag, isDark ? styles.tagDark : styles.tagLight]}>
          <BadgeCheck size={14} color="#53F29D" />
          <Text
            style={[
              styles.tagText,
              { marginLeft: 4 },
              isDark && styles.tagTextDark,
            ]}
          >
            Local vs Visitante
          </Text>
        </View>
      </View>

      {/* Equipos */}
      <View style={styles.teamsContainer}>
        <View style={styles.team}>
          <Image
            source={require("@/assets/images/LogoSnake.png")}
            style={styles.logo}
          />
          <Text style={[styles.teamLabel, isDark && styles.teamLabelDark]}>
            Equipo Local
          </Text>
        </View>

        <View style={styles.team}>
          <Image
            source={require("@/assets/images/LogoSnake.png")}
            style={styles.logo}
          />
          <Text style={[styles.teamLabel, isDark && styles.teamLabelDark]}>
            Equipo Visitante
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    marginVertical: 16,
    marginHorizontal: 12,
  },
  cardLight: {
    backgroundColor: "#F3F4F6",
  },
  cardDark: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  tagsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagLight: {
    backgroundColor: "#E5E7EB",
  },
  tagDark: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1A2C23",
  },
  tagTextDark: {
    color: "#FFFFFF",
  },
  teamsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  team: {
    alignItems: "center",
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  teamLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A2C23",
  },
  teamLabelDark: {
    color: "#FFFFFF",
  },
});

export default TeamCard;
