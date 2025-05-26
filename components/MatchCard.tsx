import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Match } from '@/types/match';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';


type MatchCardProps = {
  match: Match;
  variant?: 'large' | 'small';
};

export default function MatchCard({ match, variant = 'small' }: MatchCardProps) {
  const colorScheme = useColorScheme();
  const isLarge = variant === 'large';
  const router = useRouter();
  
  return (
    <View style={[
      styles.container,
      isLarge ? styles.largeShadow : styles.smallShadow,
      { backgroundColor: Colors[colorScheme].cardBackground }
    ]}>
      {isLarge && (
        <View style={styles.leagueContainer}>
          <Text style={[styles.leagueText, { color: Colors[colorScheme].text }]}>
            {match.league}
          </Text>
          <View style={[styles.badge, { backgroundColor: Colors[colorScheme].tint }]}>
            <Text style={styles.badgeText}>Próximo Partido</Text>
          </View>
        </View>
      )}
      
      <View style={styles.teamsContainer}>
        <View style={styles.teamContainer}>
          <Image
            source={{ uri: match.homeTeam.logo }}
            style={isLarge ? styles.largeTeamLogo : styles.smallTeamLogo}
          />
          <Text style={[
            isLarge ? styles.largeTeamName : styles.smallTeamName,
            { color: Colors[colorScheme].text }
          ]}>
            {match.homeTeam.name}
          </Text>
        </View>
        
        <View style={styles.scoreContainer}>
          {match.status === 'live' ? (
            <View style={styles.liveScoreContainer}>
              <Text style={[styles.scoreText, { color: Colors[colorScheme].text }]}>
                {match.homeScore} : {match.awayScore}
              </Text>
              <View style={[styles.liveBadge, { backgroundColor: Colors[colorScheme].error }]}>
                <Text style={styles.liveBadgeText}>LIVE</Text>
              </View>
            </View>
          ) : (
            <Text style={[styles.dateText, { color: Colors[colorScheme].textSecondary }]}>
              {isLarge ? 'Fecha ' + match.matchDay : ' - : - '}
            </Text>
          )}
        </View>
        
        <View style={[styles.teamContainer, styles.awayTeam]}>
          <Image
            source={{ uri: match.awayTeam.logo }}
            style={isLarge ? styles.largeTeamLogo : styles.smallTeamLogo}
          />
          <Text style={[
            isLarge ? styles.largeTeamName : styles.smallTeamName,
            { color: Colors[colorScheme].text }
          ]}>
            {match.awayTeam.name}
          </Text>
        </View>
      </View>
      {isLarge && (
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: '/cedulas/qr-scanner',
            params: { matchId: String(match.id) },
          })
        }
        style={{
          marginTop: Layout.spacing.m,
          backgroundColor: Colors[colorScheme].tint,
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Comenzar</Text>
      </TouchableOpacity>
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.l,
    marginBottom: Layout.spacing.m,
  },
  largeShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  smallShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  leagueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.m,
  },
  leagueText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  badge: {
    paddingHorizontal: Layout.spacing.s,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.small,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  awayTeam: {
    alignItems: 'center',
  },
  largeTeamLogo: {
    width: 60,
    height: 60,
    marginBottom: Layout.spacing.s,
  },
  smallTeamLogo: {
    width: 40,
    height: 40,
    marginBottom: Layout.spacing.xs,
  },
  largeTeamName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  smallTeamName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.m,
  },
  liveScoreContainer: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: Layout.spacing.xs,
  },
  liveBadge: {
    paddingHorizontal: Layout.spacing.s,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.small,
  },
  liveBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});