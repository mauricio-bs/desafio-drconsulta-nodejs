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
  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsEnum(EVehicleType)
  type?: EVehicleType;

  @IsOptional()
  @IsString()
  licence_plate?: string;

  @IsOptional()
  @IsUUID('4')
  company_id?: string;
}
