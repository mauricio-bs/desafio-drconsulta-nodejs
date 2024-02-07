import {
  IsArray,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class FindManyCompaniesDTO {
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
