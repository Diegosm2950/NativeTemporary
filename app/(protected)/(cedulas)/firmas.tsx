import React, { useState, memo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Image, Alert, Switch, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCedula } from '@/context/CedulaContext';
import CancelButton from '@/components/cancelButton';

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
}) => (
  <View style={styles.section}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.multilineInput]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#666"
      multiline={multiline}
      autoCorrect={false}
      autoCapitalize="none"
      textAlignVertical={multiline ? 'top' : 'center'}
      keyboardType={keyboardType}
      returnKeyType="done"
      blurOnSubmit
    />
  </View>
));

export default function RecoleccionFirmas() {
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

    if (
      !capitanLocalNombre || !capitanLocalFirma ||
      !capitanVisitaNombre || !capitanVisitaFirma ||
      !repLocalNombre || !repLocalFirma || !repLocalTel ||
      !repVisitaNombre || !repVisitaFirma || !repVisitaTel
    ) {
      Alert.alert('Faltan datos', 'Completa todos los campos requeridos.');
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
      marcador: [...cedulaData.marcador], // ⚠️ Se manda el array real
      registroPuntos: marcadorTransformado, // 🟢 Se manda con nombres completos
      firmas: datosFirmas,
      esFinal,
    };

    console.log("📦 CedulaData actual:", cedulaData);
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
        Alert.alert('Error', 'No se pudo enviar la cédula.');
        return;
      }

      Alert.alert('✅ Éxito', 'Cédula enviada correctamente');
      router.replace('/(protected)/(cedulas)/resumen-final');
    } catch (error) {
      console.error('❌ Error al enviar la cédula:', error);
      Alert.alert('Error', 'No se pudo enviar la cédula.');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <StatusBar style="auto" />
        <Image source={require('@/assets/images/FMRUU.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Recolección de firmas</Text>

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
          <Text style={styles.label}>¿Este partido es una final?</Text>
          <Switch
            value={form.esFinal}
            onValueChange={v => updateField('esFinal', v)}
            trackColor={{ false: '#ccc', true: '#1B9D3B' }}
            thumbColor="#fff"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Confirmar y continuar</Text>
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
    backgroundColor: '#fff',
  },
  logo: {
    width: 80,
    height: 40,
    marginBottom: 10,
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
    backgroundColor: '#E6EFE6',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#000',
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
    backgroundColor: '#1B9D3B',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 16,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
