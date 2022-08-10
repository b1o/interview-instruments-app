import { Instrument, Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { z } from "zod";
import { createRouter } from "./context";
import { createProtectedRouter } from "./protected-router";

export const instrumentsRouter = createRouter()
  .mutation("update", {
    async resolve({ ctx }) {
      const instrumentsRes = await fetch(
        process.env.INSTRUMENTS_API_URL as string
      );
      const instruments = await instrumentsRes.json();

      const data: Instrument[] = [];
      for (const coin of instruments) {
        const res = await ctx.prisma.instrument.upsert({
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
        });
        data.push(res);
      }

      return {
        data,
      };
    },
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
      console.log(instrument_symbol, typeof instrument_symbol);
      if (!instrument_symbol) {
        return null;
      }
      if (
        !ctx.user?.instrumentsAccess &&
        ctx.bypass !== (process.env.BYPASS_API_KEY as string)
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have no access",
        });
      }

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
