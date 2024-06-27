import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from '@server/trpc/trpc.service';
import db from 'apps/server/db';

@Injectable()
export class MatchRouter {
  constructor(private readonly trpc: TrpcService) {}

  matchRouter = this.trpc.router({
    match: this.trpc.procedure
      .input(
        z.object({
          name: z.string().optional(),
        }),
      )
      .query(async ({ input }) => {
        const { name } = input;

        const sports = await db.query.sport.findMany();

        return {
          greeting: `Match ${name ? name : `Bilbo asd` + JSON.stringify(sports)}`,
        };
      }),
  });
}
