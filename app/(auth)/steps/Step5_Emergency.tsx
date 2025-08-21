import React from 'react';
import { Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, useColorScheme, View, Platform, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FormularioCompleto } from '@/types/navigation';
import GoBackHomeButton from '@/components/GoBackHomeButton';

interface Props {
  onNext: () => void;
  onBack?: () => void;
  formData: FormularioCompleto;
  updateForm: (data: Partial<FormularioCompleto>) => void;
}

const Step5_Emergency = ({ onNext, onBack, formData, updateForm }: Props) => {
  const isDark = useColorScheme() === 'dark';
  const isWeb = Platform.OS === 'web';
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

      <TextInput
        placeholder="Nombre*"
        placeholderTextColor={placeholderColor}
        style={styles.input}
        value={formData.contacto_emergencia.ceNombre}
        onChangeText={(text) => handleChange('ceNombre', text)}
      />

      <View style={styles.row}>
        <TextInput
          placeholder="Apellido paterno*"
          placeholderTextColor={placeholderColor}
          style={[styles.input, styles.halfInput]}
          value={formData.contacto_emergencia.ceApellido1}
          onChangeText={(text) => handleChange('ceApellido1', text)}
        />
        <TextInput
          placeholder="Apellido materno*"
          placeholderTextColor={placeholderColor}
          style={[styles.input, styles.halfInput]}
          value={formData.contacto_emergencia.ceApellido2}
          onChangeText={(text) => handleChange('ceApellido2', text)}
        />
      </View>

      <TextInput
        placeholder="Celular*"
        placeholderTextColor={placeholderColor}
        keyboardType="phone-pad"
        style={styles.input}
        value={formData.contacto_emergencia.ceCel}
        onChangeText={(text) => handleChange('ceCel', text)}
      />

      <TextInput
        placeholder="Teléfono*"
        placeholderTextColor={placeholderColor}
        keyboardType="phone-pad"
        style={styles.input}
        value={formData.contacto_emergencia.ceTel}
        onChangeText={(text) => handleChange('ceTel', text)}
      />

      <View style={styles.selectWrapper}>
        {isWeb ? (
          <select
            value={formData.contacto_emergencia.ceParentesco || ''}
            onChange={(e) => handleChange('ceParentesco', e.target.value)}
            style={selectStyle(isDark)}
          >
            <option value="">Parentesco*</option>
            {parentescoOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <Picker
            selectedValue={formData.contacto_emergencia.ceParentesco}
            onValueChange={(value) => handleChange('ceParentesco', value)}
            style={styles.picker}
            dropdownIconColor={isDark ? '#fff' : '#000'}
          >
            <Picker.Item label="Parentesco*" value="" />
            {parentescoOptions.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        )}
      </View>

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
    },
    input: {
      backgroundColor: isDark ? '#1a1a1a' : '#F6F6F6',
      borderRadius: 8,
      padding: 16,
      marginBottom: 15,
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
      minHeight: 50,
      width: '100%',
      maxWidth: 360,
      alignSelf: 'center',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    halfInput: {
      width: '48%',
    },
    selectWrapper: {
      marginBottom: 20,
      width: '100%',
      maxWidth: 360,
      alignSelf: 'center',
      alignItems: 'center',
    },
    picker: {
      backgroundColor: isDark ? '#1a1a1a' : '#F6F6F6',
      borderRadius: 8,
      color: isDark ? '#fff' : '#000',
      width: '100%',
      maxWidth: 360,
      alignSelf: 'center',
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
