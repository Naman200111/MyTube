import { db } from "@/db";
import { users } from "@/db/schema";
import { ratelimiter } from "@/lib/ratelimiter";
import { auth } from "@clerk/nextjs/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
  // runs every time a procedure is run, so avoid heavy operations here
  const { userId } = await auth();
  return {
    clerkUserId: userId,
  };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
// export type Context = typeof createTRPCContext;
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async (opts) => {
  const { clerkUserId } = opts.ctx;
  if (!clerkUserId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const [data] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUserId));

  if (!data) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  const { success } = await ratelimiter.limit(data.id);
  if (!success) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      ...data,
    },
  });
});
export const createCallerFactory = t.createCallerFactory;
