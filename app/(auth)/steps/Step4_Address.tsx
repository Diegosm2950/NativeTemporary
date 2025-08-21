import FormInput from '@/components/FormInput';
import SelectInput from '@/components/SelectInput';
import { FormularioCompleto } from '@/types/navigation';
import { estados } from '@/utils/register';
import React from 'react';
import { Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, View, Platform, Image } from 'react-native';

interface Props {
  onNext: () => void;
  onBack?: () => void;
  formData: FormularioCompleto;
  updateForm: (data: Partial<FormularioCompleto>) => void;
}

const Step4_AddressData = ({ onNext, onBack, formData, updateForm }: Props) => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);


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

        <SelectInput
            options={estados}
            placeholder="Estado*"
            value={formData.direccion.estadoMx}
            onSelect={(value) => handleDireccionChange('estadoMx', value)}
        />

        <FormInput
          placeholder="Alcaldía o Municipio*"
          value={formData.direccion.delegacionMunicipio}
          onChangeText={(text) => handleDireccionChange('delegacionMunicipio', text)}
        />

        {/* Ciudad */}
        <FormInput
          placeholder="Ciudad*"
          value={formData.direccion.ciudad}
          onChangeText={(text) => handleDireccionChange('ciudad', text)}
        />


        {/* Colonia */}
        <FormInput
          placeholder="Colonia*"
          value={formData.direccion.colonia}
          onChangeText={(text) => handleDireccionChange('colonia', text)}
        />

        {/* Calle */}
        <FormInput
          placeholder="Calle*"
          value={formData.direccion.calle}
          onChangeText={(text) => handleDireccionChange('calle', text)}
        />

        {/* Código Postal */}
        <FormInput
          placeholder="Código postal*"
          keyboardType='numeric'
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

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#F8F9FA',
      padding: 55
    },
    contentContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centeredContent: {
      width: '100%',
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
