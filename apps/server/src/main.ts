import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';
import { TrpcRouter } from './trpc/trpc.router';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const configService = app.get(EnvService);

  const trpc = app.get(TrpcRouter);
  trpc.applyMiddleware(app);

  await app.listen(configService.get('PORT'));
}
bootstrap();
