import { User } from '@/types/user';

export const mockUser: User = {
  id: '15205',
  name: 'Diego Suarez',
  email: 'diegosuarez@lolasux.com',
  profileImage: '@/assets/images/fotomia',
  team: {
    name: 'Rugby',
    id: 'team-1'
  },
  address: {
    state: 'jalisco',
    municipality: 'guadalajara',
    city: 'guadalajara',
    neighborhood: 'Chapalita',
    number: '333333333',
    postalCode: '450333'
  },
  emergencyContact: {
    name: 'Diego 123',
    mobile: '3333333333',
    phone: '3333333333',
    relationship: 'parent'
  }
};