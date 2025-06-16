import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

const GoBackHomeButton = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const styles = getStyles(isDark);

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.text}>Volver al inicio</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GoBackHomeButton;

const getStyles = (dark: boolean) =>
  StyleSheet.create({
    wrapper: {
      alignItems: 'center',
      marginTop: 20,
    },
    button: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 25,
      backgroundColor: dark ? '#1A2C23' : '#B8E0C51F',
      borderWidth: dark ? 1 : 0,
      borderColor: dark ? '#B8E0C51F' : 'transparent',
    },
    text: {
      fontSize: 16,
      fontWeight: 'bold',
      color: dark ? '#EFF3F0' : '#1A2C23',
    },
  });
