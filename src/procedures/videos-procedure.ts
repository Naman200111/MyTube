import { db } from "@/db";
import { videos } from "@/db/schema";

import { mux } from "@/mux/mux";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const VideosProcedure = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
        title: z.string(),
        description: z.string(),
        categoryId: z.string(),
        visibility: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { ctx, input } = opts;
      const { id } = ctx;

      const { id: videoId, title, description, visibility, categoryId } = input;
      const update = await db
        .update(videos)
        .set({
          title: title,
          description: description,
          categoryId: categoryId,
          visibility: visibility,
        })
        .where(and(eq(videos.userId, id), eq(videos.id, videoId)))
        .returning();

      if (!update) {
        throw new TRPCError({ message: "Update Failed", code: "BAD_REQUEST" });
      }

      return {
        update,
      };
    }),
  create: protectedProcedure.mutation(async (opts) => {
    const { id } = opts.ctx;

    const upload = await mux.video.uploads.create({
      cors_origin: "*",
      new_asset_settings: {
        playback_policy: ["public"],
        video_quality: "basic",
      },
    });

    const [video] = await db
      .insert(videos)
      .values({
        userId: id,
        title: "Untitled",
        description: "This is a test upload video",
        muxUploadId: upload.id,
      })
      .returning();

    return {
      video,
      url: upload.url,
    };
  }),
});
