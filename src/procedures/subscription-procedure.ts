import { db } from "@/db";
import { subscriptions, users, videos } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";

export const subscriptionProcedure = createTRPCRouter({
  subscribe: protectedProcedure
    .input(z.object({ videoId: z.string().nonempty() }))
    .mutation(async (opts) => {
      const { input, ctx } = opts;
      const { videoId } = input;
      const { id: viewerId } = ctx;

      const [user] = await db
        .select({
          creatorId: videos.userId,
        })
        .from(videos)
        .where(eq(videos.id, videoId));

      if (!user) {
        throw new TRPCError({ message: "Not found", code: "NOT_FOUND" });
      }
      if (!viewerId) {
        throw new TRPCError({ message: "UNAUTHORIZED", code: "UNAUTHORIZED" });
      }

      const creatorId = user.creatorId;
      const subscribe = await db
        .insert(subscriptions)
        .values({
          creatorId,
          viewerId,
        })
        .returning();

      return {
        subscribe,
      };
    }),

  unsubscribe: protectedProcedure
    .input(z.object({ videoId: z.string().nonempty() }))
    .mutation(async (opts) => {
      const { input, ctx } = opts;
      const { videoId } = input;
      const { id: viewerId } = ctx;

      const [user] = await db
        .select({
          creatorId: videos.userId,
        })
        .from(videos)
        .where(eq(videos.id, videoId));

      if (!user) {
        throw new TRPCError({ message: "Not found", code: "NOT_FOUND" });
      }
      if (!viewerId) {
        throw new TRPCError({ message: "UNAUTHORIZED", code: "UNAUTHORIZED" });
      }

      const creatorId = user.creatorId;
      const unsubscribe = await db
        .delete(subscriptions)
        .where(
          and(
            eq(subscriptions.creatorId, creatorId),
            eq(subscriptions.viewerId, viewerId)
          )
        )
        .returning();

      return {
        unsubscribe,
      };
    }),

  getMany: protectedProcedure.query(async (opts) => {
    const {
      ctx: { id },
    } = opts;
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) {
      throw new TRPCError({ message: "Not found", code: "NOT_FOUND" });
    }

    const userSubscriptions = await db
      .select({
        ...getTableColumns(subscriptions),
        creator: {
          ...getTableColumns(users),
        },
        // subscriberCount: db.$count(subscriptions, eq(subscriptions.creatorId, ))
      })
      .from(subscriptions)
      .innerJoin(users, eq(users.id, subscriptions.creatorId))
      .where(eq(subscriptions.viewerId, id));
    return userSubscriptions;
  }),
});
