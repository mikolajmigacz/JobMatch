import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from '@domain/services/token.service';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TokenPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as TokenPayload;
  }
);
