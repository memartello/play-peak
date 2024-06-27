import { Module } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { TrpcRouter } from './trpc.router';
import { MatchRouter } from '@server/match/match.router';

@Module({
  imports: [],
  controllers: [],
  providers: [TrpcService, TrpcRouter, MatchRouter],
})
export class TrpcModule {}
