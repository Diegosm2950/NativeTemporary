import React from 'react';
import { Image, StyleSheet } from 'react-native';

export const Logo = () => {
  
  return (
    <Image
      source={require('@/assets/images/FMRUU.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
logo: {
    width: 80,
    height: 40,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 50
    },
});