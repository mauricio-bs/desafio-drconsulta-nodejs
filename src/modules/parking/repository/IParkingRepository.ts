import { Parking } from '@entities/Parking.entity';
import { EVehicleType } from '@enum/EVehicleType';

import { CreateParkingDTO } from '../dto/create-parking.dto';
import { FindManyParkingsDTO } from '../dto/find-many-parkings.dto';
import { PaginatedParkingDTO } from '../dto/paginated-parkings.dto';
import { UpdateParkingDTO } from '../dto/update-parking.dto';

export abstract class IParkingRepository {
  abstract create(data: CreateParkingDTO): Promise<Parking>;
  abstract update(id: string, data: UpdateParkingDTO): Promise<Parking>;
  abstract softDelete(id: string): Promise<void>;
  abstract findOneById(id: string): Promise<Parking>;
  abstract findAll(filters: FindManyParkingsDTO): Promise<PaginatedParkingDTO>;
  abstract exists(id: string): Promise<boolean>;
  abstract countParkings(type: EVehicleType): Promise<number>;
}
