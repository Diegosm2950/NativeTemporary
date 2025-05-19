export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  RecoverPasswordScreen: undefined;
  Main: undefined;
  SeleccionarJugadores: undefined;
  ConfirmGenerateQR: { jugadoresSeleccionados: any[] };
  QrResultScreen: { jugadoresSeleccionados: any[] };
  RefereeHome: undefined;
  PlayerHome: undefined;
  MatchPreview: undefined;
};

export type UserType = 'Jugador' | 'Entrenador' | 'Árbitro' | 'Médico';

export interface FormularioPersonalData {
nombre: string;
apellido1: string;
apellido2: string;
fechaNacimiento: Date | null;
sexo: string;
tipo_registro: UserType[];
equipoUniversitario: string;
equipoEstatal: string;
}

export type FormularioCompleto = FormularioPersonalData & {
tel: string;
cel: string;
email: string;
nacionalidad: string;
curp: string;
pasaporte: string;
esExtranjero: boolean;
escolaridad: string;
tipoSangre: string;
alergiasEnfermedadesDesc: string;
direccion: {
  estadoMx: string;
  ciudad: string;
  delegacionMunicipio: string;
  colonia: string;
  cp: string;
  calle: string;
};
contacto_emergencia: {
  ceNombre: string;
  ceApellido1: string;
  ceApellido2: string;
  ceTel: string;
  ceCel: string;
  ceParentesco: string;
};
foto: string;
aceptaciones: {
  responsabilidad: boolean;
  terminos: boolean;
  privacidad: boolean;
};
contrasenia: string;
repetir_contrasenia: string;
club: string;
clubId: string;
};

export interface Player {
id: string;
name: string;
clubId: string;
club: string;
foto?: string;
}