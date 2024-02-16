import { Vehicle } from '@entities/Vehicle.entity';

export class PaginatedVehicles {
  total: number;

  data: Vehicle[];
}
