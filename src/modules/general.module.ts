import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { ParkingModule } from './parking/parking.module';
import { UserModule } from './user/user.module';
import { VehicleModule } from './vehicle/vehicle.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CompanyModule,
    VehicleModule,
    ParkingModule,
  ],
})
export class GeneralModule {}
