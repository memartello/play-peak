import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EnvModule } from './env/env.module';
import { envSchema } from './env/env';
import { TrpcModule } from './trpc/trpc.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
    }),
    EnvModule,
    TrpcModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
