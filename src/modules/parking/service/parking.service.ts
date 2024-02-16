import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { isBefore } from 'date-fns';

import { Parking } from '@entities/Parking.entity';
import { EVehicleType } from '@enum/EVehicleType';

import { CreateParkingDTO } from '../dto/create-parking.dto';
import { FindManyParkingsDTO } from '../dto/find-many-parkings.dto';
import { PaginatedParkingDTO } from '../dto/paginated-parkings.dto';
import { UpdateParkingDTO } from '../dto/update-parking.dto';
import { ICompanyRepository } from '../repository/ICompanyRepository';
import { IParkingRepository } from '../repository/IParkingRepository';
import { IVehicleRepository } from '../repository/IVehicleRepository';
import { IParkingService } from './Iparking.service';

export class ParkingService implements IParkingService {
  constructor(
    private parkingRepository: IParkingRepository,
    private companyRepository: ICompanyRepository,
    private vehicleRepository: IVehicleRepository,
  ) {}

  async create(data: CreateParkingDTO): Promise<Parking> {
    const vehicle = await this.vehicleRepository.findOneById(data.vehicle_id);
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    const company = await this.companyRepository.findOneById(
      vehicle.company.id,
    );
    if (!company) throw new NotFoundException('Company not found');

    if (vehicle.type === EVehicleType.car) {
      const car_parkings = await this.parkingRepository.countParkings(
        EVehicleType.car,
      );

      if (company.car_parking_spaces >= car_parkings)
        throw new ConflictException('All company car spaces are occupied');
    }

    if (vehicle.type === EVehicleType.motorcycle) {
      const motorcycle_parkings = await this.parkingRepository.countParkings(
        EVehicleType.motorcycle,
      );

      if (company.motorcycle_parking_spaces >= motorcycle_parkings)
        throw new ConflictException(
          'All company motorcycle spaces are occupied',
        );
    }

    return this.parkingRepository.create(data);
  }

  async update(id: string, data: UpdateParkingDTO): Promise<Parking> {
    if (!(await this.parkingRepository.exists(id)))
      throw new NotFoundException('Parking not found');

    if (!(await this.vehicleRepository.exists(data.vehicle_id)))
      throw new NotFoundException('Vehicle not found');

    return await this.parkingRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    if (!(await this.parkingRepository.exists(id)))
      throw new NotFoundException('Parking not found');

    await this.parkingRepository.softDelete(id);
  }

  async findOneById(id: string): Promise<Parking> {
    const parking = await this.parkingRepository.findOneById(id);
    if (!parking) throw new NotFoundException('Parking not found');

    return parking;
  }

  async findAll(filters: FindManyParkingsDTO): Promise<PaginatedParkingDTO> {
    if (
      (filters.started_at && !filters.ended_at) ||
      (!filters.started_at && filters.ended_at)
    ) {
      throw new BadRequestException(
        'Must have started and ended date to filter data',
      );
    }

    if (isBefore(filters.started_at, filters.ended_at))
      throw new BadRequestException('start date can not be after end date');

    return await this.parkingRepository.findAll(filters);
  }
}
