import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/guards/Auth.guard';

import { Company } from '@entities/Company.entity';

import { CreateCompanyDTO } from '../dto/create-company.dto';
import { FindManyCompaniesDTO } from '../dto/find-many-companies.dto';
import { PaginatedCompaniesDTO } from '../dto/paginated-companies.dto';
import { UpdateCompanyDTO } from '../dto/update-company.dto';
import { ICompanyService } from '../service/Icompany.service';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private service: ICompanyService) {}

  @UseGuards(JWTAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  // Documentation
  @ApiBearerAuth()
  @ApiBody({ type: CreateCompanyDTO, required: true })
  @ApiCreatedResponse({ description: 'Company created!', type: Company })
  @ApiBadRequestResponse({ description: 'Invalid data types / Missing data' })
  async create(@Body() data: CreateCompanyDTO): Promise<Company> {
    return await this.service.create(data);
  }

  @UseGuards(JWTAuthGuard)
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  // Documentation
  @ApiBearerAuth()
  @ApiParam({ name: 'company_id', required: true })
  @ApiBody({ type: UpdateCompanyDTO, required: false })
  @ApiOkResponse({ description: 'Company updated!', type: Company })
  @ApiBadRequestResponse({ description: 'Invalid data types' })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateCompanyDTO,
  ): Promise<Company> {
    return await this.service.update(id, data);
  }

  @UseGuards(JWTAuthGuard)
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  // Documentation
  @ApiBearerAuth()
  @ApiParam({ name: 'company_id', required: true })
  @ApiOkResponse({ description: 'Company found!', type: Company })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Company> {
    return await this.service.findOneById(id);
  }

  @UseGuards(JWTAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  // Documentation
  @ApiBearerAuth()
  @ApiQuery({ type: FindManyCompaniesDTO, required: false, name: 'filters' })
  @ApiOkResponse({ description: 'OK', type: PaginatedCompaniesDTO })
  @ApiBadRequestResponse({ description: 'Invalid filter types' })
  async findAll(
    @Query() filters: FindManyCompaniesDTO,
  ): Promise<PaginatedCompaniesDTO> {
    return await this.service.findAll(filters);
  }

  @UseGuards(JWTAuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // Documentation
  @ApiBearerAuth()
  @ApiParam({ name: 'company_id', required: true })
  @ApiNoContentResponse({ description: 'Company deleted' })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.service.delete(id);
  }
}
