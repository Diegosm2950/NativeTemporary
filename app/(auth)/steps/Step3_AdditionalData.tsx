import React from "react";
import { Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, View, Platform, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { FormularioCompleto } from "@/types/navigation";

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
  const placeholderColor = isDark ? "#aaa" : "#666";

  const handleChange = (
    key: keyof FormularioCompleto,
    value: string | boolean
  ) => {
    updateForm({ [key]: value } as Partial<FormularioCompleto>);
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
  const isRFCRequired = shouldShowRFC;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/LogoSnake.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Datos adicionales</Text>
      </View>

      <View style={styles.row}>
        <TextInput
          placeholder="Teléfono*"
          placeholderTextColor={placeholderColor}
          style={[styles.input, styles.halfInput]}
          value={formData.tel}
          onChangeText={(text) => handleChange("tel", text)}
          keyboardType="phone-pad"
        />
        <TextInput
          placeholder="Celular*"
          placeholderTextColor={placeholderColor}
          style={[styles.input, styles.halfInput]}
          value={formData.cel}
          onChangeText={(text) => handleChange("cel", text)}
          keyboardType="phone-pad"
        />
      </View>

      <TextInput
        placeholder="Email*"
        placeholderTextColor={placeholderColor}
        style={styles.input}
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="CURP*"
        placeholderTextColor={placeholderColor}
        style={styles.input}
        value={formData.curp}
        onChangeText={(text) => handleChange("curp", text)}
        autoCapitalize="characters"
      />

      {/* Add RFC field conditionally */}
      {shouldShowRFC && (
        <TextInput
          placeholder="RFC*"
          placeholderTextColor={placeholderColor}
          style={styles.input}
          value={formData.rfc}
          onChangeText={(text) => handleChange("rfc", text)}
          autoCapitalize="characters"
        />
      )}

      <TextInput
        placeholder="Nacionalidad*"
        placeholderTextColor={placeholderColor}
        style={styles.input}
        value={formData.nacionalidad}
        onChangeText={(text) => handleChange("nacionalidad", text)}
      />

      {/* Escolaridad + Tipo de sangre */}
      <View style={styles.row}>
        <View style={styles.halfInput}>
          {isWeb ? (
            <select
              value={formData.escolaridad || ""}
              onChange={(e) => handleChange("escolaridad", e.target.value)}
              style={selectStyle(isDark)}
            >
              <option value="">Escolaridad*</option>
              <option value="Primaria">Primaria</option>
              <option value="Secundaria">Secundaria</option>
              <option value="Preparatoria">Preparatoria</option>
              <option value="Licenciatura">Licenciatura</option>
              <option value="Maestría">Maestría</option>
              <option value="Doctorado">Doctorado</option>
            </select>
          ) : (
            <Picker
              selectedValue={formData.escolaridad}
              onValueChange={(value) => handleChange("escolaridad", value)}
              style={styles.picker}
            >
              <Picker.Item label="Escolaridad*" value="" />
              <Picker.Item label="Primaria" value="Primaria" />
              <Picker.Item label="Secundaria" value="Secundaria" />
              <Picker.Item label="Preparatoria" value="Preparatoria" />
              <Picker.Item label="Licenciatura" value="Licenciatura" />
              <Picker.Item label="Maestría" value="Maestría" />
              <Picker.Item label="Doctorado" value="Doctorado" />
            </Picker>
          )}
        </View>

        <View style={styles.halfInput}>
          {isWeb ? (
            <select
              value={formData.tipoSangre || ""}
              onChange={(e) => handleChange("tipoSangre", e.target.value)}
              style={selectStyle(isDark)}
            >
              <option value="">Tipo de sangre*</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          ) : (
            <Picker
              selectedValue={formData.tipoSangre}
              onValueChange={(value) => handleChange("tipoSangre", value)}
              style={styles.picker}
            >
              <Picker.Item label="Tipo de sangre*" value="" />
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((tipo) => (
                <Picker.Item key={tipo} label={tipo} value={tipo} />
              ))}
            </Picker>
          )}
        </View>
      </View>

      <TextInput
        placeholder="Alergias y/o enfermedades"
        placeholderTextColor={placeholderColor}
        style={[styles.input, { minHeight: 80, textAlignVertical: "top", marginTop: 14 }]}
        multiline
        value={formData.alergiasEnfermedadesDesc}
        onChangeText={(text) => handleChange("alergiasEnfermedadesDesc", text)}
      />

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => handleChange("esExtranjero", !formData.esExtranjero)}
      >
        <View style={styles.checkbox}>
          {formData.esExtranjero && (
            <Ionicons name="checkmark" size={16} color="#28a745" />
          )}
        </View>
        <Text style={styles.checkboxLabel}>
          Si no tienes CURP y eres extranjero, selecciona esta opción e ingresa tu número de pasaporte
        </Text>
      </TouchableOpacity>

      {formData.esExtranjero && (
        <TextInput
          placeholder="Pasaporte"
          placeholderTextColor={placeholderColor}
          style={styles.input}
          value={formData.pasaporte}
          onChangeText={(text) => handleChange("pasaporte", text)}
        />
      )}

      <TouchableOpacity 
        style={styles.nextButton} 
        onPress={onNext}
        disabled={isRFCRequired && !formData.rfc} // Disable if RFC is required but not filled
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

const selectStyle = (isDark: boolean): React.CSSProperties => ({
  backgroundColor: isDark ? "#1A2C23" : "#f0f0f0",
  color: isDark ? "#fff" : "#000",
  border: "none",
  borderRadius: 15,
  padding: 14,
  fontSize: 16,
  width: "100%",
  outline: "none",
  appearance: "none",
});

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 45,
      backgroundColor: isDark ? "#020D06" : "#fff",
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
      backgroundColor: "#EDF3EE",
      borderRadius: 15,
      padding: 14,
      marginBottom: 15,
      fontSize: 16,
      color: "#000",
    },
    picker: {
      color: isDark ? "#fff" : "#000",
      backgroundColor: "#EDF3EE",
      borderRadius: 15,
      marginBottom: 15,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
    },
    halfInput: {
      width: "48%",
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
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
    checkboxLabel: {
      flex: 1,
      fontSize: 14,
      color: "#ffff",
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
