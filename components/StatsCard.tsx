import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';

export type StatItem = {
  label: string;
  value: number | string;
};

type StatsCardProps = {
  title: string;
  stats: StatItem[];
};

export default function StatsCard({ title, stats }: StatsCardProps) {
  const colorScheme = useColorScheme();

  return (
    <View style={[
      styles.container,
      { backgroundColor: "#257E4217" }
    ]}>
      <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
        {title}
      </Text>
      
      {stats.map((stat, index) => (
        <View 
          key={stat.label} 
          style={[
            styles.statRow,
            { borderBottomColor: Colors[colorScheme].border }
          ]}
        >
          <Text style={[styles.label, { color: Colors[colorScheme].textSecondary }]}>
            {stat.label}
          </Text>
          <Text style={[styles.value, { color: Colors[colorScheme].text }]}>
            {stat.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.l,
    marginBottom: Layout.spacing.l,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Layout.spacing.m,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.s,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  value: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});