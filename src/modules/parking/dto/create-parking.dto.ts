import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

import { Parking } from '@entities/Parking.entity';

export class CreateParkingDTO
  implements
    Omit<
      Parking,
      | 'id'
      | 'created_at'
      | 'updated_at'
      | 'deleted_at'
      | 'vehicle'
      | 'hasId'
      | 'save'
      | 'remove'
      | 'reload'
      | 'recover'
      | 'softRemove'
    >
{
  @IsOptional()
  @IsString()
  observations?: string;

  @IsDateString()
  started_at: Date;

  @IsOptional()
  @IsDateString()
  ended_at?: Date;

  @IsUUID('4')
  vehicle_id: string;
}
