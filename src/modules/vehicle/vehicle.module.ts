import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Company } from '@entities/Company.entity';
import { Vehicle } from '@entities/Vehicle.entity';

import { VehicleController } from './controller/vehicle.controller';
import { VehicleRepository } from './repository/implementation/VehicleRepository';
import { IVehicleRepository } from './repository/IVehicleRepository';
import { IVehicleService } from './service/Ivehicle.service';
import { VehicleService } from './service/vehicle.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Company])],
  controllers: [VehicleController],
  providers: [
    { provide: IVehicleService, useClass: VehicleService },
    { provide: IVehicleRepository, useClass: VehicleRepository },
  ],
})
export class VehicleModule {}
