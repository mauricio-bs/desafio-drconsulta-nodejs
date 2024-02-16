import { NotFoundException } from '@nestjs/common';

import { Vehicle } from '@entities/Vehicle.entity';

import { CreateVehicleDTO } from '../dto/create-vehicle.dto';
import { FindManyVehiclesDTO } from '../dto/find-many-vehicles.dto';
import { PaginatedVehicles } from '../dto/paginated-vehicles.dto';
import { UpdateVehicleDTO } from '../dto/update-vehicle.dto';
import { ICompanyRepository } from '../repository/ICompanyRepository';
import { IVehicleRepository } from '../repository/IVehicleRepository';
import { IVehicleService } from './Ivehicle.service';

export class VehicleService implements IVehicleService {
  constructor(
    private vehicleRepository: IVehicleRepository,
    private companyRepository: ICompanyRepository,
  ) {}

  async create(data: CreateVehicleDTO): Promise<Vehicle> {
    if (!(await this.companyRepository.exists(data.company_id)))
      throw new NotFoundException('Company not found');

    return this.vehicleRepository.create(data);
  }

  async update(id: string, data: UpdateVehicleDTO): Promise<Vehicle> {
    if (!(await this.vehicleRepository.exists(id)))
      throw new NotFoundException('Vehicle not found');

    if (
      data.company_id &&
      !(await this.companyRepository.exists(data.company_id))
    )
      throw new NotFoundException('Company not found');

    return (await this.vehicleRepository.update(
      id,
      data,
    )) as unknown as Vehicle;
  }

  async delete(id: string): Promise<void> {
    if (!(await this.vehicleRepository.exists(id)))
      throw new NotFoundException('Vehicle not found');

    await this.vehicleRepository.softDelete(id);
  }

  async findOneById(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOneById(id);
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    return vehicle;
  }

  async findAll(filters: FindManyVehiclesDTO): Promise<PaginatedVehicles> {
    return await this.vehicleRepository.findAll(filters);
  }
}
