import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateParkingDTO {
  @IsOptional()
  @IsString()
  observations?: string;

  @IsOptional()
  @IsDateString()
  ended_at?: Date;

  @IsOptional()
  @IsUUID('4')
  vehicle_id?: string;
}
