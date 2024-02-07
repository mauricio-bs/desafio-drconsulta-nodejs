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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { Company } from '@entities/Company';

import { CreateCompanyDTO } from '../dto/create-company.dto';
import { FindManyCompaniesDTO } from '../dto/find-many-companies.dto';
import { PaginatedCompaniesDTO } from '../dto/paginated-companies.dto';
import { UpdateCompanyDTO } from '../dto/update-company.dto';
import { ICompanyService } from '../service/Icompany.service';

@Controller('company')
export class CompanyController {
  constructor(private service: ICompanyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // Documentation
  @ApiBody({ type: CreateCompanyDTO, required: true })
  @ApiCreatedResponse({ description: 'Company created!' })
  @ApiBadRequestResponse({ description: 'Invalid data types / Missing data' })
  async create(@Body() data: CreateCompanyDTO): Promise<Company> {
    return await this.service.create(data);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  // Documentation
  @ApiParam({ name: 'company_id', required: true })
  @ApiBody({ type: UpdateCompanyDTO, required: false })
  @ApiOkResponse({ description: 'Company updated!' })
  @ApiBadRequestResponse({ description: 'Invalid data types' })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateCompanyDTO,
  ): Promise<Company> {
    return await this.service.update(id, data);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  // Documentation
  @ApiParam({ name: 'company_id', required: true })
  @ApiOkResponse({ description: 'Company found!' })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Company> {
    return await this.service.findOneById(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  // Documentation
  @ApiQuery({ type: PaginatedCompaniesDTO, required: false, name: 'filters' })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Invalid filter types' })
  async findAll(
    @Query() filters: FindManyCompaniesDTO,
  ): Promise<PaginatedCompaniesDTO> {
    return await this.service.findAll(filters);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // Documentation
  @ApiParam({ name: 'company_id', required: true })
  @ApiNoContentResponse({ description: 'Company deleted' })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.service.delete(id);
  }
}
