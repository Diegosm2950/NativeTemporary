import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, useColorScheme, Image } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { FormularioCompleto } from '@/types/navigation';
import GoBackHomeButton from '@/components/GoBackHomeButton';

interface Props {
  formData: FormularioCompleto;
  onBack?: () => void;
  resetForm: () => void;
  updateForm: (data: Partial<FormularioCompleto>) => void;
}

const Step6_Terms = ({ formData, onBack, resetForm, updateForm }: Props) => {
  const isDark = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleCheckbox = (key: keyof FormularioCompleto['aceptaciones']) => {
    updateForm({
      aceptaciones: {
        ...formData.aceptaciones,
        [key]: !formData.aceptaciones[key],
      },
    });
  };

  const handleInput = (key: 'contrasenia' | 'repetir_contrasenia', value: string) => {
    updateForm({ [key]: value });
  };

  const allAccepted =
    formData.aceptaciones.responsabilidad &&
    formData.aceptaciones.privacidad &&
    formData.aceptaciones.terminos;

  const handleSubmitRegistro = async () => {
    if (!formData.contrasenia || !formData.repetir_contrasenia) {
      Toast.show({
        type: 'error',
        text1: 'Campos requeridos',
        text2: 'Asegúrate de haber llenado todos los campos.',
      });
      return;
    }

    if (formData.contrasenia !== formData.repetir_contrasenia) {
      Toast.show({
        type: 'error',
        text1: 'Contraseña inválida',
        text2: 'Las contraseñas no coinciden.',
      });
      return;
    }

    setLoading(true);
    const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL;
    const url = `${API_BASE_URL}/api/registro`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      const contentType = res.headers.get('content-type');
      const data = contentType?.includes('application/json') ? JSON.parse(text) : null;

      if (!res.ok) {
        throw new Error(data?.error || 'Error en el registro');
      }

      Toast.show({
        type: 'success',
        text1: 'Registro exitoso',
        text2: data?.mensaje || 'Tu cuenta ha sido creada',
      });

      resetForm();

      setTimeout(() => {
        navigation.navigate('LoginScreen' as never);
      }, 2500);
    } catch (err: any) {
      console.error('Error en registro:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.message || 'No se pudo completar el registro',
      });
    } finally {
      setLoading(false);
    }
  };

  const styles = getStyles(isDark);
  const placeholderColor = isDark ? '#aaa' : '#888';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/LogoSnake.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Responsabilidades, términos y privacidad</Text>
        <Text style={styles.description}>
          Es necesario marque en verde los recuadros para aceptar los términos, gracias.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => handleCheckbox('responsabilidad')}
      >
        <View style={[styles.checkbox, formData.aceptaciones.responsabilidad && styles.checked]} />
        <Text style={styles.checkboxLabel}>
          Acepto la carta de Liberación de Responsabilidades *
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => handleCheckbox('terminos')}
      >
        <View style={[styles.checkbox, formData.aceptaciones.terminos && styles.checked]} />
        <Text style={styles.checkboxLabel}>
          Acepto los términos y condiciones de la FMRU *
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => handleCheckbox('privacidad')}
      >
        <View style={[styles.checkbox, formData.aceptaciones.privacidad && styles.checked]} />
        <Text style={styles.checkboxLabel}>
          Acepto las políticas de privacidad de la FMRU *
        </Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Contraseña*"
        placeholderTextColor={placeholderColor}
        secureTextEntry
        style={styles.input}
        value={formData.contrasenia}
        onChangeText={(text) => handleInput('contrasenia', text)}
      />

      <TextInput
        placeholder="Repetir Contraseña*"
        placeholderTextColor={placeholderColor}
        secureTextEntry
        style={styles.input}
        value={formData.repetir_contrasenia}
        onChangeText={(text) => handleInput('repetir_contrasenia', text)}
      />

      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.submitButton, (!allAccepted || loading) && { backgroundColor: '#ccc' }]}
        disabled={!allAccepted || loading}
        onPress={handleSubmitRegistro}
      >
        <Text style={styles.submitText}>{loading ? 'Enviando...' : 'Enviar'}</Text>
      </TouchableOpacity>

      <Text style={styles.terms}>
        Al crear una cuenta, aceptas nuestros Términos y Condiciones.
      </Text>
      <View>
        <GoBackHomeButton />
      </View>
    </ScrollView>
  );
};

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 45,
      backgroundColor: isDark ? '#020D06' : '#fff',
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
    },
    logo: {
      width: 80,
      height: 80,
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
      textAlign: 'center',
      marginBottom: 6,
    },
    description: {
      fontSize: 14,
      color: isDark ? '#bbb' : '#444',
      textAlign: 'center',
      marginBottom: 20,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16,
      gap: 10,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: '#53F29D',
      marginTop: 4,
    },
    checked: {
      backgroundColor: '#53F29D',
      borderColor: '#53F29D',
    },
    checkboxLabel: {
      flex: 1,
      fontSize: 14,
      color: isDark ? '#fff' : '#000',
    },
    input: {
      backgroundColor: '#EDF3EE',
      borderRadius: 15,
      padding: 14,
      marginBottom: 15,
      fontSize: 16,
      color: '#000',
    },
    submitButton: {
      backgroundColor: '#28a745',
      borderRadius: 30,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 10,
    },
    submitText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    backButton: {
      borderWidth: 1,
      borderColor: '#28a745',
      borderRadius: 30,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 10,
    },
    backText: {
      color: '#28a745',
      fontSize: 16,
      fontWeight: '500',
    },
    terms: {
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 40,
      color: '#888',
      fontSize: 14,
    },
  });

export default Step6_Terms;