import { StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';

type ReportCardProps = {
  title: string;
  onPress: () => void;
  icon?: string;
};

export default function ReportCard({ title, onPress, icon }: ReportCardProps) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].cardBackground }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && (
        <Image
          source={{ uri: 'https://i.imgur.com/t7WgvML.png' }}
          style={styles.icon}
          resizeMode="contain"
        />
      )}
      <Text style={[styles.title, { color: Colors[colorScheme].textSecondary }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Layout.spacing.l,
    borderRadius: Layout.borderRadius.large,
    marginBottom: Layout.spacing.m,
    alignItems: 'center',
    backgroundColor: '#F3F9F4',
  },
  icon: {
    width: 48,
    height: 48,
    marginBottom: Layout.spacing.m,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});