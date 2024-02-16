import { Parking } from '@entities/Parking.entity';

export class PaginatedParkingDTO {
  total: number;

  data: Parking[];
}
