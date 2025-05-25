import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    const gqlCtx = GqlExecutionContext.create(context);
    if (gqlCtx.getType() === 'graphql') {
      const req = gqlCtx.getContext().req;
      return req.user;
    } else {
      const req = context.switchToHttp().getRequest();
      return req.user;
    }
  },
);
