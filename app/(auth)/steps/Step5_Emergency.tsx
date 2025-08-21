import React from 'react';
import { Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, useColorScheme, View, Platform, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FormularioCompleto } from '@/types/navigation';
import GoBackHomeButton from '@/components/GoBackHomeButton';
import FormInput from '@/components/FormInput';
import SelectInput from '@/components/SelectInput';

interface Props {
  onNext: () => void;
  onBack?: () => void;
  formData: FormularioCompleto;
  updateForm: (data: Partial<FormularioCompleto>) => void;
}

const Step5_Emergency = ({ onNext, onBack, formData, updateForm }: Props) => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);
  const placeholderColor = '#A1A1A1';
  const validateForm = () => {
    const errors = [];
    if (!formData.contacto_emergencia.ceNombre?.trim()) errors.push('Nombre');
    if (!formData.contacto_emergencia.ceApellido1?.trim()) errors.push('Apellido paterno');
    if (!formData.contacto_emergencia.ceApellido2?.trim()) errors.push('Apellido materno');
    if (!formData.contacto_emergencia.ceCel?.trim()) errors.push('Celular');
    if (!formData.contacto_emergencia.ceTel?.trim()) errors.push('Teléfono');
    if (!formData.contacto_emergencia.ceParentesco?.trim()) errors.push('Parentesco');
    return errors;
  };

  const showErrorToast = (fields: string[]) => {
    // @ts-ignore
    import('react-native-toast-message').then(({ default: Toast }) => {
      Toast.show({
        type: 'error',
        text1: 'Campos requeridos',
        text2: `Faltan: ${fields.join(', ')}`,
      });
    });
  };

  const handleChange = (
    key: keyof FormularioCompleto['contacto_emergencia'],
    value: string
  ) => {
    updateForm({
      contacto_emergencia: {
        ...formData.contacto_emergencia,
        [key]: value,
      },
    });
  };

  const parentescoOptions = [
    'Padre',
    'Madre',
    'Hermano(a)',
    'Tío(a)',
    'Abuelo(a)',
    'Tutor',
    'Otro',
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('@/assets/images/LogoSnake.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.headerTitle}>Contacto de Emergencia</Text>
      </View>

      <FormInput
        placeholder="Nombre*"
        value={formData.contacto_emergencia.ceNombre}
        onChangeText={(text) => handleChange('ceNombre', text)}
      />

      <View style={styles.row}>
        <FormInput
          placeholder="Apellido paterno*"
          value={formData.contacto_emergencia.ceApellido1}
          onChangeText={(text) => handleChange('ceApellido1', text)}
          containerStyle={styles.halfInput}
        />
        <FormInput
          placeholder="Apellido materno*"
          value={formData.contacto_emergencia.ceApellido2}
          onChangeText={(text) => handleChange('ceApellido2', text)}
          containerStyle={styles.halfInput}
        />
      </View>

      <FormInput
        placeholder="Celular*"
        keyboardType="phone-pad"
        value={formData.contacto_emergencia.ceCel}
        onChangeText={(text) => handleChange('ceCel', text)}
      />

      <FormInput
        placeholder="Teléfono*"
        keyboardType="phone-pad"
        value={formData.contacto_emergencia.ceTel}
        onChangeText={(text) => handleChange('ceTel', text)}
      />

      <SelectInput
        label="Parentesco*"
        value={formData.contacto_emergencia.ceParentesco}
        onSelect={(value: string) => handleChange('ceParentesco', value)}
        options={parentescoOptions}
        placeholder="Parentesco*"
        isRequired
      />

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => {
          const missing = validateForm();
          if (missing.length > 0) {
            showErrorToast(missing);
            return;
          }
          onNext();
        }}
      >
        <Text style={styles.nextText}>Siguiente</Text>
      </TouchableOpacity>

      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.terms}>
        Al crear una cuenta, aceptas nuestros Términos y Condiciones.
      </Text>
    </ScrollView>
  );
};

export default Step5_Emergency;

const selectStyle = (isDark: boolean): React.CSSProperties => ({
  backgroundColor: isDark ? '#1A2C23' : '#EDF3EE',
  color: isDark ? '#fff' : '#000',
  border: 'none',
  borderRadius: 15,
  padding: 14,
  fontSize: 16,
  width: '100%',
  outline: 'none',
  appearance: 'none',
});

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 55,
      backgroundColor: isDark ? '#121212' : '#F8F9FA',
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
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    halfInput: {
      width: '48%',
    },
    nextButton: {
      backgroundColor: '#28a745',
      borderRadius: 30,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 10,
    },
    nextText: {
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
