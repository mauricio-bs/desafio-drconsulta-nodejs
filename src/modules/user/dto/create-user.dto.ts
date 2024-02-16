import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

import { Match } from '@decorators/Match.decorator';
import { User } from '@entities/User.entity';

export class CreateUserDTO
  implements
    Omit<
      User,
      | 'id'
      | 'created_at'
      | 'updated_at'
      | 'deleted_at'
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
  @IsString()
  @MinLength(4)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Matches(`^(?=.*[A-Z])(?=.*[!#@$%&])(?=.*[0-9])(?=.*[a-z]).{8,}$`)
  password: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Match('password')
  confirm_password: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  is_active: boolean = true;
}
