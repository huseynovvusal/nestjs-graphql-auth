import { INestApplication, ValidationPipe } from '@nestjs/common';
import { EntityNotFoundFilter } from './entity-not-found/entity-not-found.filter';

export function createApp(app: INestApplication): void {
  app.useGlobalFilters(new EntityNotFoundFilter());
  app.useGlobalPipes(new ValidationPipe());
}
