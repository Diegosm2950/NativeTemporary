import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import MatchCard from '@/components/MatchCard';
import useColorScheme from '@/hooks/useColorScheme';
import { TournamentMatch } from '@/types/convocatiorias';

type TabType = 'upcoming' | 'past';

interface MatchTabsProps {
  upcomingMatches: TournamentMatch[];
  pastMatches: TournamentMatch[];
  initialTab?: TabType;
}

export default function MatchTabs({ upcomingMatches, pastMatches, initialTab = 'upcoming' }: MatchTabsProps) {
  const colorScheme = useColorScheme();
  const [activeTab, setActiveTab] = React.useState<TabType>(initialTab);
  
  const renderNoMatchesMessage = () => (
    <View style={styles.noMatchesContainer}>
      <Text style={[styles.noMatchesText, { color: Colors[colorScheme].textSecondary }]}>
        {activeTab === 'upcoming' ? 'No hay próximos partidos' : 'No hay partidos pasados'}
      </Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'upcoming' && [
              styles.activeTab, 
              { borderBottomColor: Colors[colorScheme].tint }
            ]
          ]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'upcoming' && { color: Colors[colorScheme].tint }
          ]}>
            Próximos Partidos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'past' && [
              styles.activeTab, 
              { borderBottomColor: Colors[colorScheme].tint }
            ]
          ]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'past' && { color: Colors[colorScheme].tint }
          ]}>
            Partidos Pasados
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.matchesContainer}>
        {activeTab === 'upcoming' ? (
          upcomingMatches.length > 0 ? (
            upcomingMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))
          ) : (
            renderNoMatchesMessage()
          )
        ) : (
          pastMatches.length > 0 ? (
            pastMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))
          ) : (
            renderNoMatchesMessage()
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.l,
    marginBottom: Layout.spacing.l,
  },
  tab: {
    flex: 1,
    paddingVertical: Layout.spacing.m,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    color: Colors.light.textSecondary,
  },
  matchesContainer: {
    paddingHorizontal: Layout.spacing.l,
    paddingBottom: Layout.spacing.xxl,
    flex: 1,
  },
  noMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Layout.spacing.xxl,
  },
  noMatchesText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});