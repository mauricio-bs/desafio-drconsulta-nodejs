import { ApiProperty } from '@nestjs/swagger';

import { Vehicle } from '@entities/Vehicle.entity';

export class PaginatedVehicles {
  @ApiProperty()
  total: number;

  @ApiProperty({ type: [Vehicle] })
  data: Vehicle[];
}
