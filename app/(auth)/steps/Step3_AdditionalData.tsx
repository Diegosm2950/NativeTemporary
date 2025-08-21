import React from "react";
import { Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, View, Platform, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Toast from 'react-native-toast-message';
import { FormularioCompleto } from "@/types/navigation";
import FormInput from "@/components/FormInput";
import SelectInput from "@/components/SelectInput";
import { ESCOLARIDAD_OPTIONS, TIPO_SANGRE_OPTIONS } from "@/utils/register";

interface Props {
  onNext: () => void;
  onBack?: () => void;
  formData: FormularioCompleto;
  updateForm: (data: Partial<FormularioCompleto>) => void;
}

const Step3_AdditionalData = ({ onNext, onBack, formData, updateForm }: Props) => {
  const isDark = useColorScheme() === "dark";
  const isWeb = Platform.OS === "web";
  const styles = getStyles(isDark);

  const handleChange = (
    key: keyof FormularioCompleto,
    value: string | boolean
  ) => {
    updateForm({ [key]: value } as Partial<FormularioCompleto>);
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.tel?.trim()) errors.push('Teléfono');
    if (!formData.cel?.trim()) errors.push('Celular');
    if (!formData.email?.trim()) errors.push('Email');
    if (!formData.curp?.trim() && !formData.esExtranjero) errors.push('CURP');
    if (!formData.pasaporte?.trim() && formData.esExtranjero) errors.push('Pasaporte');
    if (!formData.nacionalidad?.trim()) errors.push('Nacionalidad');
    if (!formData.escolaridad?.trim()) errors.push('Escolaridad');
    if (!formData.tipoSangre?.trim()) errors.push('Tipo de sangre');
    if (!formData.alergiasEnfermedadesDesc?.trim()) errors.push('Alergias y/o enfermedades');

    // Validar RFC si es requerido
    const shouldShowRFC = !formData.esExtranjero && calculateAge(formData.fechaNacimiento) >= 18;
    if (shouldShowRFC && !formData.rfc?.trim()) errors.push('RFC');

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      Toast.show({
        type: 'error',
        text1: 'Email inválido',
        text2: 'Por favor ingresa un email válido',
      });
      return false;
    }

    if (errors.length > 0) {
      Toast.show({
        type: 'error',
        text1: 'Campos requeridos',
        text2: `Faltan: ${errors.join(', ')}`,
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

const calculateAge = (birthDate: string | Date | null) => {
  if (!birthDate) return 0;
  
  // Convert to Date object if it's a string
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  
  // If we still don't have a valid date, return 0
  if (isNaN(birth.getTime())) return 0;
  
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Then use it like this:
const shouldShowRFC = !formData.esExtranjero && calculateAge(formData.fechaNacimiento) >= 18;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/LogoSnake.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Datos adicionales</Text>
      </View>

      <View style={styles.row}>
        <FormInput
          placeholder="Teléfono*"
          value={formData.tel}
          onChangeText={(text) => handleChange("tel", text)}
          keyboardType="phone-pad"
          containerStyle={styles.halfInput}
        />
        <FormInput
          placeholder="Celular*"
          value={formData.cel}
          onChangeText={(text) => handleChange("cel", text)}
          keyboardType="phone-pad"
          containerStyle={styles.halfInput}
        />
      </View>

      <FormInput
        placeholder="Email*"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <FormInput
        placeholder="CURP*"
        value={formData.curp}
        onChangeText={(text) => handleChange("curp", text)}
        autoCapitalize="characters"
      />

      {/* Add RFC field conditionally */}
      {shouldShowRFC && (
        <FormInput
          placeholder="RFC*"
          value={formData.rfc}
          onChangeText={(text) => handleChange("rfc", text)}
          autoCapitalize="characters"
        />
      )}

      <FormInput
        placeholder="Nacionalidad*"
        value={formData.nacionalidad}
        onChangeText={(text) => handleChange("nacionalidad", text)}
      />

      {/* Escolaridad + Tipo de sangre */}
      <SelectInput
        value={formData.escolaridad}
        onSelect={(value: string) => handleChange("escolaridad", value)}
        options={ESCOLARIDAD_OPTIONS}
        placeholder="Escolaridad*"
        isRequired
      />

      <SelectInput
        value={formData.tipoSangre}
        onSelect={(value: string) => handleChange("tipoSangre", value)}
        options={TIPO_SANGRE_OPTIONS}
        placeholder="Tipo de sangre*"
        isRequired
      />

      <FormInput
        placeholder="Alergias y/o enfermedades*"
        label="Si no tiene ponga (ninguna)"
        multiline
        value={formData.alergiasEnfermedadesDesc}
        onChangeText={(text) => handleChange("alergiasEnfermedadesDesc", text)}
        isRequired
      />

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => handleChange("esExtranjero", !formData.esExtranjero)}
      >
        <View style={[styles.checkbox, formData.esExtranjero && styles.checkedBox]}>
          {formData.esExtranjero && (
            <>
              <Ionicons name="checkmark" size={16} color="#fff" />
            </>
          )}
        </View>
        <Text style={[styles.checkboxLabel, { color: isDark ? '#fff' : '#000' }]}>
          Si no tienes CURP y eres extranjero, selecciona esta opción e ingresa tu número de pasaporte
        </Text>
      </TouchableOpacity>

      {formData.esExtranjero && (
        <FormInput
          placeholder="Pasaporte"
          value={formData.pasaporte}
          onChangeText={(text) => handleChange("pasaporte", text)}
        />
      )}

      <TouchableOpacity 
        style={styles.nextButton} 
        onPress={handleNext}
      >
        <Text style={styles.nextText}>Siguiente</Text>
      </TouchableOpacity>

      {/* Botones */}
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

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 55,
      backgroundColor: isDark ? '#121212' : '#F8F9FA',
    },
    contentContainer: {
      justifyContent: 'center',
      flexGrow: 1,
    },
    header: {
      alignItems: "center",
      marginTop: 20,
      marginBottom: 20,
    },
    logo: {
      width: 80,
      height: 80,
      marginBottom: 12,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: isDark ? "#fff" : "#000",
    },
    input: {
      backgroundColor: isDark ? '#1a1a1a' : '#F6F6F6',
      borderRadius: 8,
      padding: 16,
      marginBottom: 15,
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 50,
    },
    picker: {
      color: isDark ? '#fff' : '#000',
      backgroundColor: isDark ? '#1a1a1a' : '#F6F6F6',
      borderRadius: 8,
      marginBottom: 0,
      width: '100%',
      flex: 1,
      minWidth: 0,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      gap: 10,
    },
    halfInput: {
      width: "48%"
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      color: "black"
    },
    checkbox: {
      width: 22,
      height: 22,
      borderWidth: 2,
      borderColor: "#28a745",
      borderRadius: 4,
      marginRight: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    checkedBox: {
      backgroundColor: "#28a745",
    },
    checkboxLabel: {
      flex: 1,
      fontSize: 14,
      color: isDark ? '#fff' : '#000',
    },
    nextButton: {
      backgroundColor: "#28a745",
      borderRadius: 30,
      paddingVertical: 16,
      paddingHorizontal: 24,
      alignItems: "center",
      marginTop: 10,
    },
    nextText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    terms: {
      textAlign: "center",
      marginTop: 20,
      marginBottom: 40,
      color: "#888",
      fontSize: 14,
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
  });

export default Step3_AdditionalData;
