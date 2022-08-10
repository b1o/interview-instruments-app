import * as trpc from "@trpc/server";
import { createRouter } from "./context";

export function createProtectedRouter() {
  return createRouter().middleware(({ ctx, next }) => {
    if (ctx.bypass === process.env.INSTRUMENTS_API_URL) {
      return next({
        ctx: { ...ctx },
      });
    }
    console.log(ctx.session);
    if (!ctx.user) {
      throw new trpc.TRPCError({
        code: "UNAUTHORIZED",
        message: "You have no access",
      });
    }
    return next({
      ctx: {
        ...ctx,
      },
    });
  });
}
