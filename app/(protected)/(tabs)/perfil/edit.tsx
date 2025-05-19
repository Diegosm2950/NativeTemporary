import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';
import { mockUser } from '@/assets/data/mockUser';
import ProfileHeader from '@/components/ProfileHeader';
import FormInput from '@/components/FormInput';
import SelectInput from '@/components/SelectInput';
import Button from '@/components/Button';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { User } from '@/types/user';
import { AuthContext } from '@/context/AuthContext';

const relationshipOptions = [
  { label: 'Padre/Madre', value: 'parent' },
  { label: 'Hermano/a', value: 'sibling' },
  { label: 'Cónyuge', value: 'spouse' },
  { label: 'Amigo/a', value: 'friend' },
  { label: 'Otro', value: 'other' },
];

const stateOptions = [
  { label: 'Ciudad de México', value: 'cdmx' },
  { label: 'Estado de México', value: 'edomex' },
  { label: 'Jalisco', value: 'jalisco' },
  { label: 'Nuevo León', value: 'nuevoleon' },
];

const cityOptions = [
  { label: 'Ciudad de México', value: 'cdmx' },
  { label: 'Guadalajara', value: 'guadalajara' },
  { label: 'Monterrey', value: 'monterrey' },
  { label: 'Puebla', value: 'puebla' },
];

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const { user } = useContext(AuthContext);
  console.log(user)
  
  const [userData, setUserData] = useState<User>({...mockUser});
  
  const handleChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleAddressChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };
  
  const handleEmergencyContactChange = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }));
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  const handleSave = () => {
    console.log('Saving user data:', userData);
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}
      edges={['top', 'right', 'left']}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <ProfileHeader
            name={userData.name}
            email={userData.email}
            imageUrl={userData.profileImage}
            showCheckmark
          />
          
          <Animated.View
            entering={FadeInDown.duration(600).delay(100)}
            style={styles.formSection}
          >
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
              Información
            </Text>
            
            <FormInput
              label="Nombre"
              value={userData.name}
              onChangeText={(text) => handleChange('name', text)}
              placeholder="Nombre completo"
              isRequired
            />
            
            <FormInput
              label="Correo Electrónico"
              value={userData.email}
              onChangeText={(text) => handleChange('email', text)}
              placeholder="correo@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              isRequired
            />
          </Animated.View>
          
          <Animated.View
            entering={FadeInDown.duration(600).delay(200)}
            style={styles.formSection}
          >
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
              Dirección
            </Text>
            
            <SelectInput
              label="Estado"
              value={userData.address.state}
              onSelect={(value) => handleAddressChange('state', value)}
              options={stateOptions}
              isRequired
            />
            
            <FormInput
              label="Alcaldía o Municipio"
              value={userData.address.municipality}
              onChangeText={(text) => handleAddressChange('municipality', text)}
              placeholder="Alcaldía o Municipio"
              isRequired
            />
            
            <SelectInput
              label="Ciudad"
              value={userData.address.city}
              onSelect={(value) => handleAddressChange('city', value)}
              options={cityOptions}
              isRequired
            />
            
            <FormInput
              label="Colonia"
              value={userData.address.neighborhood}
              onChangeText={(text) => handleAddressChange('neighborhood', text)}
              placeholder="Colonia"
              isRequired
            />
            
            <View style={styles.rowContainer}>
              <FormInput
                label="Número"
                value={userData.address.number}
                onChangeText={(text) => handleAddressChange('number', text)}
                placeholder="Número"
                keyboardType="numeric"
                isRequired
                containerStyle={styles.halfInput}
              />
              
              <FormInput
                label="Código postal"
                value={userData.address.postalCode}
                onChangeText={(text) => handleAddressChange('postalCode', text)}
                placeholder="Código postal"
                keyboardType="numeric"
                isRequired
                containerStyle={styles.halfInput}
              />
            </View>
          </Animated.View>
          
          <Animated.View
            entering={FadeInDown.duration(600).delay(300)}
            style={styles.formSection}
          >
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
              Contacto de Emergencia
            </Text>
            
            <FormInput
              label="Nombre"
              value={userData.emergencyContact.name}
              onChangeText={(text) => handleEmergencyContactChange('name', text)}
              placeholder="Nombre completo"
              isRequired
            />
            
            <FormInput
              label="Celular"
              value={userData.emergencyContact.mobile}
              onChangeText={(text) => handleEmergencyContactChange('mobile', text)}
              placeholder="Número de celular"
              keyboardType="phone-pad"
              isRequired
            />
            
            <FormInput
              label="Teléfono"
              value={userData.emergencyContact.phone}
              onChangeText={(text) => handleEmergencyContactChange('phone', text)}
              placeholder="Número de teléfono"
              keyboardType="phone-pad"
            />
            
            <SelectInput
              label="Parentesco"
              value={userData.emergencyContact.relationship}
              onSelect={(value) => handleEmergencyContactChange('relationship', value)}
              options={relationshipOptions}
              isRequired
            />
          </Animated.View>
          
          <Animated.View
            entering={FadeInDown.duration(600).delay(400)}
            style={styles.buttonContainer}
          >
            <Button
              title="Cancelar"
              onPress={handleCancel}
              variant="secondary"
              style={styles.cancelButton}
            />
            
            <Button
              title="Guardar"
              onPress={handleSave}
              style={styles.saveButton}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    padding: Layout.spacing.l,
    paddingBottom: Layout.spacing.xxl,
  },
  formSection: {
    marginBottom: Layout.spacing.l,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: Layout.spacing.m,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Layout.spacing.l,
  },
  cancelButton: {
    flex: 1,
    marginRight: Layout.spacing.s,
  },
  saveButton: {
    flex: 1,
    marginLeft: Layout.spacing.s,
  },
});