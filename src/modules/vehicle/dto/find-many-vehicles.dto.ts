import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { EVehicleType } from '@enum/EVehicleType';
import { PaginationDTO } from '@shared/dto/pagination.dto';

export class FindManyVehiclesDTO extends PaginationDTO {
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  id?: string[];

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsEnum(EVehicleType)
  type?: EVehicleType;

  @IsOptional()
  @IsString()
  license_plate?: string;
}
