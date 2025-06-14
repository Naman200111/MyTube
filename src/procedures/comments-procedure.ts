import { db } from "@/db";
import { comments, users } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";
import { z } from "zod";

export const CommentsProcedure = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid().nonempty(),
        clerkUserId: z.string().nonempty(),
        value: z.string().nonempty(),
      })
    )
    .mutation(async ({ input: { videoId, clerkUserId, value } }) => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkUserId));
      if (!user) {
        return new TRPCError({ message: "Unauthorized", code: "UNAUTHORIZED" });
      }

      const [comment] = await db
        .insert(comments)
        .values({ videoId, userId: user.id, value })
        .returning();
      return comment;
    }),

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
    .query(async ({ input: { videoId, limit, cursor } }) => {
      const commentsCount = await db.$count(
        comments,
        eq(comments.videoId, videoId)
      );
      const commentsList = await db
        .select({
          ...getTableColumns(comments),
          user: {
            ...getTableColumns(users),
          },
        })
        .from(comments)
        .innerJoin(users, eq(users.id, comments.userId))
        .where(
          and(
            eq(comments.videoId, videoId),
            cursor
              ? or(
                  lt(comments.updatedAt, cursor.updatedAt),
                  and(
                    eq(comments.updatedAt, cursor.updatedAt),
                    lt(comments.id, cursor.id)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(comments.updatedAt))
        .limit(limit + 1);

      const hasMore = commentsList.length > limit;
      const items = hasMore ? commentsList.slice(0, -1) : commentsList;

      const nextCursor = hasMore
        ? {
            id: items[items.length - 1]?.id,
            updatedAt: items[items.length - 1]?.updatedAt,
          }
        : null;

      return {
        items,
        commentsCount,
        cursor: nextCursor,
      };
    }),

  delete: baseProcedure
    .input(
      z.object({
        commentId: z.string().uuid().nonempty(),
      })
    )
    .mutation(async ({ input: { commentId } }) => {
      const [existingComment] = await db
        .delete(comments)
        .where(eq(comments.id, commentId))
        .returning();
      return { existingComment };
    }),
});
