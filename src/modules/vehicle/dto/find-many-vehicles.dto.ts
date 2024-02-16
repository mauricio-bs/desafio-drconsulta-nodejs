import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { EVehicleType } from '@enum/EVehicleType';
import { PaginationDTO } from '@shared/dto/pagination.dto';

export class FindManyVehiclesDTO extends PaginationDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  id?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ enum: EVehicleType })
  @IsOptional()
  @IsEnum(EVehicleType)
  type?: EVehicleType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  license_plate?: string;
}
