import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthContextDto } from '../dto/authContext.dto';

export const User = createParamDecorator<AuthContextDto>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AuthContextDto;
  },
);
