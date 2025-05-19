import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';

export default function ReportsScreen() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
        Reportes
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
});