import GoBackHomeButton from '@/components/GoBackHomeButton';
import { FormularioCompleto } from '@/types/navigation';
import React from 'react';
import { Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, View, Platform, Image } from 'react-native';

interface Props {
  onNext: () => void;
  onBack?: () => void;
  formData: FormularioCompleto;
  updateForm: (data: Partial<FormularioCompleto>) => void;
}

const estados = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
  'CDMX', 'Chiapas', 'Chihuahua', 'Coahuila', 'Colima', 'Durango',
  'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco',
  'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
  'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
  'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz',
  'Yucatán', 'Zacatecas'
];

const Step4_AddressData = ({ onNext, onBack, formData, updateForm }: Props) => {
  const isDark = useColorScheme() === 'dark';
  const isWeb = Platform.OS === 'web';
  const styles = getStyles(isDark);
  const placeholderColor = isDark ? '#aaa' : '#666';

  const handleDireccionChange = (key: keyof FormularioCompleto['direccion'], value: string) => {
    updateForm({
      direccion: {
        ...formData.direccion,
        [key]: value,
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('@/assets/images/LogoSnake.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.headerTitle}>Dirección</Text>
      </View>

      {/* Estado */}
      <View style={styles.selectWrapper}>
        {isWeb ? (
          <select
            value={formData.direccion.estadoMx || ''}
            onChange={(e) => handleDireccionChange('estadoMx', e.target.value)}
            style={selectStyle(isDark)}
          >
            <option value="">Estado*</option>
            {estados.map((estado) => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        ) : (
          <Text style={styles.selectText}>
            {formData.direccion.estadoMx || "Estado*"}
          </Text>
        )}
      </View>

      {/* Delegación o Municipio */}
      <TextInput
        placeholder="Alcaldía o Municipio*"
        placeholderTextColor={placeholderColor}
        style={styles.input}
        value={formData.direccion.delegacionMunicipio}
        onChangeText={(text) => handleDireccionChange('delegacionMunicipio', text)}
      />

      {/* Ciudad */}
      <View style={styles.selectWrapper}>
        {isWeb ? (
          <select
            value={formData.direccion.ciudad || ''}
            onChange={(e) => handleDireccionChange('ciudad', e.target.value)}
            style={selectStyle(isDark)}
          >
            <option value="">Ciudad*</option>
            <option value="Ciudad de México">Ciudad de México</option>
            <option value="Guadalajara">Guadalajara</option>
            <option value="Monterrey">Monterrey</option>
            {/* puedes agregar más ciudades si deseas */}
          </select>
        ) : (
          <Text style={styles.selectText}>
            {formData.direccion.ciudad || "Ciudad*"}
          </Text>
        )}
      </View>

      {/* Colonia */}
      <TextInput
        placeholder="Colonia*"
        placeholderTextColor={placeholderColor}
        style={styles.input}
        value={formData.direccion.colonia}
        onChangeText={(text) => handleDireccionChange('colonia', text)}
      />

      <TextInput
        placeholder="Calle*"
        placeholderTextColor={placeholderColor}
        style={styles.input}
        value={formData.direccion.colonia}
        onChangeText={(text) => handleDireccionChange('calle', text)}
      />

      {/* Número y Código Postal */}
      <View style={styles.row}>
        <TextInput
          placeholder="Código postal*"
          placeholderTextColor={placeholderColor}
          keyboardType="numeric"
          style={[styles.input, styles.halfInput]}
          value={formData.direccion.cp}
          onChangeText={(text) => handleDireccionChange('cp', text)}
        />
      </View>

      {/* Botones */}
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
      marginBottom: 15,
    },
    selectText: {
      fontSize: 16,
      paddingVertical: 14,
      paddingHorizontal: 10,
      backgroundColor: '#EDF3EE',
      borderRadius: 15,
      color: '#333',
    },
    nextButton: {
      backgroundColor: '#28a745',
      borderRadius: 30,
      paddingVertical: 16,
      paddingHorizontal: 25,
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
      paddingHorizontal: 25,
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

export default Step4_AddressData;
