import { db } from "@/db";
import { videoReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const VideoReactionProcedure = createTRPCRouter({
  like: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid().nonempty(),
      })
    )
    .mutation(async (opts) => {
      const { input, ctx } = opts;
      const { id: userId } = ctx;
      const { videoId } = input;

      const [existingReaction] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.userId, userId),
            eq(videoReactions.videoId, videoId)
          )
        );
      console.log(existingReaction, "existingReaction");
      if (existingReaction) {
        await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.videoId, videoId)
            )
          );
        console.log(existingReaction.type);
        if (existingReaction.type === "dislike") {
          await db.insert(videoReactions).values({
            userId,
            videoId,
            type: "like",
          });
        }
        return;
      }

      // not reacted
      await db.insert(videoReactions).values({
        userId,
        videoId,
        type: "like",
      });
    }),

  dislike: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid().nonempty(),
      })
    )
    .mutation(async (opts) => {
      const { input, ctx } = opts;
      const { id: userId } = ctx;
      const { videoId } = input;
      const [existingReaction] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.userId, userId),
            eq(videoReactions.videoId, videoId)
          )
        );

      if (existingReaction) {
        await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.videoId, videoId)
            )
          );
        if (existingReaction.type === "like") {
          await db.insert(videoReactions).values({
            userId,
            videoId,
            type: "dislike",
          });
        }
        return;
      }

      // not reacted
      await db.insert(videoReactions).values({
        userId,
        videoId,
        type: "dislike",
      });
    }),

  getOne: protectedProcedure
    .input(z.object({ videoId: z.string().uuid().nonempty() }))
    .query(async (opts) => {
      const { input, ctx } = opts;
      const { videoId } = input;
      const { id: userId } = ctx;
      const [getReaction] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.userId, userId)
          )
        );
      return getReaction || {};
    }),
});
