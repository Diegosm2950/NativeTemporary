import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useColorScheme, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import { FormularioCompleto } from '@/types/navigation';
import GoBackHomeButton from '@/components/GoBackHomeButton';

interface Props {
  onNext: () => void;
  onBack?: () => void;
  formData: FormularioCompleto;
  updateForm: (data: Partial<FormularioCompleto>) => void;
}

const Step2_Photo = ({ onNext, onBack, formData, updateForm }: Props) => {
  const isDark = useColorScheme() === 'dark';
  const styles = getStyles(isDark);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets?.[0]) {
      const base64String = `data:image/jpeg;base64,${result.assets[0].base64}`;
      updateForm({ foto: base64String });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Título */}
        <Text style={styles.stepTitle}>Fotografía *</Text>

        {/* Vista de fotografía o botón */}
        <View style={styles.photoContainer}>
          {formData.foto ? (
            <Image source={{ uri: formData.foto }} style={styles.imagePreview} />
          ) : (
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Camera size={48} color="#28a745" />
              <Text style={styles.pickText}>Subir foto</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Requisitos de la foto */}
        <View style={styles.requirementsContainer}>
          <Text style={styles.requirement}>• Tipo infantil o pasaporte.</Text>
          <Text style={styles.requirement}>• A color.</Text>
          <Text style={styles.requirement}>• No más de 30 días de antigüedad.</Text>
          <Text style={styles.requirement}>• Fondo blanco, cabeza descubierta y sin lentes u otros accesorios.</Text>
        </View>

        {/* Botón Siguiente */}
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextText}>Siguiente</Text>
        </TouchableOpacity>

        {/* Pie de página */}
        <Text style={styles.terms}>
          Al crear una cuenta, aceptas nuestros Términos y Condiciones.
        </Text>
      </View>
      <GoBackHomeButton />
    </View>
  );
};

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#020D06' : '#fff',
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      width: '100%',
      maxWidth: 400,
      alignItems: 'center',
    },
    stepTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 24,
      color: isDark ? '#fff' : '#000',
    },
    photoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 32,
    },
    imagePicker: {
      width: 250,
      height: 250,
      borderWidth: 2,
      borderColor: '#28a745',
      borderStyle: 'dashed',
      borderRadius: 125,
      backgroundColor: isDark ? '#B0E8C21F' : '#F8FAF9',
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({ web: { cursor: 'pointer' } }),
    },
    imagePreview: {
      width: 250,
      height: 250,
      borderRadius: 125,
    },
    pickText: {
      marginTop: 12,
      fontSize: 16,
      fontWeight: '500',
      color: '#28a745',
    },
    requirementsContainer: {
      width: '100%',
      paddingHorizontal: 10,
      marginBottom: 32,
    },
    requirement: {
      fontSize: 15,
      color: isDark ? '#ccc' : '#444',
      lineHeight: 22,
      marginBottom: 6,
    },
    nextButton: {
      backgroundColor: '#28a745',
      borderRadius: 25,
      paddingVertical: 14,
      paddingHorizontal: 32,
      alignItems: 'center',
      marginBottom: 16,
    },
    nextText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    terms: {
      textAlign: 'center',
      color: isDark ? '#bbb' : '#666',
      fontSize: 13,
      marginTop: 16,
    },
  });


export default Step2_Photo;
