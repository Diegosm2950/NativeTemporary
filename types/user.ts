export interface Address {
  state: string;
  municipality: string;
  city: string;
  neighborhood: string;
  number: string;
  postalCode: string;
}

export interface EmergencyContact {
  name: string;
  mobile: string;
  phone: string;
  relationship: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  team: {
    name: string;
    id: string;
  };
  address: Address;
  emergencyContact: EmergencyContact;
}