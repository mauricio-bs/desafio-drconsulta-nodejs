import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { SignInDTO } from '../dto/signin.dto';
import { IAuthService } from '../service/Iauth.service';

@ApiTags('Session')
@Controller('session')
export class AuthController {
  constructor(private service: IAuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  // Documentation
  @ApiBody({ type: SignInDTO, required: true })
  @ApiOkResponse({ description: 'User token' })
  @ApiBadRequestResponse({ description: 'Username or password does not match' })
  async signin(@Body() data: SignInDTO): Promise<string> {
    return await this.service.sigin(data);
  }
}
