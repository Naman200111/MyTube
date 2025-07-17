import { db } from "@/db";
import { subscriptions, users, videos } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns, sql } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

export const UserProcedure = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        userId: z.string().uuid().nonempty(),
      })
    )
    .query(async ({ input: { userId: creatorId }, ctx: { clerkUserId } }) => {
      let user;
      if (clerkUserId) {
        [user] = await db
          .select()
          .from(users)
          .where(eq(users.clerkId, clerkUserId));
      }

      const [userPageData] = await db
        .select({
          ...getTableColumns(users),
          subscribersCount: db.$count(
            subscriptions,
            eq(subscriptions.creatorId, creatorId)
          ),
          isViewerSubscriber: db.$count(
            subscriptions,
            and(
              eq(subscriptions.creatorId, creatorId),
              user?.id ? eq(subscriptions.viewerId, user.id) : sql`false`
            )
          ),
          isViewerCreator: sql`${creatorId} = ${user?.id ?? sql`null`}`,
          videosCount: db.$count(videos, eq(videos.userId, creatorId)),
        })
        .from(users)
        .where(eq(users.id, creatorId));

      return userPageData;
    }),
  removeBanner: protectedProcedure.mutation(async ({ ctx: { id: userId } }) => {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return new TRPCError({ code: "NOT_FOUND" });
    }

    if (user.bannerKey) {
      const utApi = new UTApi();
      await utApi.deleteFiles(user.bannerKey);
    }
    const [userData] = await db
      .update(users)
      .set({
        bannerKey: null,
        bannerUrl: null,
      })
      .where(eq(users.id, userId))
      .returning();

    return userData;
  }),
});
