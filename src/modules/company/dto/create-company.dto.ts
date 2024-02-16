import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

import { Address } from '@entities/Address.entity';
import { Company } from '@entities/Company.entity';

class CreateAddress
  implements
    Omit<
      Address,
      | 'id'
      | 'created_at'
      | 'updated_at'
      | 'deleted_at'
      | 'company'
      | 'hasId'
      | 'save'
      | 'remove'
      | 'reload'
      | 'recover'
      | 'softRemove'
    >
{
  @ApiProperty()
  @IsInt()
  number: number;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty()
  @Transform(({ value }) => value.match(/\d+/g).join(''))
  @IsString()
  zipcode: string;
}

export class CreateCompanyDTO
  implements
    Omit<
      Company,
      | 'id'
      | 'created_at'
      | 'updated_at'
      | 'deleted_at'
      | 'vehicles'
      | 'address'
      | 'hasId'
      | 'save'
      | 'remove'
      | 'reload'
      | 'recover'
      | 'softRemove'
    >
{
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @Transform(({ value }) => value.match(/\d+/g).join(''))
  @IsString()
  @Matches(`\d{2}.?\d{3?\d{3}/?\d{4?\d{2}`)
  document: string;

  @ApiProperty()
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  car_parking_spaces: number = 0;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  motorcycle_parking_spaces: number = 0;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  address: CreateAddress;
}
