import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID, ValidateIf } from 'class-validator';

import { PaginationDTO } from '@shared/dto/pagination.dto';

export class FindManyParkingsDTO extends PaginationDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  started_at?: Date;

  @ApiPropertyOptional()
  @IsDateString()
  @ValidateIf((data) => data.started_at, { message: 'Must have a start date' })
  ended_at?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  vehicle_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  company_id?: string;
}
