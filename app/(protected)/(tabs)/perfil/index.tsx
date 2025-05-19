import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';
import { mockUser } from '@/assets/data/mockUser';
import { ChevronRight } from 'lucide-react-native';
import Button from '@/components/Button';
import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  console.log(user)

  const handleEditProfile = () => {
    router.push('/(protected)/(tabs)/perfil/edit');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}
      edges={['top', 'right', 'left']}
    >
      <View style={styles.header}>

      </View>

      <View style={[styles.profileCard, { backgroundColor: Colors[colorScheme].cardBackground }]}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: mockUser.profileImage }}
            style={styles.profileImage}
          />
        </View>

        <Text style={[styles.name, { color: Colors[colorScheme].text }]}>
          {mockUser.name}
        </Text>
        <Text style={[styles.email, { color: Colors[colorScheme].textSecondary }]}>
          {mockUser.email}
        </Text>
      </View>

      <View style={[styles.idSection, { backgroundColor: Colors[colorScheme].cardBackground }]}>
        <Text style={[styles.idTitle, { color: Colors[colorScheme].text }]}>
          Tu ID único: {mockUser.id}
        </Text>
      </View>

      <View style={[styles.teamSection, { backgroundColor: Colors[colorScheme].cardBackground }]}>
        <View style={styles.teamHeader}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
            Mi Equipo
          </Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={[styles.seeAllText, { color: Colors[colorScheme].tint }]}>
              See All
            </Text>
            <ChevronRight size={20} color={Colors[colorScheme].tint} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.teamName, { color: Colors[colorScheme].textSecondary }]}>
          {mockUser.team.name}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Descargar ID"
          onPress={() => {}}
          style={styles.downloadButton}
        />
        <Button
          title="Editar Perfil"
          onPress={handleEditProfile}
          variant="secondary"
          style={styles.editButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.l,
    paddingHorizontal: Layout.spacing.l,
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
  profileCard: {
    alignItems: 'center',
    padding: Layout.spacing.l,
    marginHorizontal: Layout.spacing.l,
    borderRadius: Layout.borderRadius.large,
    marginBottom: Layout.spacing.l,
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
  idSection: {
    padding: Layout.spacing.l,
    marginHorizontal: Layout.spacing.l,
    borderRadius: Layout.borderRadius.large,
    marginBottom: Layout.spacing.l,
  },
  idTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  teamSection: {
    padding: Layout.spacing.l,
    marginHorizontal: Layout.spacing.l,
    borderRadius: Layout.borderRadius.large,
    marginBottom: Layout.spacing.l,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.s,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: Layout.spacing.xs,
  },
  teamName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  buttonContainer: {
    padding: Layout.spacing.l,
  },
  downloadButton: {
    marginBottom: Layout.spacing.m,
  },
  editButton: {
  },
});