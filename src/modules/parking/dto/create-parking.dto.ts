import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observations?: string;

  @ApiProperty()
  @IsDateString()
  started_at: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  ended_at?: Date;

  @ApiProperty()
  @IsUUID('4')
  vehicle_id: string;
}
