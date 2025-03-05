"use client";

import { trpc } from "@/trpc/client";
import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";
import CategoryCarousel from "../components/category-carousel";
import { Skeleton } from "@/components/ui/skeleton";

export const CategorySection = () => {
  return (
    <Suspense fallback={<Skeleton className="h-8 w-[40%]" />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <CategorySectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const CategorySectionSuspense = () => {
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  return <CategoryCarousel categories={categories} />;
};
