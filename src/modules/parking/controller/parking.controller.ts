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

import { Parking } from '@entities/Parking.entity';

import { CreateParkingDTO } from '../dto/create-parking.dto';
import { FindManyParkingsDTO } from '../dto/find-many-parkings.dto';
import { PaginatedParkingDTO } from '../dto/paginated-parkings.dto';
import { UpdateParkingDTO } from '../dto/update-parking.dto';
import { IParkingService } from '../service/Iparking.service';

@ApiTags('Parking')
@Controller('parking')
export class ParkingController {
  constructor(private service: IParkingService) {}

  @UseGuards(JWTAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  // Documentation
  @ApiBearerAuth()
  @ApiBody({ type: CreateParkingDTO })
  @ApiCreatedResponse({ description: 'Parking created', type: Parking })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async create(@Body() data: CreateParkingDTO): Promise<Parking> {
    return await this.service.create(data);
  }

  @UseGuards(JWTAuthGuard)
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  // Documentation
  @ApiBearerAuth()
  @ApiParam({ name: 'parking_id' })
  @ApiBody({ type: UpdateParkingDTO })
  @ApiOkResponse({ description: 'Parking updated', type: Parking })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateParkingDTO,
  ): Promise<Parking> {
    return await this.service.update(id, data);
  }

  @UseGuards(JWTAuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // Documentation
  @ApiBearerAuth()
  @ApiParam({ name: 'parking_id' })
  @ApiNoContentResponse({ description: 'Parking deleted' })
  @ApiNotFoundResponse({ description: 'Parking not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.service.delete(id);
  }

  @UseGuards(JWTAuthGuard)
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  // Documentation
  @ApiBearerAuth()
  @ApiParam({ name: 'parking_id' })
  @ApiOkResponse({ description: 'Parking found', type: Parking })
  async findOneById(@Param('id', ParseUUIDPipe) id: string): Promise<Parking> {
    return await this.service.findOneById(id);
  }

  @UseGuards(JWTAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  // Documentation
  @ApiBearerAuth()
  @ApiQuery({ type: FindManyParkingsDTO })
  @ApiOkResponse({ description: 'Parkings found', type: PaginatedParkingDTO })
  async findall(
    @Query() filters: FindManyParkingsDTO,
  ): Promise<PaginatedParkingDTO> {
    return await this.service.findAll(filters);
  }
}
