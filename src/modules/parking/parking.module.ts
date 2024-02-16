import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Address } from '@entities/Address.entity';
import { Company } from '@entities/Company.entity';
import { Parking } from '@entities/Parking.entity';
import { Vehicle } from '@entities/Vehicle.entity';

import { ParkingController } from './controller/parking.controller';
import { ICompanyRepository } from './repository/ICompanyRepository';
import { CompanyRepository } from './repository/implementation/CompanyRepository';
import { ParkingRepository } from './repository/implementation/ParkingRepository';
import { VehicleRepository } from './repository/implementation/VehicleRepository';
import { IParkingRepository } from './repository/IParkingRepository';
import { IVehicleRepository } from './repository/IVehicleRepository';
import { IParkingService } from './service/Iparking.service';
import { ParkingService } from './service/parking.service';

@Module({
  imports: [TypeOrmModule.forFeature([Parking, Company, Vehicle, Address])],
  controllers: [ParkingController],
  providers: [
    { provide: IParkingService, useClass: ParkingService },
    { provide: IParkingRepository, useClass: ParkingRepository },
    { provide: ICompanyRepository, useClass: CompanyRepository },
    { provide: IVehicleRepository, useClass: VehicleRepository },
  ],
})
export class ParkingModule {}
