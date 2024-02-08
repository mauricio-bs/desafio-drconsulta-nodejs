import { v4 } from 'uuid';

import { Address } from '@entities/Address';
import { Company } from '@entities/Company';

export const companyMock: Array<
  Omit<
    Company,
    | 'vehicles'
    | 'hasId'
    | 'save'
    | 'remove'
    | 'reload'
    | 'recover'
    | 'softRemove'
  >
> = [
  {
    id: v4(),
    name: 'Test A',
    car_parking_spaces: 5,
    motorcycle_parking_spaces: 5,
    document: '120431290001',
    phone: '55011999999999',
    created_at: new Date(),
    updated_at: new Date(),
    address: {
      id: v4(),
      country: 'Brazil',
      state: 'Sao Paulo',
      city: 'Sao Paulo',
      address: 'Avenida sao jose',
      number: 150,
      zipcode: '1234512',
      created_at: new Date(),
      updated_at: new Date(),
    } as Omit<Address, 'company'>,
  },
];
