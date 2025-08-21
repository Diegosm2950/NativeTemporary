import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, useColorScheme, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { FormularioCompleto } from '@/types/navigation';
import GoBackHomeButton from '@/components/GoBackHomeButton';

type UserType = 'Jugador' | 'Entrenador' | 'Árbitro' | 'Médico';

interface Props {
  onNext: () => void;
  onBack?: () => void;
  formData: Pick<
    FormularioCompleto,
    'nombre' | 'apellido1' | 'apellido2' | 'fechaNacimiento' | 'sexo' | 'tipo_registro' | 'equipoUniversitario' | 'equipoEstatal'
  >;
  updateForm: (data: Partial<FormularioCompleto>) => void;
}

const Step1_PersonalData = ({ onNext, onBack, formData, updateForm }: Props) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const userTypes: UserType[] = ['Jugador', 'Entrenador', 'Árbitro', 'Médico'];
  const styles = getStyles();

  const handleDateChange = (_: any, selectedDate?: Date) => {
    if (Platform.OS !== 'web') setShowDatePicker(false);
    if (selectedDate) updateForm({ fechaNacimiento: selectedDate });
  };

  const toggleUserType = (type: UserType) => {
    const updated = formData.tipo_registro.includes(type)
      ? formData.tipo_registro.filter((t) => t !== type)
      : [...formData.tipo_registro, type];
    updateForm({ tipo_registro: updated });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Crear cuenta</Text>
        <Image source={require('@/assets/images/LogoSnake.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Únete a nuestra comunidad y explora posibilidades infinitas.</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Datos personales</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre*"
            placeholderTextColor="#A1A1A1"
            value={formData.nombre}
            onChangeText={(text) => updateForm({ nombre: text })}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Apellido paterno*"
              placeholderTextColor="#A1A1A1"
              value={formData.apellido1}
              onChangeText={(text) => updateForm({ apellido1: text })}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Apellido materno*"
              placeholderTextColor="#A1A1A1"
              value={formData.apellido2}
              onChangeText={(text) => updateForm({ apellido2: text })}
            />
          </View>

          <TouchableOpacity 
            style={styles.input} 
            onPress={() => Platform.OS !== 'web' && setShowDatePicker(true)}
          >
            {Platform.OS === 'web' ? (
              <input
                type="date"
                value={formData.fechaNacimiento ? new Date(formData.fechaNacimiento).toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  if (!isNaN(date.getTime())) {
                    updateForm({ fechaNacimiento: date });
                  }
                }}
                style={{
                  backgroundColor: '#F6F6F6',
                  border: 'none',
                  width: '100%',
                  fontSize: '16px',
                  color: '#000',
                }}
                placeholder="Fecha de nacimiento*"
              />
            ) : (
              <>
                <Text style={styles.inputText}>
                  {formData.fechaNacimiento ? formData.fechaNacimiento.toLocaleDateString() : 'Fecha de nacimiento*'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#A1A1A1" />
              </>
            )}
          </TouchableOpacity>

          {showDatePicker && Platform.OS !== 'web' && (
            <DateTimePicker
              value={formData.fechaNacimiento || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <View style={styles.input}>
            {Platform.OS === 'web' ? (
              <select
                value={formData.sexo}
                onChange={(e) => updateForm({ sexo: e.target.value })}
                style={{
                  backgroundColor: '#F6F6F6',
                  border: 'none',
                  width: '100%',
                  fontSize: '16px',
                  color: formData.sexo ? '#000' : '#A1A1A1',
                }}
              >
                <option value="" disabled>Sexo*</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
              </select>
            ) : (
              <Picker
                selectedValue={formData.sexo}
                onValueChange={(value: any) => updateForm({ sexo: value })}
                style={styles.picker}
              >
                <Picker.Item label="Sexo*" value="" color="#000" />
                <Picker.Item label="Femenino" value="Femenino" color="#000" />
                <Picker.Item label="Masculino" value="Masculino" color="#000" />
              </Picker>
            )}
          </View>

          <Text style={styles.fieldLabel}>Tipo de registro: *</Text>
          {userTypes.map((type) => (
            <TouchableOpacity 
              key={type} 
              style={styles.checkboxContainer} 
              onPress={() => toggleUserType(type)}
            >
              <View style={[styles.checkbox, formData.tipo_registro.includes(type) && styles.checkedBox]}>
                {formData.tipo_registro.includes(type) && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>{type}</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.input}>
            {Platform.OS === 'web' ? (
              <select
                value={formData.equipoUniversitario || ''}
                onChange={(e) => updateForm({ equipoUniversitario: e.target.value })}
                style={{
                  backgroundColor: '#F6F6F6',
                  border: 'none',
                  width: '100%',
                  fontSize: '16px',
                  color: formData.equipoUniversitario ? '#000' : '#A1A1A1',
                }}
              >
                <option value="">Equipo Universitario (Opcional)</option>
                <option value="equipo1">Equipo 1</option>
                <option value="equipo2">Equipo 2</option>
              </select>
            ) : (
              <Picker
                selectedValue={formData.equipoUniversitario}
                onValueChange={(value: any) => updateForm({ equipoUniversitario: value })}
                style={styles.picker}
              >
                <Picker.Item label="Equipo Universitario (Opcional)" value="" color="#000" />
                <Picker.Item label="Equipo 1" value="equipo1" color="#000" />
                <Picker.Item label="Equipo 2" value="equipo2" color="#000" />
              </Picker>
            )}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Equipo Estatal (Opcional)"
            placeholderTextColor="#A1A1A1"
            value={formData.equipoEstatal}
            onChangeText={(text) => updateForm({ equipoEstatal: text })}
          />

          <TouchableOpacity style={styles.submitButton} onPress={onNext}>
            <Text style={styles.submitButtonText}>Siguiente</Text>
          </TouchableOpacity>

          <Text style={styles.terms}>
            Al crear una cuenta, aceptas nuestros Términos y Condiciones
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const getStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 30,
      backgroundColor: '#fff',
    },
    header: {
      alignItems: 'center',
      padding: 20,
      paddingTop: 60,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 20,
    },
    logo: {
      width: 150,
      height: 100,
      marginBottom: 20,
    },
    title: {
      fontSize: 25,
      textAlign: 'center',
      fontWeight: '600',
      marginBottom: 30,
      paddingHorizontal: 20,
    },
    formContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 23,
      fontWeight: '600',
      marginBottom: 20,
    },
    inputContainer: {
      width: '100%',
    },
    input: {
      backgroundColor: '#F6F6F6',
      borderRadius: 8,
      padding: 16,
      marginBottom: 15,
      fontSize: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    inputText: {
      fontSize: 16,
      color: '#A1A1A1',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    halfInput: {
      width: '48%',
    },
    picker: {
      margin: -16,
      width: '100%',
    },
    fieldLabel: {
      fontSize: 16,
      marginBottom: 15,
      fontWeight: '500',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderWidth: 2,
      borderColor: '#28A745',
      borderRadius: 4,
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkedBox: {
      backgroundColor: '#28A745',
    },
    checkboxLabel: {
      fontSize: 16,
    },
    submitButton: {
      backgroundColor: '#28A745',
      borderRadius: 25,
      padding: 16,
      alignItems: 'center',
      marginTop: 30,
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    terms: {
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 40,
      color: '#A1A1A1',
      fontSize: 14,
    },
  });

export default Step1_PersonalData;
