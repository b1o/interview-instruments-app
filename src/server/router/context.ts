// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { getSession } from "next-auth/react";

import { authOptions as nextAuthOptions } from "../../pages/api/auth/[...nextauth]";
import { prisma } from "../db/client";

export const createContext = async (
  opts?: trpcNext.CreateNextContextOptions
) => {
  const req = opts?.req;
  const res = opts?.res;

  const session = opts && (await getServerSession(req!, res!, nextAuthOptions));

  let user = null;
  if (session?.email) {
    user = await prisma.user.findUnique({
      where: { id: session.email as string },
    });
  }

  return {
    bypass: "",
    req,
    res,
    session,
    user,
    prisma,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
