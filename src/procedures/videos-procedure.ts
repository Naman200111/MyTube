import { db } from "@/db";
import { videos } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const VideosProcedure = createTRPCRouter({
  create: protectedProcedure.mutation(async (opts) => {
    const { id } = opts.ctx;
    await db.insert(videos).values({
      userId: id,
      title: "Untitled",
    });
  }),
});
