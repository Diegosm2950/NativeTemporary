import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCedula } from '@/context/CedulaContext';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { VolverButton } from '@/components/ui/BackButton';

export default function RegistrarLesion() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { cedulaData, setCedulaData, jugadoresLocal, jugadoresVisitante } = useCedula();

  const [equipo, setEquipo] = useState<'A' | 'B' | null>(null);
  const [jugador, setJugador] = useState('');
  const [parte, setParte] = useState<string | null>(null);
  const [gravedad, setGravedad] = useState<'Leve' | 'Media' | 'Grave'>('Leve');
  const [ambulancia, setAmbulancia] = useState<boolean | null>(null);
  const [observacion, setObservacion] = useState('');

  const partesCuerpo = ['Cabeza', 'Hombro', 'Brazo', 'Pierna'];

  const jugadores = equipo === 'A' ? jugadoresLocal : equipo === 'B' ? jugadoresVisitante : [];
  const nombreEquipo = equipo === 'A'
    ? cedulaData.equipoLocal?.nombre
    : equipo === 'B'
    ? cedulaData.equipoVisitante?.nombre
    : '';

  const handleRegistrarLesion = () => {
    if (!equipo || !jugador || !parte || ambulancia === null) {
      Alert.alert('Faltan campos', 'Completa todos los datos requeridos.');
      return;
    }

    const nuevaLesion = {
      equipo: nombreEquipo,
      jugador,
      area: parte,
      gravedad: gravedad.toLowerCase(),
      ambulancia,
      observacion,
    };

    setCedulaData(prev => ({
      ...prev,
      lesiones: [...prev.lesiones, nuevaLesion],
    }));

    router.replace('/(protected)/(cedulas)/juego' as any);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={[
          styles.container, 
          { 
            backgroundColor: Colors[colorScheme].background,
            paddingBottom: 40 // Add extra padding at the bottom
          }
        ]}
        style={{ flex: 1 }} // Ensure ScrollView fills available space
      >
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Registrar Lesión</Text>

        {/* Selector de equipo */}
        <View style={styles.teamSwitch}>
          <TouchableOpacity
            style={[
              styles.teamButton, 
              { backgroundColor: Colors[colorScheme].buttonSecondary },
              equipo === 'A' && { 
                backgroundColor: Colors[colorScheme].buttonPrimary 
              }
            ]}
            onPress={() => setEquipo('A')}
          >
            <Text style={[
              styles.teamText, 
              { color: Colors[colorScheme].buttonTextSecondary },
              equipo === 'A' && { color: Colors[colorScheme].buttonText }
            ]}>
              {cedulaData.equipoLocal?.nombre || 'Equipo A'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.teamButton, 
              { backgroundColor: Colors[colorScheme].buttonSecondary },
              equipo === 'B' && { 
                backgroundColor: Colors[colorScheme].buttonPrimary 
              }
            ]}
            onPress={() => setEquipo('B')}
          >
            <Text style={[
              styles.teamText, 
              { color: Colors[colorScheme].buttonTextSecondary },
              equipo === 'B' && { color: Colors[colorScheme].buttonText }
            ]}>
              {cedulaData.equipoVisitante?.nombre || 'Equipo B'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selector de jugador */}
        <TouchableOpacity style={[styles.select, { backgroundColor: Colors[colorScheme].inputBackground }]}>
          <Text style={[styles.selectText, { color: jugador ? Colors[colorScheme].text : Colors[colorScheme].textSecondary }]}>
            {jugador || 'Seleccionar jugador lesionado'}
          </Text>
        </TouchableOpacity>

        {jugadores.map(j => (
          <TouchableOpacity
            key={j.id}
            style={[styles.select, { backgroundColor: Colors[colorScheme].inputBackground }]}
            onPress={() => setJugador(j.nombre)}
          >
            <Text style={[styles.selectText, { 
              color: jugador === j.nombre ? Colors[colorScheme].tint : Colors[colorScheme].text 
            }]}>
              {j.nombre}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Parte del cuerpo */}
        <View style={styles.bodyParts}>
          {partesCuerpo.map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.partButton, 
                { backgroundColor: Colors[colorScheme].buttonSecondary },
                parte === p && { 
                  backgroundColor: Colors[colorScheme].buttonPrimary,
                  borderColor: Colors[colorScheme].tint,
                  borderWidth: 1
                }
              ]}
              onPress={() => setParte(p)}
            >
              <Text style={[
                styles.partText, 
                { color: Colors[colorScheme].text },
                parte === p && { color: Colors[colorScheme].buttonText }
              ]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Nivel de gravedad */}
        <View style={styles.gravedadContainer}>
          {['Leve', 'Media', 'Grave'].map((nivel) => (
            <TouchableOpacity
              key={nivel}
              style={[
                styles.gravedadButton,
                gravedad === nivel && { 
                  borderColor: Colors[colorScheme].tint 
                }
              ]}
              onPress={() => setGravedad(nivel as typeof gravedad)}
            >
              <Text style={[
                styles.gravedadText, 
                { color: Colors[colorScheme].text },
                gravedad === nivel && { color: Colors[colorScheme].tint }
              ]}>
                {nivel}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ambulancia */}
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>¿Requiere ambulancia?</Text>
        <TouchableOpacity
          style={[
            styles.optionButton, 
            { backgroundColor: Colors[colorScheme].buttonSecondary },
            ambulancia === true && { 
              backgroundColor: Colors[colorScheme].buttonPrimary 
            }
          ]}
          onPress={() => setAmbulancia(true)}
        >
          <Text style={[
            styles.optionText, 
            { color: Colors[colorScheme].text },
            ambulancia === true && { color: Colors[colorScheme].buttonText }
          ]}>
            Sí
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionButton, 
            { backgroundColor: Colors[colorScheme].buttonSecondary },
            ambulancia === false && { 
              backgroundColor: Colors[colorScheme].cardBackground 
            }
          ]}
          onPress={() => setAmbulancia(false)}
        >
          <Text style={[
            styles.optionText, 
            { color: Colors[colorScheme].text }
          ]}>
            No
          </Text>
        </TouchableOpacity>

        {/* Observación */}
        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>Observación</Text>
        <TextInput
          style={[
            styles.textarea, 
            { 
              backgroundColor: Colors[colorScheme].inputBackground,
              color: Colors[colorScheme].text
            }
          ]}
          placeholder="Nota del árbitro"
          placeholderTextColor={Colors[colorScheme].textSecondary}
          value={observacion}
          onChangeText={setObservacion}
          multiline
        />

        <TouchableOpacity 
          style={[
            styles.submitButton, 
            { backgroundColor: Colors[colorScheme].buttonPrimary }
          ]} 
          onPress={handleRegistrarLesion}
        >
          <Text style={[
            styles.submitText, 
            { color: Colors[colorScheme].buttonText }
          ]}>
            Registrar Lesión
          </Text>
        </TouchableOpacity>

        <VolverButton destination="/(protected)/(cedulas)/juego" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    minHeight: '100%'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  select: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  selectText: {
    fontSize: 16,
  },
  bodyParts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  partButton: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  partText: {
    fontSize: 14,
  },
  gravedadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  gravedadButton: {
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  gravedadText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  optionButton: {
    padding: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  textarea: {
    padding: 14,
    borderRadius: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  submitButton: {
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitText: {
    fontWeight: '600',
    fontSize: 16,
  },
  backButton: {
    padding: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  teamSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  teamButton: {
    flex: 1,
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  teamText: {
    fontWeight: '500',
  },
});