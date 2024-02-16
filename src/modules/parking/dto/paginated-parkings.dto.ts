import { ApiProperty } from '@nestjs/swagger';

import { Parking } from '@entities/Parking.entity';

export class PaginatedParkingDTO {
  @ApiProperty()
  total: number;

  @ApiProperty({ type: [Parking] })
  data: Parking[];
}
