import { db } from "@/db";
import { commentReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const CommentReactionProcedure = createTRPCRouter({
  like: protectedProcedure
    .input(
      z.object({
        commentId: z.string().uuid().nonempty(),
      })
    )
    .mutation(async ({ input: { commentId }, ctx: { id: userId } }) => {
      const [existingReaction] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.userId, userId),
            eq(commentReactions.commentId, commentId)
          )
        );
      if (existingReaction) {
        await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.userId, userId),
              eq(commentReactions.commentId, commentId)
            )
          );
        if (existingReaction.type === "dislike") {
          await db.insert(commentReactions).values({
            userId,
            commentId,
            type: "like",
          });
        }
        return;
      }

      // not reacted
      await db.insert(commentReactions).values({
        userId,
        commentId,
        type: "like",
      });
    }),

  dislike: protectedProcedure
    .input(
      z.object({
        commentId: z.string().uuid().nonempty(),
      })
    )
    .mutation(async ({ input: { commentId }, ctx: { id: userId } }) => {
      const [existingReaction] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.userId, userId),
            eq(commentReactions.commentId, commentId)
          )
        );

      if (existingReaction) {
        await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.userId, userId),
              eq(commentReactions.commentId, commentId)
            )
          );
        if (existingReaction.type === "like") {
          await db.insert(commentReactions).values({
            userId,
            commentId,
            type: "dislike",
          });
        }
        return;
      }

      // not reacted
      await db.insert(commentReactions).values({
        userId,
        commentId,
        type: "dislike",
      });
    }),
});
