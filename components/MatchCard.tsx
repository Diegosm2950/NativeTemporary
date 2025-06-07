import React, { useContext } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { MatchResults } from '@/types/convocatiorias';

const backgroundImage = require('@/assets/images/rugbyvg.png');
const defaultTeamLogo = require('@/assets/images/default-team-logo.png');

type MatchCardProps = {
  match: MatchResults;
  variant?: 'large' | 'small';
};

export default function MatchCard({ match, variant = 'small' }: MatchCardProps) {

  const colorScheme = useColorScheme();
  const isLarge = variant === 'large';
  const { user } = useContext(AuthContext);
  const router = useRouter();
  
  const ContainerComponent = isLarge ? ImageBackground : View;
  
  const handleCapitanPress = () => {
    console.log('Escoger jugadores pressed');
  };
  
  const handleArbitroPress = () => {
    router.push(`/(protected)/(cedulas)`);
  };

  const isFinished = match.estatus === 'finalizado';
  
  const getScores = () => {
    if (!match.resultadoResumen) return { localScore: '0', awayScore: '0' };
    
    const matchResult = match.resultadoResumen.match(/(\d+).*vs.*(\d+)/);
    if (matchResult && matchResult.length >= 3) {
      return { localScore: matchResult[1], awayScore: matchResult[2] };
    }
    return { localScore: '0', awayScore: '0' };
  };
  
  const { localScore, awayScore } = getScores();
  
  const isLocalWinner = match.equipoGanador === match.equipoLocal.nombre;
  const isAwayWinner = match.equipoGanador === match.equipoVisitante.nombre;
  
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
              <Text style={styles.badgeText}>{match.torneo}</Text>
            </ImageBackground>
          </View>
          <View style={styles.badgeContainer}>
            <ImageBackground
              source={require('@/assets/images/rugbyvg.png')}
              blurRadius={50}
              style={styles.badge}
              imageStyle={styles.badgeImageStyle}
            >
              <Text style={styles.badgeText}>
                {isFinished ? 'Partido Finalizado' : 'Próximo Partido'}
              </Text>
            </ImageBackground>
          </View>
        </View>
      )}
      
      <View style={styles.teamsContainer}>
        <View style={styles.teamContainer}>
          <Image
            source={match.equipoLocal.logo ? { uri: match.equipoLocal.logo } : defaultTeamLogo}
            style={[
              isLarge ? styles.largeTeamLogo : styles.smallTeamLogo,
              isFinished && isLocalWinner && styles.winningTeamLogo
            ]}
            defaultSource={defaultTeamLogo}
          />
          <Text 
            style={[
              isLarge ? styles.largeTeamName : styles.smallTeamName,
              { color: Colors[colorScheme].text },
              isFinished && isLocalWinner && styles.winningTeamName
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {match.equipoLocal.nombre}
          </Text>
        </View>
        
        <View style={styles.scoreContainer}>
          {match.estatus === 'live' ? (
            <View style={styles.liveScoreContainer}>
              <Text style={[styles.scoreText, { color: Colors[colorScheme].text }]}>
                {match.id} : {match.id}
              </Text>
            </View>
          ) : (
            <View style={styles.scoreWrapper}>
              <Text style={[
                styles.scoreText, 
                { color: Colors[colorScheme].text },
                isFinished && isLocalWinner && styles.winningScore
              ]}>
                {isFinished ? localScore : (isLarge ? "0" : "-")}
              </Text>
              <Text style={[styles.scoreSeparator, { color: Colors[colorScheme].text }]}>:</Text>
              <Text style={[
                styles.scoreText, 
                { color: Colors[colorScheme].text },
                isFinished && isAwayWinner && styles.winningScore
              ]}>
                {isFinished ? awayScore : (isLarge ? "0" : "-")}
              </Text>
            </View>
          )}
        </View>
        
        <View style={[styles.teamContainer, styles.awayTeam]}>
          <Image
            source={match.equipoVisitante.logo ? { uri: match.equipoVisitante.logo } : defaultTeamLogo}
            style={[
              isLarge ? styles.largeTeamLogo : styles.smallTeamLogo,
              isFinished && isAwayWinner && styles.winningTeamLogo
            ]}
            defaultSource={defaultTeamLogo}
          />
          <Text 
            style={[
              isLarge ? styles.largeTeamName : styles.smallTeamName,
              { color: Colors[colorScheme].text },
              isFinished && isAwayWinner && styles.winningTeamName
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {match.equipoVisitante.nombre}
          </Text>
        </View>
      </View>

      {isLarge && isFinished && (
        <View style={styles.resultSummaryContainer}>
          <Text style={[styles.resultSummaryText, { color: Colors[colorScheme].text }]}>
            {match.resultadoResumen}
          </Text>
        </View>
      )}

      {isLarge && !isFinished && (
        <>
          {user?.tipoRegistro_2 === 1 && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: "#000000" }]}
              onPress={handleCapitanPress}
            >
              <Text style={styles.actionButtonText}>Escoger jugadores</Text>
            </TouchableOpacity>
          )}
          
          {user?.tipoRegistro_3 === 1 && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: "#000000" }]}
              onPress={handleArbitroPress}
            >
              <Text style={styles.actionButtonText}>Iniciar partido</Text>
            </TouchableOpacity>
          )}
        </>
      )}
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
    scoreWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreSeparator: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginHorizontal: Layout.spacing.xs,
  },
  winningTeamLogo: {
    borderWidth: 2,
    borderColor: '#FFD700', 
    borderRadius: 30,
  },
  winningTeamName: {
    fontWeight: 'bold',
  },
  winningScore: {
    fontWeight: 'bold',
  },
  resultSummaryContainer: {
    marginTop: Layout.spacing.m,
    padding: Layout.spacing.s,
    backgroundColor: '#020D0626',
    borderRadius: Layout.borderRadius.small,
  },
  resultSummaryText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
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
  actionButton: {
    marginTop: Layout.spacing.m,
    padding: Layout.spacing.m,
    borderRadius: Layout.borderRadius.large,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});