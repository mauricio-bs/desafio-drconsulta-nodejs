import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  Min,
} from 'class-validator';

import { Company } from '@entities/Company';

export class UpdateCompanyDTO
  implements
    Partial<
      Omit<
        Company,
        | 'id'
        | 'created_at'
        | 'updated_at'
        | 'deleted_at'
        | 'vehicles'
        | 'hasId'
        | 'save'
        | 'remove'
        | 'reload'
        | 'recover'
        | 'softRemove'
      >
    >
{
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Matches('') // TODO: Add cnpj validation regex
  document?: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  car_parking_spaces?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  motorcycle_parking_spaces?: number;
}
