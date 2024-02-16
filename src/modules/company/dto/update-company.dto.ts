import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  Min,
} from 'class-validator';

import { Company } from '@entities/Company.entity';

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
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches('') // TODO: Add cnpj validation regex
  document?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  car_parking_spaces?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  motorcycle_parking_spaces?: number;
}
