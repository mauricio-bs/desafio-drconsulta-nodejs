import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsString()
  brand: string;

  @ApiProperty()
  @IsString()
  color: string;

  @ApiProperty({ enum: EVehicleType })
  @IsEnum(EVehicleType)
  type: EVehicleType;

  @ApiProperty()
  @IsString()
  licence_plate: string;

  @ApiProperty()
  @IsUUID('4')
  company_id: string;
}
