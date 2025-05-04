import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

interface GqlContext {
  req: Request;
}

@Injectable()
export class GqlJwtGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context);

    console.log('HII', ctx.getContext<GqlContext>().req.headers.authorization);

    return ctx.getContext<GqlContext>().req;
  }
}
