import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Layout from '@/constants/Layout';
import ProfileHeader from '@/components/ProfileHeader';
import FormInput from '@/components/FormInput';
import SelectInput from '@/components/SelectInput';
import Button from '@/components/Button';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { User } from '@/types/user';
import { AuthContext } from '@/context/AuthContext';
import Toast from 'react-native-toast-message';
import { updateUserProfile } from '@/api/user/update';


const estados = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
  'CDMX', 'Chiapas', 'Chihuahua', 'Coahuila', 'Colima', 'Durango',
  'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco',
  'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
  'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
  'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz',
  'Yucatán', 'Zacatecas'
];

const parentescoOptions = [
  'Padre',
  'Madre',
  'Hermano(a)',
  'Tío(a)',
  'Abuelo(a)',
  'Tutor',
  'Otro',
];

type UserField = keyof User;

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { user, token, refreshUser } = useContext(AuthContext);
  const [userData, setUserData] = useState<User | null>(user); 

  if (!user) return null;

  if (user && userData === null) {
    setUserData(user);
  }

  if (userData === null) return null;
  
  const handleChange = (field: UserField, value: string) => {
    setUserData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value,
      };
    });
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  const handleSave = async () => {
    if (!userData || !token) return;    
    try {
      await updateUserProfile(userData, token, refreshUser);

      Toast.show({
        type: 'success',
        text1: '¡Éxito!',
        text2: 'Perfil actualizado correctamente',
      });
      
      router.push("/(protected)/(tabs)/perfil");
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Ocurrió un error al guardar los cambios',
      });
    }
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
            name={userData.nombre}
            email={userData.email}
            imageUrl={userData.foto || ''}
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
              value={userData.nombre}
              onChangeText={(text) => handleChange('nombre', text)}
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
              value={userData.estadoMx}
              onSelect={(value) => handleChange('estadoMx', value)}
              options={estados}
              isRequired
            />
            
            <FormInput
              label="Alcaldía o Municipio"
              value={userData.delegacionMunicipio}
              onChangeText={(text) => handleChange('delegacionMunicipio', text)}
              placeholder="Alcaldía o Municipio"
              isRequired
            />
            
            <FormInput
              label="Ciudad"
              value={userData.ciudad}
              onChangeText={(text) => handleChange('ciudad', text)}
              placeholder="Ciudad"
              isRequired
            />
            
            <FormInput
              label="Colonia"
              value={userData.colonia}
              onChangeText={(text) => handleChange('colonia', text)}
              placeholder="Colonia"
              isRequired
            />
            
            <View style={styles.rowContainer}>
              <FormInput
                label="Número"
                value={userData.cel}
                onChangeText={(text) => handleChange('cel', text)}
                placeholder="Número"
                keyboardType="numeric"
                isRequired
                containerStyle={styles.halfInput}
              />
              
              <FormInput
                label="Código postal"
                value={userData.cp}
                onChangeText={(text) => handleChange('cp', text)}
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
              value={userData.ceNombre}
              onChangeText={(text) => handleChange('ceNombre', text)}
              placeholder="Nombre completo"
              isRequired
            />
            
            <FormInput
              label="Celular"
              value={userData.ceCel}
              onChangeText={(text) => handleChange('ceCel', text)}
              placeholder="Número de celular"
              keyboardType="phone-pad"
              isRequired
            />
            
            <FormInput
              label="Teléfono"
              value={userData.ceTel}
              onChangeText={(text) => handleChange('ceTel', text)}
              placeholder="Número de teléfono"
              keyboardType="phone-pad"
            />
            
            <SelectInput
              label="Parentesco"
              value={userData.ceParentesco}
              onSelect={(value) => handleChange('ceParentesco', value)}
              options={parentescoOptions}
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