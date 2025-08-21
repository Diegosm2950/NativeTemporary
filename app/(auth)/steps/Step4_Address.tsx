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
  const placeholderColor = '#A1A1A1';


  const handleDireccionChange = (key: keyof FormularioCompleto['direccion'], value: string) => {
    updateForm({
      direccion: {
        ...formData.direccion,
        [key]: value,
      },
    });
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.direccion.estadoMx?.trim()) errors.push('Estado');
    if (!formData.direccion.delegacionMunicipio?.trim()) errors.push('Alcaldía o Municipio');
    if (!formData.direccion.ciudad?.trim()) errors.push('Ciudad');
    if (!formData.direccion.colonia?.trim()) errors.push('Colonia');
    if (!formData.direccion.calle?.trim()) errors.push('Calle');
    if (!formData.direccion.cp?.trim()) errors.push('Código postal');
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.centeredContent}>
        <View style={styles.header}>
          <Image source={require('@/assets/images/LogoSnake.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.headerTitle}>Dirección</Text>
        </View>

        {/* Estado */}
        <View style={[styles.selectWrapper, { backgroundColor: isDark ? '#1a1a1a' : '#F6F6F6', borderRadius: 8 }]}> 
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
            <TextInput
              placeholder="Estado*"
              placeholderTextColor={placeholderColor}
              style={[styles.input, { color: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#1a1a1a' : '#F6F6F6' }]}
              value={formData.direccion.estadoMx}
              onChangeText={(text) => handleDireccionChange('estadoMx', text)}
            />
          )}
        </View>

        {/* Delegación o Municipio */}
        <TextInput
          placeholder="Alcaldía o Municipio*"
          placeholderTextColor={placeholderColor}
          style={[styles.input, { color: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#1a1a1a' : '#F6F6F6' }]}
          value={formData.direccion.delegacionMunicipio}
          onChangeText={(text) => handleDireccionChange('delegacionMunicipio', text)}
        />

        {/* Ciudad */}
        <View style={[styles.selectWrapper, { backgroundColor: isDark ? '#1a1a1a' : '#F6F6F6', borderRadius: 8 }]}> 
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
            </select>
          ) : (
            <TextInput
              placeholder="Ciudad*"
              placeholderTextColor={placeholderColor}
              style={[styles.input, { color: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#1a1a1a' : '#F6F6F6' }]}
              value={formData.direccion.ciudad}
              onChangeText={(text) => handleDireccionChange('ciudad', text)}
            />
          )}
        </View>


        {/* Colonia */}
        <TextInput
          placeholder="Colonia*"
          placeholderTextColor={placeholderColor}
          style={[styles.input, { color: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#1a1a1a' : '#F6F6F6' }]}
          value={formData.direccion.colonia}
          onChangeText={(text) => handleDireccionChange('colonia', text)}
        />

        {/* Calle */}
        <TextInput
          placeholder="Calle*"
          placeholderTextColor={placeholderColor}
          style={[styles.input, { color: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#1a1a1a' : '#F6F6F6' }]}
          value={formData.direccion.calle}
          onChangeText={(text) => handleDireccionChange('calle', text)}
        />

        {/* Código Postal */}
        <TextInput
          placeholder="Código postal*"
          placeholderTextColor={placeholderColor}
          keyboardType="numeric"
          style={[styles.input, { color: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#1a1a1a' : '#F6F6F6' }]}
          value={formData.direccion.cp}
          onChangeText={(text) => handleDireccionChange('cp', text)}
        />

        {/* Botones */}

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
      backgroundColor: isDark ? '#020D06' : '#fff',
    },
    contentContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 30,
    },
    centeredContent: {
      width: '100%',
      maxWidth: 420,
      alignSelf: 'center',
      alignItems: 'center',
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
      marginBottom: 15,
      width: '100%',
      maxWidth: 360,
      alignSelf: 'center',
      alignItems: 'center',
    },
    selectText: {
      fontSize: 16,
      paddingVertical: 14,
      paddingHorizontal: 10,
      backgroundColor: isDark ? '#1a1a1a' : '#F6F6F6',
      borderRadius: 8,
      color: isDark ? '#fff' : '#333',
      width: '100%',
      maxWidth: 360,
      alignSelf: 'center',
      textAlign: 'center',
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
