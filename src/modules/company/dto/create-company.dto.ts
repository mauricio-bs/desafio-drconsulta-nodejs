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
  @IsInt()
  number: number;

  @IsString()
  address: string;

  @IsString()
  country: string;

  @IsString()
  state: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  complement?: string;

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
  @IsString()
  name: string;

  @Transform(({ value }) => value.match(/\d+/g).join(''))
  @IsString()
  @Matches(`\d{2}.?\d{3?\d{3}/?\d{4?\d{2}`)
  document: string;

  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  car_parking_spaces: number = 0;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  motorcycle_parking_spaces: number = 0;

  @IsObject()
  @ValidateNested()
  address: CreateAddress;
}
