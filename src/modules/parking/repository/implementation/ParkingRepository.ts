import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Parking } from '@entities/Parking.entity';
import { EVehicleType } from '@enum/EVehicleType';
import { CreateParkingDTO } from '@modules/parking/dto/create-parking.dto';
import { FindManyParkingsDTO } from '@modules/parking/dto/find-many-parkings.dto';
import { PaginatedParkingDTO } from '@modules/parking/dto/paginated-parkings.dto';
import { UpdateParkingDTO } from '@modules/parking/dto/update-parking.dto';

import { IParkingRepository } from '../IParkingRepository';

export class ParkingRepository implements IParkingRepository {
  constructor(
    @InjectRepository(Parking)
    private repository: Repository<Parking>,
  ) {}

  async create(data: CreateParkingDTO): Promise<Parking> {
    return this.repository.create(data);
  }

  async update(id: string, data: UpdateParkingDTO): Promise<Parking> {
    return (await this.repository.update({ id }, data)) as unknown as Parking;
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete({ id });
  }

  async findOneById(id: string): Promise<Parking> {
    return await this.repository.findOneBy({ id });
  }

  async findAll(filters: FindManyParkingsDTO): Promise<PaginatedParkingDTO> {
    let query = this.repository
      .createQueryBuilder('parking')
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit);

    if (filters.vehicle_id) {
      query = query.andWhere('parking.vehicle_id = :vehicle_id', {
        vehicle_id: filters.vehicle_id,
      });
    }

    if (filters.company_id) {
      query = query
        .innerJoinAndSelect('parking.vehicle', 'vehicle')
        .innerJoinAndSelect('vehicle.company', 'company')
        .where('company.id = :company_id', { company_id: filters.company_id });
    }

    if (filters.started_at && filters.ended_at) {
      query = query.andWhere(
        'parking.started_at <= :ended_at AND parking.ended_at >= :started_at',
        {
          started_at: filters.started_at,
          ended_at: filters.ended_at,
        },
      );
    }

    const [data, total] = await query.getManyAndCount();

    return { total, data };
  }

  async exists(id: string): Promise<boolean> {
    return await this.repository.existsBy({ id });
  }

  async countParkings(type: EVehicleType): Promise<number> {
    return await this.repository.countBy({ vehicle: { type }, ended_at: null });
  }
}
