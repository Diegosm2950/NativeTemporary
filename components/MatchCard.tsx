import React from 'react';
import { StyleSheet, Text, View, Image, ImageBackground } from 'react-native';
import { Match } from '@/types/match';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';

const backgroundImage = require('@/assets/images/rugbyvg.png');

type MatchCardProps = {
  match: Match;
  variant?: 'large' | 'small';
};

export default function MatchCard({ match, variant = 'small' }: MatchCardProps) {
  const colorScheme = useColorScheme();
  const isLarge = variant === 'large';
  
  const ContainerComponent = isLarge ? ImageBackground : View;
  
  return (
    <ContainerComponent 
      source={isLarge ? backgroundImage : undefined}
      blurRadius={isLarge ? 50 : 0} 
      style={[
        styles.container,
        isLarge ? styles.largeContainer : styles.smallContainer,
      ]}
      imageStyle={isLarge ? styles.backgroundImageStyle : {}}
    >
    {isLarge && (
      <View style={styles.leagueContainer}>
        <View style={styles.badgeContainer}>
          <ImageBackground
            source={require('@/assets/images/rugbyvg.png')}
            blurRadius={50}
            style={styles.badge}
            imageStyle={styles.badgeImageStyle}
          >
            <Text style={styles.badgeText}>{match.league}</Text>
          </ImageBackground>
        </View>
        <View style={styles.badgeContainer}>
          <ImageBackground
            source={require('@/assets/images/rugbyvg.png')}
            blurRadius={50}
            style={styles.badge}
            imageStyle={styles.badgeImageStyle}
          >
            <Text style={styles.badgeText}>Próximo Partido</Text>
          </ImageBackground>
        </View>
      </View>
    )}
      
      <View style={styles.teamsContainer}>
        <View style={styles.teamContainer}>
          <Image
            source={{ uri: match.homeTeam.logo }}
            style={isLarge ? styles.largeTeamLogo : styles.smallTeamLogo}
          />
            <Text 
              style={[
                isLarge ? styles.largeTeamName : styles.smallTeamName,
                { color: Colors[colorScheme].text }
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {match.homeTeam.name}
            </Text>
        </View>
        
        <View style={styles.scoreContainer}>
          {match.status === 'live' ? (
            <View style={styles.liveScoreContainer}>
              <Text style={[styles.scoreText, { color: Colors[colorScheme].text }]}>
                {match.homeScore} : {match.awayScore}
              </Text>
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
            <Text 
              style={[
                isLarge ? styles.largeTeamName : styles.smallTeamName,
                { color: Colors[colorScheme].text }
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {match.awayTeam.name}
            </Text>
        </View>
      </View>
    </ContainerComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.l,
    marginBottom: Layout.spacing.m,
    overflow: 'hidden', 
  },
  largeContainer: {
    backgroundColor: "#FAFFFC01" 
  },
  smallContainer: {
    backgroundColor: "#257E4217",
  },
  backgroundImageStyle: {
    resizeMode: 'cover',
    opacity: 0.7, 
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
  badgeContainer: {
    borderRadius: 20,
    overflow: 'hidden', 
  },
  badge: {
    paddingHorizontal: Layout.spacing.s,
    paddingVertical: Layout.spacing.xs,
    borderRadius: 20, 
    backgroundColor: '#020D0626', 
  },
  badgeImageStyle: {
    borderRadius: 20,
    width: "100%",
    height: "100%"
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12, 
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
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