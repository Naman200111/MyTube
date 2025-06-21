import { db } from "@/db";
import { users, videos, videoViews } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { and, desc, eq, getTableColumns, lt, ne, or } from "drizzle-orm";
import { z } from "zod";

export const SuggestionProcedure = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.string().uuid().nonempty(),
        limit: z.number().min(1).max(100),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
      })
    )
    .query(
      async ({ input: { videoId, limit, cursor }, ctx: { clerkUserId } }) => {
        const [existingVideo] = await db
          .select()
          .from(videos)
          .where(eq(videos.id, videoId));

        let categoryId = null;
        if (existingVideo) {
          categoryId = existingVideo.categoryId;
        }

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.clerkId, clerkUserId || ""));

        const suggestionList = await db
          .select({
            ...getTableColumns(videos),
            user: {
              ...getTableColumns(users),
            },
            viewCount: db.$count(videoViews, eq(videos.id, videoViews.videoId)),
          })
          .from(videos)
          .innerJoin(users, eq(users.id, user?.id))
          .where(
            and(
              and(
                categoryId ? eq(videos.categoryId, categoryId) : undefined,
                ne(videos.id, existingVideo?.id)
              ),
              cursor
                ? or(
                    lt(videos.updatedAt, cursor.updatedAt),
                    and(
                      eq(videos.updatedAt, cursor.updatedAt),
                      lt(videos.id, cursor.id)
                    )
                  )
                : undefined
            )
          )
          .orderBy(desc(videos.updatedAt))
          .limit(limit + 1);

        const hasMore = suggestionList.length > limit;
        const items = hasMore ? suggestionList.slice(0, -1) : suggestionList;

        const nextCursor = hasMore
          ? {
              id: items[items.length - 1]?.id,
              updatedAt: items[items.length - 1]?.updatedAt,
            }
          : null;

        return {
          items,
          cursor: nextCursor,
        };
      }
    ),
});
