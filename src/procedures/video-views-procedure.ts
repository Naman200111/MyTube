import { db } from "@/db";
import { videoViews } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const VideoViewsProcedure = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid().nonempty(),
      })
    )
    .mutation(async (opts) => {
      const { input, ctx } = opts;
      const { id: userId } = ctx;
      const { videoId } = input;
      const [existingView] = await db
        .select()
        .from(videoViews)
        .where(
          and(eq(videoViews.userId, userId), eq(videoViews.videoId, videoId))
        );
      if (existingView) {
        return existingView;
      }
      const data = await db
        .insert(videoViews)
        .values({
          userId,
          videoId,
        })
        .returning();
      return data;
    }),
});
