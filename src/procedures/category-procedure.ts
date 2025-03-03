import { db } from "@/db";
import { categories } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoryProcedure = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    return await db.select().from(categories);
  }),
});
