import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';
import MatchCard from '@/components/MatchCard';
import { AuthContext } from '@/context/AuthContext';
import MatchTabs from '@/components/MatchTabs';
import { useConvocatorias } from '@/hooks/useFetchMatches';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { user } = useContext(AuthContext);

  const { data } = useConvocatorias(user?.clubId ?? undefined);
  console.log(user?.tipoRegistro_1, user?.rol)
  const nextMatch = data.nextMatch;
  const pastMatches = data.torneos.filter(match => match.estatus == "finalizado");
  const nextMatches = data.torneos.filter(match => match.estatus == "programado");


  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}
      edges={['top', 'right', 'left']}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: user?.foto || "" }}
              style={styles.profileImage}
            />
          </View>
        </View>
       
        <Text style={[styles.greeting, { color: Colors[colorScheme].text }]}>
          ¡Hola, {user?.nombre}!
        </Text>
        <Text style={[styles.subtitle, { color: Colors[colorScheme].textSecondary }]}>
          Listo para tu próximo partido?
        </Text>
        
        {nextMatch && (
          <View style={styles.nextMatchContainer}>
            <MatchCard match={nextMatch} variant="large" />
          </View>
        )}
        
        <MatchTabs 
          upcomingMatches={nextMatches}
          pastMatches={pastMatches}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.l,
    paddingVertical: Layout.spacing.m,
  },
  logo: {
    width: 36,
    height: 36,
  },
  profileContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    paddingHorizontal: Layout.spacing.l,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    paddingHorizontal: Layout.spacing.l,
    marginBottom: Layout.spacing.l,
    textAlign: "center"
  },
  nextMatchContainer: {
    paddingHorizontal: Layout.spacing.l,
    marginBottom: Layout.spacing.l,
  }
});