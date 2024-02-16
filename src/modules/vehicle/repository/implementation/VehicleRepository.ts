import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Vehicle } from '@entities/Vehicle.entity';
import { CreateVehicleDTO } from '@modules/vehicle/dto/create-vehicle.dto';
import { FindManyVehiclesDTO } from '@modules/vehicle/dto/find-many-vehicles.dto';
import { PaginatedVehicles } from '@modules/vehicle/dto/paginated-vehicles.dto';
import { UpdateVehicleDTO } from '@modules/vehicle/dto/update-vehicle.dto';

import { IVehicleRepository } from '../IVehicleRepository';

export class VehicleRepository implements IVehicleRepository {
  constructor(
    @InjectRepository(Vehicle)
    private repository: Repository<Vehicle>,
  ) {}

  async create(data: CreateVehicleDTO): Promise<Vehicle> {
    return this.repository.create(data);
  }

  async update(id: string, data: UpdateVehicleDTO): Promise<Vehicle> {
    return (await this.repository.update(id, data)) as unknown as Vehicle;
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete({ id });
  }

  async findOneById(id: string): Promise<Vehicle> {
    return await this.repository.findOneBy({ id });
  }

  async findAll(filters: FindManyVehiclesDTO): Promise<PaginatedVehicles> {
    let query = this.repository
      .createQueryBuilder('vehicle')
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit);

    if (filters.id)
      query = query.andWhere('vehicle.id IN (:...ids', { ids: filters.id });

    if (filters.brand) {
      query = query.andWhere('vehicle.brand = :brand', {
        brand: filters.brand,
      });
    }

    if (filters.type) {
      query = query.andWhere('vehicle.type ILIKE :type', {
        type: `%${filters.type}%`,
      });
    }

    if (filters.license_plate) {
      query = query.andWhere('vehicle.licence_plate ILIKE :license_plate', {
        license_plate: `%${filters.license_plate}%`,
      });
    }

    const [data, total] = await query.getManyAndCount();

    return { total, data };
  }

  async exists(id: string): Promise<boolean> {
    return await this.repository.existsBy({ id });
  }
}
