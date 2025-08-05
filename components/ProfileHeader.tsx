import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';

type ProfileHeaderProps = {
  name: string;
  email: string;
  imageUrl: string;
  showCheckmark?: boolean;
};

export default function ProfileHeader({ name, email, imageUrl, showCheckmark = false }: ProfileHeaderProps) {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={[styles.headerText, { color: Colors[colorScheme].text }]}>
          Perfil
        </Text>
      </View>
      
      <View 
        style={styles.profileImageContainer}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.profileImage}
        />
      </View>
      
      <Text style={[styles.name, { color: Colors[colorScheme].text }]}>
        {name}
      </Text>
      <Text style={[styles.email, { color: Colors[colorScheme].textSecondary }]}>
        {email}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: Layout.spacing.l,
    paddingBottom: Layout.spacing.m,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.l,
  },
  logo: {
    width: 36,
    height: 36,
  },
  headerText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: Layout.spacing.xs,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: Layout.spacing.m,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  checkmarkContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#24693D',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  checkmark: {
    width: 14,
    height: 14,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Layout.spacing.xs,
  },
  email: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});