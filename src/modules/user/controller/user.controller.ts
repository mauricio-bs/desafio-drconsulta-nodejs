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
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/guards/Auth.guard';

import { UserInfo } from '@decorators/User.decorator';
import { User } from '@entities/User.entity';

import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { IUserService } from '../service/Iuser.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private service: IUserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  // Documentation
  @ApiBody({ type: CreateUserDTO })
  @ApiCreatedResponse({ description: 'User created', type: User })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  async create(@Body() data: CreateUserDTO): Promise<User> {
    return await this.service.create(data);
  }

  @UseGuards(JWTAuthGuard)
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  // Documentation
  @ApiParam({ name: 'user_id' })
  @ApiBody({ type: UpdateUserDTO })
  @ApiOkResponse({ description: 'Updated user', type: User })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async update(
    @UserInfo('id') user_id: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUserDTO,
  ): Promise<User> {
    if (id !== user_id)
      throw new UnauthorizedException('Can not update other users information');

    return await this.service.update(id, data);
  }

  @UseGuards(JWTAuthGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  // Documentation
  @ApiParam({ name: 'user_id' })
  @ApiNoContentResponse({ description: 'User deleted' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async delete(
    @UserInfo('id') user_id: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    if (id !== user_id)
      throw new UnauthorizedException('Can not update other users information');

    return await this.service.delete(id);
  }

  @UseGuards(JWTAuthGuard)
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  // Documentation
  @ApiParam({ name: 'user_id' })
  @ApiOkResponse({ description: 'User found', type: User })
  async findById(
    @UserInfo('id') user_id: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<User> {
    if (id !== user_id)
      throw new UnauthorizedException(
        'Can not get informations from another user',
      );

    return await this.service.findOneById(id);
  }
}
