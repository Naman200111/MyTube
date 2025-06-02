"use client";

import { trpc } from "@/trpc/client";
import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";
import CategoryCarousel from "../components/category-carousel";
import { Loader2Icon } from "lucide-react";

export const CategorySection = () => {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex justify-center">
          <Loader2Icon className="animate-spin mt-10" />
        </div>
      }
    >
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
