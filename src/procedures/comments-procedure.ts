import { db } from "@/db";
import { commentReactions, comments, users } from "@/db/schema";
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
        value: z.string().nonempty(),
      })
    )
    .mutation(async ({ input: { videoId, value }, ctx: { clerkUserId } }) => {
      if (!clerkUserId) {
        return new TRPCError({ message: "Unauthorized", code: "UNAUTHORIZED" });
      }
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
    .query(
      async ({ input: { videoId, limit, cursor }, ctx: { clerkUserId } }) => {
        const commentsCount = await db.$count(
          comments,
          eq(comments.videoId, videoId)
        );

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.clerkId, clerkUserId || ""));

        const viewerReactions = db
          .$with("viewer_reactions")
          .as(
            db
              .select()
              .from(commentReactions)
              .where(eq(commentReactions.userId, user?.id))
          );

        const commentsList = await db
          .with(viewerReactions)
          .select({
            ...getTableColumns(comments),
            user: {
              ...getTableColumns(users),
            },
            likeCount: db.$count(
              commentReactions,
              and(
                eq(commentReactions.commentId, comments.id),
                eq(commentReactions.type, "like")
              )
            ),
            dislikeCount: db.$count(
              commentReactions,
              and(
                eq(commentReactions.commentId, comments.id),
                eq(commentReactions.type, "dislike")
              )
            ),
            viewerReaction: viewerReactions.type,
          })
          .from(comments)
          .innerJoin(users, eq(users.id, comments.userId))
          .leftJoin(viewerReactions, eq(viewerReactions.commentId, comments.id))
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
      }
    ),

  delete: protectedProcedure
    .input(
      z.object({
        commentId: z.string().uuid().nonempty(),
      })
    )
    .mutation(async ({ input: { commentId }, ctx: { id: userId } }) => {
      const [existingComment] = await db
        .delete(comments)
        .where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
        .returning();
      return { existingComment };
    }),
});
