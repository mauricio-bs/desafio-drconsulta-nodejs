import {
  IsArray,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';

import { PaginationDTO } from '@shared/dto/pagination.dto';

export class FindManyCompaniesDTO extends PaginationDTO {
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  id?: string[];

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}
