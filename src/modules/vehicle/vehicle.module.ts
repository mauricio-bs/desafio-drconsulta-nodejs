import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Vehicle } from '@entities/Vehicle';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle])],
  controllers: [],
  providers: [],
})
export class VehicleModule {}
