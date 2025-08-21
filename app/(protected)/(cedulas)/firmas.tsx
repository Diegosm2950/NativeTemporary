import React, { useState, memo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Image, Switch, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCedula } from '@/context/CedulaContext';
import CancelButton from '@/components/cancelButton';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Toast from 'react-native-toast-message';

const Input = memo(({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}) => {
  const colorScheme = useColorScheme();
  
  return (
    <View style={styles.section}>
      <Text style={[styles.label, { color: Colors[colorScheme].text }]}>{label}</Text>
      <TextInput
        style={[
          styles.input, 
          multiline && styles.multilineInput,
          { 
            backgroundColor: Colors[colorScheme].inputBackground,
            color: Colors[colorScheme].text,
          }
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors[colorScheme].textSecondary}
        multiline={multiline}
        autoCorrect={false}
        autoCapitalize="none"
        textAlignVertical={multiline ? 'top' : 'center'}
        keyboardType={keyboardType}
        returnKeyType="done"
        blurOnSubmit
      />
    </View>
  );
});

export default function RecoleccionFirmas() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { cedulaData } = useCedula();

  const [form, setForm] = useState({
    capitanLocalNombre: '',
    capitanLocalFirma: '',
    capitanVisitaNombre: '',
    capitanVisitaFirma: '',
    repLocalNombre: '',
    repLocalFirma: '',
    repLocalTel: '',
    repVisitaNombre: '',
    repVisitaFirma: '',
    repVisitaTel: '',
    esFinal: false,
  });

  const updateField = (key: keyof typeof form, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const {
      capitanLocalNombre, capitanLocalFirma,
      capitanVisitaNombre, capitanVisitaFirma,
      repLocalNombre, repLocalFirma, repLocalTel,
      repVisitaNombre, repVisitaFirma, repVisitaTel,
      esFinal
    } = form;

    const missingFields = [];
  
    if (!capitanLocalNombre) missingFields.push("Nombre del capitán local");
    if (!capitanLocalFirma) missingFields.push("Firma del capitán local");
    if (!capitanVisitaNombre) missingFields.push("Nombre del capitán visitante");
    if (!capitanVisitaFirma) missingFields.push("Firma del capitán visitante");
    if (!repLocalNombre) missingFields.push("Nombre del representante local");
    if (!repLocalFirma) missingFields.push("Firma del representante local");
    if (!repLocalTel) missingFields.push("Teléfono del representante local");
    if (!repVisitaNombre) missingFields.push("Nombre del representante visitante");
    if (!repVisitaFirma) missingFields.push("Firma del representante visitante");
    if (!repVisitaTel) missingFields.push("Teléfono del representante visitante");
  
    if (missingFields.length > 0) {
      Toast.show({
        type: 'error',
        text1: 'Error al crear la cédula',
        text2: `Faltan datos: ${missingFields.join(', ')}`,
      });
      return;
    }

    const datosFirmas = {
      capitanLocal: { nombre: capitanLocalNombre, firma: capitanLocalFirma },
      capitanVisita: { nombre: capitanVisitaNombre, firma: capitanVisitaFirma },
      representanteLocal: { nombre: repLocalNombre, firma: repLocalFirma, telefono: repLocalTel },
      representanteVisita: { nombre: repVisitaNombre, firma: repVisitaFirma, telefono: repVisitaTel }
    };

    console.log('🟨 [Debug] marcador crudo:', cedulaData.marcador);

    const marcadorTransformado = (cedulaData.marcador || []).map(p => ({
      ...p,
      equipo:
        p.equipo === 'A'
          ? cedulaData.equipoLocal?.nombre
          : p.equipo === 'B'
          ? cedulaData.equipoVisitante?.nombre
          : p.equipo,
    }));

    console.log('🟩 [Debug] marcadorTransformado:', marcadorTransformado);

    const payload = {
      ...cedulaData,
      marcador: [...cedulaData.marcador],
      registroPuntos: marcadorTransformado, 
      firmas: datosFirmas,
      esFinal,
    };

    console.log("📦 CedulaData actual:", cedulaData);
    console.log("📦 PartidoId:", cedulaData.partidoId);
    console.log("📦 Payload a enviar (completo):", payload);

    try {
      const res = await fetch('https://fmru-next-js.vercel.app/api/app-native-api/cedulas/crear-cedula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('📥 Respuesta del servidor:', data);

      if (!res.ok) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudo enviar la cédula.',
        });
        return;
      }

      // Intentar enviar el reporte por correo usando el endpoint específico
      try {
        if (cedulaData.partidoId && cedulaData.partidoId > 0) {
          console.log('📧 Enviando cédula por correo para partidoId:', cedulaData.partidoId);
          
          const emailRes = await fetch('https://fmru-next-js.vercel.app/api/app-native-api/cedulas/enviar-cedulas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              partidoId: cedulaData.partidoId
            }),
          });

          const emailData = await emailRes.json();
          console.log('📧 Respuesta envío correo:', emailData);

          if (emailRes.ok) {
            Toast.show({
              type: 'success',
              text1: '✅ Éxito',
              text2: 'Cédula enviada y reporte por correo enviado correctamente',
            });
          } else {
            console.error('❌ Error en envío de correo:', emailData);
            Toast.show({
              type: 'error',
              text1: '⚠️ Parcial',
              text2: `Cédula enviada correctamente, pero no se pudo enviar el reporte por correo: ${emailData.message || 'Error desconocido'}`,
            });
          }
        } else {
          console.warn('⚠️ No se encontró partidoId válido para enviar correo');
          Toast.show({
            type: 'success',
            text1: '✅ Éxito',
            text2: 'Cédula enviada correctamente. No se enviaron correos (partidoId no válido)',
          });
        }
      } catch (emailError) {
        console.error('❌ Error al enviar reporte por correo:', emailError);
        Toast.show({
          type: 'error',
          text1: '⚠️ Parcial',
          text2: 'Cédula enviada correctamente, pero no se pudo enviar el reporte por correo',
        });
      }

      router.replace('/(protected)/(cedulas)/resumen-final');
    } catch (error) {
      console.error('❌ Error al enviar la cédula:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo enviar la cédula.',
      });
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView 
        contentContainerStyle={[
          styles.container, 
          { backgroundColor: Colors[colorScheme].background }
        ]} 
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
          Recolección de firmas
        </Text>

        <Input label="Capitán Local (Nombre)" value={form.capitanLocalNombre} onChangeText={v => updateField('capitanLocalNombre', v)} placeholder="Nombre" />
        <Input label="Capitán Local (Firma)" value={form.capitanLocalFirma} onChangeText={v => updateField('capitanLocalFirma', v)} placeholder="Firma" multiline />

        <Input label="Capitán Visitante (Nombre)" value={form.capitanVisitaNombre} onChangeText={v => updateField('capitanVisitaNombre', v)} placeholder="Nombre" />
        <Input label="Capitán Visitante (Firma)" value={form.capitanVisitaFirma} onChangeText={v => updateField('capitanVisitaFirma', v)} placeholder="Firma" multiline />

        <Input label="Representante Local (Nombre)" value={form.repLocalNombre} onChangeText={v => updateField('repLocalNombre', v)} placeholder="Nombre" />
        <Input label="Representante Local (Firma)" value={form.repLocalFirma} onChangeText={v => updateField('repLocalFirma', v)} placeholder="Firma" multiline />
        <Input label="Representante Local (Teléfono)" value={form.repLocalTel} onChangeText={v => updateField('repLocalTel', v)} placeholder="Teléfono" keyboardType="phone-pad" />

        <Input label="Representante Visitante (Nombre)" value={form.repVisitaNombre} onChangeText={v => updateField('repVisitaNombre', v)} placeholder="Nombre" />
        <Input label="Representante Visitante (Firma)" value={form.repVisitaFirma} onChangeText={v => updateField('repVisitaFirma', v)} placeholder="Firma" multiline />
        <Input label="Representante Visitante (Teléfono)" value={form.repVisitaTel} onChangeText={v => updateField('repVisitaTel', v)} placeholder="Teléfono" keyboardType="phone-pad" />

        <View style={styles.switchRow}>
          <Text style={[styles.label, { color: Colors[colorScheme].text }]}>
            ¿Este partido es una final?
          </Text>
          <Switch
            value={form.esFinal}
            onValueChange={v => updateField('esFinal', v)}
            trackColor={{ 
              false: Colors[colorScheme].border, 
              true: Colors[colorScheme].tint 
            }}
            thumbColor={Colors[colorScheme].cardBackground}
          />
        </View>

        <TouchableOpacity 
          style={[
            styles.submitButton, 
            { backgroundColor: Colors[colorScheme].buttonPrimary }
          ]} 
          onPress={handleSubmit}
        >
          <Text style={[
            styles.submitText, 
            { color: Colors[colorScheme].buttonText }
          ]}>
            Confirmar y continuar
          </Text>
        </TouchableOpacity>
        
        <CancelButton />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 100,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  submitButton: {
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 16,
  },
  submitText: {
    fontWeight: '600',
    fontSize: 16,
  },
});