// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { authRouter } from "./auth.router";
import { instrumentsRouter } from "./instruments.router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("instruments.", instrumentsRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
