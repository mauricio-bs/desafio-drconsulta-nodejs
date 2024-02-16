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

import { Vehicle } from '@entities/Vehicle.entity';

import { CreateVehicleDTO } from '../dto/create-vehicle.dto';
import { FindManyVehiclesDTO } from '../dto/find-many-vehicles.dto';
import { PaginatedVehicles } from '../dto/paginated-vehicles.dto';
import { UpdateVehicleDTO } from '../dto/update-vehicle.dto';
import { IVehicleService } from '../service/Ivehicle.service';

@ApiTags('Vehicle')
@Controller('vehicle')
export class VehicleController {
  constructor(private service: IVehicleService) {}

  @UseGuards(JWTAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  // Documentation
  @ApiBearerAuth()
  @ApiBody({ type: CreateVehicleDTO })
  @ApiCreatedResponse({ description: 'Vehicle created!', type: Vehicle })
  async create(@Body() data: CreateVehicleDTO): Promise<Vehicle> {
    return await this.service.create(data);
  }

  @UseGuards(JWTAuthGuard)
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  // Documentation
  @ApiBearerAuth()
  @ApiParam({ name: 'vehicle_id' })
  @ApiBody({ type: UpdateVehicleDTO })
  @ApiOkResponse({ description: 'Vehicle updated', type: Vehicle })
  @ApiNotFoundResponse({ description: 'Vehicle not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateVehicleDTO,
  ): Promise<Vehicle> {
    return await this.service.update(id, data);
  }

  @UseGuards(JWTAuthGuard)
  @Delete('/:id')
  // Documentation
  @ApiBearerAuth()
  @ApiParam({ name: 'vehicle_id' })
  @ApiNoContentResponse({ description: 'Vehicle deleted' })
  @ApiNotFoundResponse({ description: 'Vehicle not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.service.delete(id);
  }

  @UseGuards(JWTAuthGuard)
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  // Documentation
  @ApiBearerAuth()
  @ApiParam({ name: 'vehicle_id' })
  @ApiOkResponse({ description: 'Vehicle found', type: Vehicle })
  async findOneById(@Param('id', ParseUUIDPipe) id: string): Promise<Vehicle> {
    return await this.service.findOneById(id);
  }

  @UseGuards(JWTAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  // Documentation
  @ApiBearerAuth()
  @ApiQuery({ type: FindManyVehiclesDTO, name: 'filters' })
  @ApiOkResponse({ type: PaginatedVehicles })
  async findAll(
    @Query() filters: FindManyVehiclesDTO,
  ): Promise<PaginatedVehicles> {
    return await this.service.findAll(filters);
  }
}
