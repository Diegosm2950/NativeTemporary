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
  const placeholderColor = isDark ? '#aaa' : '#888';

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

      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.nextButton} onPress={onNext}>
        <Text style={styles.nextText}>Siguiente</Text>
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
      backgroundColor: '#EDF3EE',
      borderRadius: 15,
      padding: 14,
      marginBottom: 15,
      fontSize: 16,
      color: '#000',
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
    },
    picker: {
      backgroundColor: '#EDF3EE',
      borderRadius: 15,
      color: isDark ? '#fff' : '#000',
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
