import { z } from "zod";
import { db } from "@/db";
import { comments, videoReactions, videos, videoViews } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";

export const StudioProcedure = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .query(async (opts) => {
      const { input } = opts;
      const { videoId } = input;
      const [data] = await db
        .select()
        .from(videos)
        .where(eq(videos.id, videoId));
      return data;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        // cursor property is necessary if using infiniteQuery
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async (opts) => {
      const { input, ctx } = opts;
      const { limit, cursor } = input;
      const { id: userId } = ctx;

      const data = await db
        .select({
          ...getTableColumns(videos),
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          commentCount: db.$count(comments, eq(comments.videoId, videos.id)),
        })
        .from(videos)
        .where(
          and(
            eq(videos.userId, userId),
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

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;

      const nextCursor = hasMore
        ? {
            id: items[items.length - 1]?.id,
            updatedAt: items[items.length - 1]?.updatedAt,
          }
        : null;
      return {
        data: items,
        nextCursor,
      };
    }),
});
