import { Vehicle } from '@entities/Vehicle.entity';

import { CreateVehicleDTO } from '../dto/create-vehicle.dto';
import { FindManyVehiclesDTO } from '../dto/find-many-vehicles.dto';
import { PaginatedVehicles } from '../dto/paginated-vehicles.dto';
import { UpdateVehicleDTO } from '../dto/update-vehicle.dto';

export abstract class IVehicleRepository {
  abstract create(data: CreateVehicleDTO): Promise<Vehicle>;
  abstract update(id: string, data: UpdateVehicleDTO): Promise<Vehicle>;
  abstract softDelete(id: string): Promise<void>;
  abstract findOneById(id: string): Promise<Vehicle>;
  abstract findAll(filters: FindManyVehiclesDTO): Promise<PaginatedVehicles>;
  abstract exists(id: string): Promise<boolean>;
}
