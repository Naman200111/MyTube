import { db } from "@/db";
import { comments, users } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
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
      console.log(user.id, "userid");
      const [comment] = await db
        .insert(comments)
        .values({ videoId, userId: user.id, value })
        .returning();
      return comment;
    }),
  getMany: baseProcedure
    .input(z.object({ videoId: z.string().uuid().nonempty() }))
    .query(async ({ input: { videoId } }) => {
      const commentsList = await db
        .select()
        .from(comments)
        .where(eq(comments.videoId, videoId));
      return commentsList;
    }),
});
