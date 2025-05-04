import { createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { User } from 'src/entities/user.entity';

interface RequestWithUser extends Request {
  user: User;
}

interface GqlContext {
  req: RequestWithUser;
}

export const CurrentUserDecorator = createParamDecorator(
  (data: unknown, ctx) => {
    const gqlContext = GqlExecutionContext.create(ctx);

    const request = gqlContext.getContext<GqlContext>().req;

    const user = request.user;

    return user;
  },
);
