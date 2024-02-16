import { v4 } from 'uuid';

import { Vehicle } from '@entities/Vehicle.entity';
import { EVehicleType } from '@enum/EVehicleType';
import { FindManyVehiclesDTO } from '@modules/vehicle/dto/find-many-vehicles.dto';
import { PaginatedVehicles } from '@modules/vehicle/dto/paginated-vehicles.dto';

export const vehiclesMock: Omit<
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
    brand: 'chevrolet',
    color: 'silver',
    licence_plate: 'SSS1X88',
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

export function findAllMocked(filters: FindManyVehiclesDTO): PaginatedVehicles {
  const vehicles = vehiclesMock.filter((vehicle) => {
    const is_valid: boolean[] = [];

    if (filters.id) is_valid.push(filters.id.includes(vehicle.id));
    if (filters.brand) is_valid.push(vehicle.brand.includes(filters.brand));
    if (filters.type) is_valid.push(vehicle.type === filters.type);
    if (filters.license_plate)
      is_valid.push(vehicle.licence_plate.includes(filters.license_plate));

    return !is_valid.includes(false);
  });

  const paginated_data = vehicles.splice(
    (filters.page - 1) * filters.limit,
    filters.limit * filters.page,
  ) as Vehicle[];

  return { total: vehicles.length, data: paginated_data };
}
