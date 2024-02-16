import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { Vehicle } from '@entities/Vehicle.entity';
import { EVehicleType } from '@enum/EVehicleType';

export class UpdateVehicleDTO
  implements
    Partial<
      Omit<
        Vehicle,
        | 'id'
        | 'created_at'
        | 'updated_at'
        | 'deleted_at'
        | 'parkings'
        | 'hasId'
        | 'save'
        | 'remove'
        | 'softRemove'
        | 'recover'
        | 'reload'
      >
    >
{
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ enum: EVehicleType })
  @IsOptional()
  @IsEnum(EVehicleType)
  type?: EVehicleType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  licence_plate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  company_id?: string;
}
