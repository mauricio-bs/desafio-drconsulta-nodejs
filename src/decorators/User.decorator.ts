import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;
    const user = request.user_info;
    return data ? user?.[data] : user;
  },
);
