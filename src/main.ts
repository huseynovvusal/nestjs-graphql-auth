import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createApp } from './app.create';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply middleware and filters
  createApp(app);

  await app.listen(process.env.PORT ?? 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
