import { StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

type ReportCardProps = {
  title: string;
  onPress: () => void;
  icon?: 'global' | 'trophy' | 'match' | 'general' | string; 
};

export default function ReportCard({ title, onPress, icon }: ReportCardProps) {
  const colorScheme = useColorScheme();

  const renderIcon = () => {
    if (!icon) return null;

    const iconColor = Colors[colorScheme].textSecondary;
    const iconSize = 32;

    switch (icon) {
      case 'global':
        return <MaterialIcons name="public" size={iconSize} color={iconColor} />;
      case 'trophy':
        return <FontAwesome name="trophy" size={iconSize} color={iconColor} />;
      case 'match':
        return <MaterialIcons name="sports-soccer" size={iconSize} color={iconColor} />;
      case 'general':
        return <FontAwesome name="question-circle" size={iconSize} color={iconColor} />;
      default:
        return (
          <Image
            source={{ uri: icon }}
            style={styles.icon}
            resizeMode="contain"
          />
        );
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].cardBackground }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {renderIcon()}
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
    marginTop: Layout.spacing.s,
  },
});