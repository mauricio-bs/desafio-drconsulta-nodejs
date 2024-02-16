import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Vehicle } from '@entities/Vehicle.entity';

import { IVehicleRepository } from '../IVehicleRepository';

export class VehicleRepository implements IVehicleRepository {
  constructor(
    @InjectRepository(Vehicle) private repository: Repository<Vehicle>,
  ) {}

  async findOneById(id: string): Promise<Vehicle> {
    return await this.repository.findOneBy({ id });
  }

  async exists(id: string): Promise<boolean> {
    return await this.repository.existsBy({ id });
  }
}
