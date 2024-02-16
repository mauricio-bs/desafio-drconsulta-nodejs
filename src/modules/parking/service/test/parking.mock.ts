import { v4 } from 'uuid';

import { Address } from '@entities/Address.entity';
import { Company } from '@entities/Company.entity';
import { Parking } from '@entities/Parking.entity';
import { Vehicle } from '@entities/Vehicle.entity';
import { EVehicleType } from '@enum/EVehicleType';

export const parkingsMock: Omit<
  Parking,
  'hasId' | 'recover' | 'reload' | 'remove' | 'save' | 'softRemove'
>[] = [
  {
    id: v4(),
    vehicle: { id: v4() } as Vehicle,
    started_at: new Date('2024-01-10'),
    created_at: new Date('2024-01-10'),
    updated_at: new Date('2024-01-10'),
  },
  {
    id: v4(),
    vehicle: { id: v4() } as Vehicle,
    started_at: new Date('2024-01-15'),
    created_at: new Date('2024-01-15'),
    updated_at: new Date('2024-01-15'),
  },
  {
    id: v4(),
    vehicle: { id: v4() } as Vehicle,
    started_at: new Date('2024-01-20'),
    created_at: new Date('2024-01-20'),
    updated_at: new Date('2024-01-20'),
  },
];

export const vehiclesParkingMock: Omit<
  Vehicle,
  | 'company'
  | 'parkings'
  | 'hasId'
  | 'save'
  | 'remove'
  | 'softRemove'
  | 'recover'
  | 'reload'
>[] = [
  {
    id: v4(),
    brand: 'mitsubishi',
    color: 'white',
    licence_plate: 'FFF1A99',
    type: EVehicleType.car,
    created_at: new Date('2024-01-10'),
    updated_at: new Date('2024-01-10'),
  },
  {
    id: v4(),
    brand: 'honda',
    color: 'black',
    licence_plate: 'DDD2C55',
    type: EVehicleType.motorcycle,
    created_at: new Date('2024-01-10'),
    updated_at: new Date('2024-01-10'),
  },
];

export const companyParkingMock: Array<
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
