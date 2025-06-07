import React, { useState } from 'react';
import { View } from 'react-native';

import { FormularioCompleto } from '../../types/navigation';
import RegisterStepper from './RegisterStepper';
import Step1_PersonalData from './steps/Step1_PersonalData';
import Step2_Photo from './steps/Step2_Photo';
import Step3_AdditionalData from './steps/Step3_AdditionalData';
import Step4_AddressData from './steps/Step4_Address';
import Step5_Emergency from './steps/Step5_Emergency';
import Step6_Terms from './steps/Step6_Terms';

const steps = [
  Step1_PersonalData,
  Step2_Photo,
  Step3_AdditionalData,
  Step4_AddressData,
  Step5_Emergency,
];

// Estado inicial global del formulario
const INITIAL_FORM: FormularioCompleto = {
  tipo_registro: [],
  nombre: '',
  apellido1: '',
  apellido2: '',
  fechaNacimiento: null as Date | null,
  sexo: '',
  tel: '',
  cel: '',
  email: '',
  nacionalidad: '',
  curp: '',
  pasaporte: '',
  esExtranjero: false,
  escolaridad: '',
  tipoSangre: '',
  alergiasEnfermedadesDesc: '',
  direccion: {
    estadoMx: '',
    ciudad: '',
    delegacionMunicipio: '',
    colonia: '',
    cp: '',
    calle: '',
  },
  contacto_emergencia: {
    ceNombre: '',
    ceApellido1: '',
    ceApellido2: '',
    ceTel: '',
    ceCel: '',
    ceParentesco: '',
  },
  foto: '',
  aceptaciones: {
    responsabilidad: true,
    terminos: true,
    privacidad: true,
  },
  contrasenia: '',
  repetir_contrasenia: '',
  club: '',
  equipoUniversitario: '',
  equipoEstatal: '',
  clubId: '',
};

const RegisterContainer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const next = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const back = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const updateForm = (data: Partial<FormularioCompleto>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setCurrentStep(0);
  };

  const isLastStep = currentStep === steps.length;
  const CurrentStepComponent = steps[currentStep];

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <RegisterStepper step={currentStep} totalSteps={steps.length + 1} />

      {isLastStep ? (
        <Step6_Terms
          formData={formData}
          onBack={back}
          resetForm={resetForm}
          updateForm={updateForm}
        />
      ) : (
        <CurrentStepComponent
          onNext={next}
          onBack={back}
          formData={formData}
          updateForm={updateForm}
        />
      )}
    </View>
  );
};

export default RegisterContainer;
