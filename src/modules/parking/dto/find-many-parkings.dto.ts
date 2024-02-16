import { IsDateString, IsOptional, IsUUID, ValidateIf } from 'class-validator';

import { PaginationDTO } from '@shared/dto/pagination.dto';

export class FindManyParkingsDTO extends PaginationDTO {
  @IsOptional()
  @IsDateString()
  started_at?: Date;

  @IsDateString()
  @ValidateIf((data) => data.started_at, { message: 'Must have a start date' })
  ended_at?: Date;

  @IsOptional()
  @IsUUID('4')
  vehicle_id?: string;

  @IsOptional()
  @IsUUID('4')
  company_id?: string;
}
