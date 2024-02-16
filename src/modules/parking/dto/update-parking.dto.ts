import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateParkingDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observations?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  ended_at?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  vehicle_id?: string;
}
