import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { TrpcService } from '@server/trpc/trpc.service';

@Module({
  imports: [],
  controllers: [],
  providers: [TrpcService, MatchService],
})
export class MatchModule {}
