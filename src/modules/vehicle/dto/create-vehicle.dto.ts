import { IsEnum, IsString, IsUUID } from 'class-validator';

import { Vehicle } from '@entities/Vehicle.entity';
import { EVehicleType } from '@enum/EVehicleType';

export class CreateVehicleDTO
  implements
    Omit<
      Vehicle,
      | 'id'
      | 'created_at'
      | 'updated_at'
      | 'deleted_at'
      | 'parkings'
      | 'company'
      | 'hasId'
      | 'save'
      | 'remove'
      | 'softRemove'
      | 'recover'
      | 'reload'
    >
{
  @IsString()
  brand: string;

  @IsString()
  color: string;

  @IsEnum(EVehicleType)
  type: EVehicleType;

  @IsString()
  licence_plate: string;

  @IsUUID('4')
  company_id: string;
}
