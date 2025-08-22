import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Image, Alert, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCedula } from '@/context/CedulaContext';
import useColorScheme from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { VolverButton } from '@/components/ui/BackButton';
import TeamSelector from '@/components/TeamSelector';

export default function RegistrarTarjeta() {
  const router = useRouter();
  const {
    cedulaData,
    setCedulaData,
    jugadoresLocal,
    jugadoresVisitante,
    cronometro,
  } = useCedula();

  const colorScheme = useColorScheme();
  const [equipo, setEquipo] = useState<'A' | 'B'>("A");
  const [jugador, setJugador] = useState('');
  const [color, setColor] = useState<'T-A' | 'T-R' | null>(null);
  const [observacion, setObservacion] = useState('');
  const [tarjetasTemporales, setTarjetasTemporales] = useState<any[]>([]);

  const formatTiempo = (milis: number) => {
    const h = Math.floor(milis / 3600000).toString().padStart(2, '0');
    const m = Math.floor((milis % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((milis % 60000) / 1000).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleRegistrar = () => {
    const tiempoActual = formatTiempo(cronometro);

    if (!equipo || !jugador || !color || !observacion.trim()) {
      Alert.alert('Faltan campos', 'Completa todos los campos para registrar la tarjeta.');
      return;
    }

    const nombreEquipo =
      equipo === 'A' ? cedulaData.equipoLocal?.nombre : cedulaData.equipoVisitante?.nombre;

    const nuevaTarjeta = {
      equipo: nombreEquipo,
      jugador,
      tipo: color,
      minuto: tiempoActual,
      observacion,
    };

    setTarjetasTemporales((prev) => [...prev, nuevaTarjeta]);
    setJugador('');
    setColor(null);
    setObservacion('');
  };

  const handleCancelarTarjeta = (index: number) => {
    setTarjetasTemporales((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGuardarTarjetas = () => {
    setCedulaData((prev) => ({
      ...prev,
      tarjetas: [...prev.tarjetas, ...tarjetasTemporales],
    }));
    setTarjetasTemporales([]);
    router.back();
  };

  const jugadores = equipo === 'A' ? jugadoresLocal : equipo === 'B' ? jugadoresVisitante : [];

  return (
    <KeyboardAvoidingView 
      behavior="padding" 
      style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: Colors[colorScheme].background }
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
          Registrar Tarjeta
        </Text>

        <TeamSelector
          equipo={equipo}
          setEquipo={setEquipo}
          equipoLocalNombre={cedulaData.equipoLocal?.nombre}
          equipoVisitanteNombre={cedulaData.equipoVisitante?.nombre}
        />

        <TouchableOpacity style={[
          styles.select,
          { backgroundColor: Colors[colorScheme].inputBackground }
        ]}>
          <Text style={[
            { color: Colors[colorScheme].text }
          ]}>
            {jugador || 'Seleccionar jugador'}
          </Text>
        </TouchableOpacity>

        {jugadores.map((j) => (
          <TouchableOpacity 
            key={j.id} 
            style={[
              styles.playerOption,
              { 
                backgroundColor: jugador === j.nombre 
                  ? Colors[colorScheme].buttonSelected 
                  : 'transparent',
                borderColor: Colors[colorScheme].border,
              }
            ]} 
            onPress={() => setJugador(j.nombre)}
          >
            <Text style={[
              { color: Colors[colorScheme].text }
            ]}>
              {j.nombre}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={styles.colorRow}>
          <TouchableOpacity onPress={() => setColor('T-A')} style={styles.colorOption}>
            <View
              style={[
                styles.colorBox,
                {
                  backgroundColor: '#FFD700',
                  borderColor: color === 'T-A' ? '#000' : '#FFD700',
                },
              ]}
            />
            <Text style={styles.colorText}>Amarilla</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setColor('T-R')} style={styles.colorOption}>
            <View
              style={[
                styles.colorBox,
                {
                  backgroundColor: '#FF4C4C',
                  borderColor: color === 'T-R' ? '#000' : '#FF4C4C',
                },
              ]}
            />
            <Text style={styles.colorText}>Roja</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: Colors[colorScheme].inputBackground,
              color: Colors[colorScheme].text,
              borderColor: Colors[colorScheme].border
            }
          ]}
          placeholder="Observación Breve"
          value={observacion}
          onChangeText={setObservacion}
          placeholderTextColor={Colors[colorScheme].textSecondary}
          multiline
        />

        {/* Tarjetas temporales */}
        {tarjetasTemporales.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={[
              { fontWeight: '600', marginBottom: 6 },
              { color: Colors[colorScheme].text }
            ]}>
              Tarjetas pendientes:
            </Text>
            {tarjetasTemporales.map((t, index) => (
              <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ color: Colors[colorScheme].text }}>
                  {t.jugador} ({t.tipo}) - {t.minuto}
                </Text>
                <TouchableOpacity onPress={() => handleCancelarTarjeta(index)}>
                  <Text style={{ color: Colors[colorScheme].error }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity 
          style={[
            styles.submitButton, 
            { backgroundColor: Colors[colorScheme].buttonPrimary }
          ]} 
          onPress={handleRegistrar}
        >
          <Text style={[styles.submitText, {color: Colors[colorScheme].buttonText}]}>Agregar Tarjeta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton, 
            { 
              backgroundColor: Colors[colorScheme].background,
              borderWidth: 1, 
              borderColor: Colors[colorScheme].buttonPrimary,
              marginTop: 10 
            }
          ]}
          onPress={handleGuardarTarjetas}
        >
          <Text style={[
            styles.submitText, 
            { color: Colors[colorScheme].buttonPrimary }
          ]}>
            Guardar tarjetas y continuar
          </Text>
        </TouchableOpacity>

        <VolverButton/>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
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
    marginBottom: 8,
  },
  input: {
    padding: 14,
    borderRadius: 12,
    fontSize: 14,
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  colorOption: {
    alignItems: 'center',
  },
  colorBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 6,
  },
  colorText: {
    fontSize: 14,
    color: '#333',
  },
  timerInput: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 16,
    borderBottomWidth: 1,
    paddingVertical: 6,
    width: 120,
    alignSelf: 'center',
  },
  submitButton: {
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  submitText: {
    fontWeight: '600',
    fontSize: 16,
  },
  playerOption: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
});