import { IsString } from 'class-validator';

export class SignInDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
