import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, useColorScheme, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
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
  const isDark = useColorScheme() === 'dark';
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [clubs, setClubs] = useState<any[]>([]);
  const [searchClub, setSearchClub] = useState('');
  const [showClubPicker, setShowClubPicker] = useState(false);
  const [clubsToShow, setClubsToShow] = useState(10);
  const userTypes: UserType[] = ['Jugador', 'Entrenador', 'Árbitro', 'Médico'];
  const styles = getStyles(isDark);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const API_BASE_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/api/catalogo-clubs`);
      const data = await response.json();
      console.log('Clubes recibidos:', data);
      setClubs(data || []);
    } catch (error) {
      console.error('Error fetching clubs:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudieron cargar los clubes',
      });
    }
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.nombre.trim()) errors.push('Nombre');
    if (!formData.apellido1.trim()) errors.push('Apellido paterno');
    if (!formData.apellido2.trim()) errors.push('Apellido materno');
    if (!formData.fechaNacimiento) errors.push('Fecha de nacimiento');
    if (!formData.sexo) errors.push('Sexo');
    if (formData.tipo_registro.length === 0) errors.push('Tipo de registro');

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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Crear cuenta</Text>
        <Image source={require('@/assets/images/LogoSnake.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Únete a nuestra comunidad y explora posibilidades infinitas.</Text>
      </View>
      <View style={styles.formContainerCentered}>
        <Text style={styles.sectionTitle}>Datos personales</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
            placeholder="Nombre*"
            placeholderTextColor="#A1A1A1"
            value={formData.nombre}
            onChangeText={(text) => updateForm({ nombre: text })}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput, { color: isDark ? '#fff' : '#000' }]}
              placeholder="Apellido paterno*"
              placeholderTextColor="#A1A1A1"
              value={formData.apellido1}
              onChangeText={(text) => updateForm({ apellido1: text })}
            />
            <TextInput
              style={[styles.input, styles.halfInput, { color: isDark ? '#fff' : '#000' }]}
              placeholder="Apellido materno*"
              placeholderTextColor="#A1A1A1"
              value={formData.apellido2}
              onChangeText={(text) => updateForm({ apellido2: text })}
            />
          </View>

          <TouchableOpacity 
            style={styles.input} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[
              styles.inputText,
              formData.fechaNacimiento && { color: isDark ? '#fff' : '#000' }
            ]}>
              {formData.fechaNacimiento 
                ? formData.fechaNacimiento.toLocaleDateString('es-ES')
                : 'Fecha de nacimiento*'
              }
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#A1A1A1" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={formData.fechaNacimiento || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          <View style={styles.input}>
            <Picker
              selectedValue={formData.sexo}
              onValueChange={(value: any) => updateForm({ sexo: value })}
              style={[styles.picker, { color: isDark ? '#fff' : '#000' }]}
              dropdownIconColor="#A1A1A1"
            >
              <Picker.Item label="Sexo*" value="" color="#A1A1A1" />
              <Picker.Item label="Femenino" value="Femenino" color="#000" />
              <Picker.Item label="Masculino" value="Masculino" color="#000" />
            </Picker>
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

          <TouchableOpacity 
            style={styles.input}
            onPress={() => setShowClubPicker(!showClubPicker)}
          >
            <Text style={[
              styles.inputText,
              formData.equipoUniversitario && { color: isDark ? '#fff' : '#000', fontWeight: '600', fontSize: 16, flexShrink: 1 }
            ]} numberOfLines={1}>
              {formData.equipoUniversitario || 'Seleccionar Club (Opcional)'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#A1A1A1" />
          </TouchableOpacity>

          {showClubPicker && (
            <View style={styles.clubPickerContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar club..."
                value={searchClub}
                onChangeText={setSearchClub}
                placeholderTextColor="#A1A1A1"
              />
              <ScrollView
                style={styles.clubList}
                nestedScrollEnabled
                onScroll={({ nativeEvent }) => {
                  const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                  if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
                    setClubsToShow((prev) => prev + 10);
                  }
                }}
                scrollEventThrottle={16}
              >
                {clubs
                  .filter(club => 
                    club.nombre?.toLowerCase().includes(searchClub.toLowerCase()) ||
                    club.club?.toLowerCase().includes(searchClub.toLowerCase())
                  )
                  .slice(0, clubsToShow)
                  .map((club, index) => (
                    <TouchableOpacity
                      key={club.id || index}
                      style={styles.clubItem}
                      onPress={() => {
                        updateForm({ equipoUniversitario: club.nombre || club.club });
                        setShowClubPicker(false);
                        setSearchClub('');
                        setClubsToShow(10);
                      }}
                    >
                      <Text style={styles.clubText}>{club.nombre || club.club}</Text>
                    </TouchableOpacity>
                  ))
                }
              </ScrollView>
            </View>
          )}

          <TextInput
            style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
            placeholder="Equipo Estatal (Opcional)"
            placeholderTextColor="#A1A1A1"
            value={formData.equipoEstatal}
            onChangeText={(text) => updateForm({ equipoEstatal: text })}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleNext}>
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

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDark ? '#000' : '#fff',
    },
    contentContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
      color: isDark ? '#fff' : '#000',
    },
    logo: {
      width: 120,
      height: 80,
      marginBottom: 20,
    },
    title: {
      fontSize: 22,
      textAlign: 'center',
      fontWeight: '600',
      marginBottom: 30,
      paddingHorizontal: 20,
      color: isDark ? '#fff' : '#000',
    },
    formContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    formContainerCentered: {
      flex: 1,
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 20,
      color: isDark ? '#fff' : '#000',
    },
    inputContainer: {
      width: '100%',
    },
    input: {
      backgroundColor: isDark ? '#1a1a1a' : '#F6F6F6',
      borderRadius: 8,
      padding: 16,
      marginBottom: 15,
      fontSize: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 50,
    },
    inputText: {
      fontSize: 16,
      color: '#A1A1A1',
      flex: 1,
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
      color: isDark ? '#fff' : '#222',
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
      color: isDark ? '#aaa' : '#A1A1A1',
      fontSize: 14,
    },
    clubPickerContainer: {
      backgroundColor: isDark ? '#1a1a1a' : '#F6F6F6',
      borderRadius: 8,
      padding: 10,
      marginBottom: 15,
      maxHeight: 200,
    },
    searchInput: {
      backgroundColor: isDark ? '#333' : '#fff',
      borderRadius: 6,
      padding: 12,
      marginBottom: 10,
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
    },
    clubList: {
      maxHeight: 120,
    },
    clubItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#eee',
    },
    clubText: {
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
    },
  });

export default Step1_PersonalData;
