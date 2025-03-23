import { db } from "@/db";
import { videos } from "@/db/schema";

import { mux } from "@/mux/mux";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const VideosProcedure = createTRPCRouter({
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
