import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserContext } from '../interfaces/jwt-payload.interface';

export const GetUser = createParamDecorator(
  (data: keyof UserContext | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserContext;
    return data ? user?.[data] : user;
  },
);
