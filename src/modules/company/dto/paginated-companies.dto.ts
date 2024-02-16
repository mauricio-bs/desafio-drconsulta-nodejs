import { ApiProperty } from '@nestjs/swagger';

import { Company } from '@entities/Company.entity';

export class PaginatedCompaniesDTO {
  @ApiProperty()
  total: number;

  @ApiProperty({ type: [Company] })
  data: Company[];
}
