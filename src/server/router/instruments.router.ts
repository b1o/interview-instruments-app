import { Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

export const instrumentsRouter = createProtectedRouter()
  .mutation("update", {
    async resolve({ ctx }) {
      const instrumentsRes = await fetch(
        process.env.INSTRUMENTS_API_URL as string
      );
      const instruments = await instrumentsRes.json();

      const dbOps = [];
      for (const coin of instruments) {
        dbOps.push(
          ctx.prisma.instrument.upsert({
            where: { instrument_symbol: coin.symbol },
            create: {
              instrument_symbol: coin.symbol,
              instrument_name: coin.name,
              usd_price: coin.market_data.current_price.usd,
              image: coin.image.small,
            },
            update: {
              usd_price: coin.market_data.current_price.usd,
              image: coin.image.small,
            },
          })
        );
      }
      const data = await ctx.prisma.$transaction(dbOps);

      return {
        data,
      };
    },
  })
  .middleware(({ ctx, next }) => {
    if (!ctx.user && ctx.bypass === process.env.INSTRUMENTS_API_URL) {
      return next({
        ctx: {
          ...ctx,
          session: {},
        },
      });
    }

    if (!ctx.user?.instrumentsAccess) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You have no access to this page",
      });
    }

    return next({
      ctx: {
        ...ctx,
        session: { ...ctx.session, user: ctx.session!.user },
      },
    });
  })
  .query("get", {
    async resolve({ ctx }) {
      const result = await ctx.prisma.instrument.findMany({ where: {} });

      return {
        result,
      };
    },
  })
  .query("bySymbol", {
    input: z.object({
      instrument_symbol: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { instrument_symbol } = input;
      const result = await ctx.prisma.instrument.findFirst({
        where: { instrument_symbol },
      });

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Instrument not found",
        });
      }

      return {
        result,
      };
    },
  });
