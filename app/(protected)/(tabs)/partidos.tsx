import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import MatchTabs from '@/components/MatchTabs';
import { useCallback, useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useConvocatorias } from '@/hooks/useFetchMatches';
import Layout from '@/constants/Layout';


export default function MatchesScreen() {
  const { user } = useContext(AuthContext);

  const { data, refetch, pastMatches } = useConvocatorias(user?.clubId ?? undefined);
  const [refreshing, setRefreshing] = useState(false);

  const colorScheme = useColorScheme();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors[colorScheme].tint]}
            tintColor={Colors[colorScheme].tint} 
            progressBackgroundColor={Colors[colorScheme].background}
          />
        }
        >        
        <MatchTabs 
          upcomingMatches={data.torneos}
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