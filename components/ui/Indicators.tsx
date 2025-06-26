// components/Indicators.tsx
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import useColorScheme from '@/hooks/useColorScheme';

export const LoadingIndicator = () => {
  const colorScheme = useColorScheme();
  
  return (
    <View style={[styles.centerContainer, { backgroundColor: Colors[colorScheme].background }]}>
      <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
      <Text style={[styles.centerText, {color: Colors[colorScheme].text}]}>
        Loading...
      </Text>
    </View>
  );
};

export const ErrorIndicator = ({ error }: { error: string }) => {
  const colorScheme = useColorScheme();
  
  return (
    <View style={[styles.centerContainer, { backgroundColor: Colors[colorScheme].background }]}>
      <Text style={[styles.centerText, {color: Colors[colorScheme].error}]}>
        {error}
      </Text>
    </View>
  );
};

export const EmptyDataIndicator = ({ message }: { message: string }) => {
  const colorScheme = useColorScheme();
  
  return (
    <View style={[styles.centerContainer, { backgroundColor: Colors[colorScheme].background }]}>
      <Text style={[styles.centerText, {color: Colors[colorScheme].text}]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
    marginTop: Layout.spacing.m,
    fontSize: 16,
  },
});