import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import MatchTabs from '@/components/MatchTabs';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useConvocatorias } from '@/hooks/useFetchMatches';
import Layout from '@/constants/Layout';


export default function MatchesScreen() {
  const { user } = useContext(AuthContext);

  const { data } = useConvocatorias(user?.clubId ?? undefined);

  const colorScheme = useColorScheme();
  const pastMatches = data.torneos.filter(match => match.estatus == "finalizado");
  const nextMatches = data.torneos.filter(match => match.estatus == "programado");

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <ScrollView 
        style={styles.scrollView}
        >        
        <MatchTabs 
          upcomingMatches={nextMatches}
          pastMatches={pastMatches}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    marginTop: Layout.spacing.xxl
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
});