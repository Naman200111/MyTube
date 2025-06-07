import { db } from "@/db";
import { videoViews } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";

export const VideoViewsProcedure = createTRPCRouter({
  create: baseProcedure
    .input(
      z.object({
        userId: z.string().uuid().nonempty(),
        videoId: z.string().uuid().nonempty(),
      })
    )
    .mutation(async (opts) => {
      const { input, ctx } = opts;
      // const { clerkUserId } =  ctx;
      const { userId, videoId } = input;
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
