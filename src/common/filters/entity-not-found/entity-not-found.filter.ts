import { ArgumentsHost, Catch, NotFoundException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { EntityNotFoundError } from 'typeorm';

@Catch(EntityNotFoundError)
export class EntityNotFoundFilter<T> implements GqlExceptionFilter<T> {
  catch(exception: T, host: ArgumentsHost) {
    return new NotFoundException('Entity not found');
  }
}
