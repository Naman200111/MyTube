import { createTRPCRouter } from "../init";
import { categoryProcedure } from "@/procedures/category-procedure";

export const appRouter = createTRPCRouter({
  categories: categoryProcedure,
});

export type AppRouter = typeof appRouter;
