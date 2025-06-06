import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import { Team } from '@/types/convocatiorias';

const defaultTeamLogo = require('@/assets/images/default-team-logo.png');

type WinnerTeamCardProps = {
  team?: Team | null;
  name: string
};

export default function WinnerTeamCard({ team, name }: WinnerTeamCardProps) {
  const colorScheme = useColorScheme();
  
  return (
    <View style={styles.container}>
      <View style={styles.teamContainer}>
        <Text style={[styles.torneoName, { color: Colors[colorScheme].text }]}>
          {name}
        </Text>
        
        {team ? (
          <>
            <View style={styles.winnerBadge}>
              <MaterialIcons name="emoji-events" size={40} color="#FFD700" />
            </View>
            <Image
              source={team.logo ? { uri: team.logo } : defaultTeamLogo}
              style={styles.teamLogo}
              defaultSource={defaultTeamLogo}
            />
            <Text 
              style={[styles.teamName, { color: Colors[colorScheme].text }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {team.nombre}
            </Text>
          </>
        ) : (
          <Text style={[styles.teamName, { color: Colors[colorScheme].text }]}>
            No champion team yet
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#257E4217",
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.l,
    marginBottom: Layout.spacing.m,
    overflow: 'hidden', 
  },
  teamContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  torneoName: {
    marginBottom: Layout.spacing.s,
    fontSize: 16,
    textAlign: "left"
  },
  winnerBadge: {
    marginBottom: Layout.spacing.s,
  },
  teamLogo: {
    width: 40,
    height: 40,
    marginBottom: Layout.spacing.xs,
  },
  teamName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    maxWidth: '100%',
  },
});