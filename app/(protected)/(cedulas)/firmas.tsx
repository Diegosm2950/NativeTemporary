import React, { useState, memo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Image, Alert, Switch, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCedula } from '@/context/CedulaContext';
import CancelButton from '@/components/cancelButton';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';

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
    // ... (keep your existing handleSubmit implementation)
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
        <Image 
          source={require('@/assets/images/FMRUU.png')} 
          style={styles.logo} 
          resizeMode="contain" 
        />
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