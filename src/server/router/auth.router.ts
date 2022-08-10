import { createRouter } from "./context";
import { signUpSchema } from "../../common/validation/auth";
import * as trpc from "@trpc/server";
import { hash } from "argon2";

export const authRouter = createRouter().mutation("signup", {
  input: signUpSchema,
  resolve: async ({ input, ctx }) => {
    const { email, password, username } = input;

    const exists = await ctx.prisma.user.findFirst({
      where: { email },
    });

    if (exists) {
      throw new trpc.TRPCError({
        code: "CONFLICT",
        message: "User already exists",
      });
    }

    const hashedPassword = await hash(password);

    const result = await ctx.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    return {
      status: 201,
      message: "User created",
      result: result.email,
    };
  },
});
