import { Vehicle } from '@entities/Vehicle.entity';

export abstract class IVehicleRepository {
  abstract findOneById(id: string): Promise<Vehicle>;
  abstract exists(id: string): Promise<boolean>;
}
