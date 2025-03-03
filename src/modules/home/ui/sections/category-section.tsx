"use client";

import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import CategoryCarousel from "../components/category-carousel";

export const CategorySection = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <CategorySectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const CategorySectionSuspense = () => {
  // const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const categories = [
    {
      id: "1",
      name: "cat1",
      desc: "cat1_Desc",
    },
    {
      id: "2",
      name: "cat2",
      desc: "cat2_Desc",
    },
    {
      id: "3",
      name: "cat3",
      desc: "cat3_Desc",
    },
    {
      id: "1",
      name: "cat1",
      desc: "cat1_Desc",
    },
    {
      id: "2",
      name: "cat2",
      desc: "cat2_Desc",
    },
    {
      id: "3",
      name: "catsasdads3",
      desc: "cat3_Desc",
    },
    {
      id: "1",
      name: "cat1dasdsada",
      desc: "cat1_Desc",
    },
    {
      id: "2",
      name: "cat2",
      desc: "cat2_Desc",
    },
    {
      id: "3",
      name: "cat3asdsadas",
      desc: "cat3_Desc",
    },
    {
      id: "1",
      name: "cat1",
      desc: "cat1_Desc",
    },
    {
      id: "2",
      name: "cadsadsadsat2",
      desc: "cat2_Desc",
    },
    {
      id: "3",
      name: "cadasdsat3",
      desc: "cat3_Desc",
    },
    {
      id: "1",
      name: "cat1",
      desc: "cat1_Desc",
    },
    {
      id: "2",
      name: "cat2",
      desc: "cat2_Desc",
    },
    {
      id: "3",
      name: "cat3",
      desc: "cat3_Desc",
    },
    {
      id: "1",
      name: "cat1",
      desc: "cat1_Desc",
    },
    {
      id: "2",
      name: "cat2",
      desc: "cat2_Desc",
    },
    {
      id: "3",
      name: "catsasdads3",
      desc: "cat3_Desc",
    },
    {
      id: "1",
      name: "cat1dasdsada",
      desc: "cat1_Desc",
    },
    {
      id: "2",
      name: "cat2",
      desc: "cat2_Desc",
    },
    {
      id: "3",
      name: "cat3asdsadas",
      desc: "cat3_Desc",
    },
    {
      id: "1",
      name: "cat1",
      desc: "cat1_Desc",
    },
    {
      id: "2",
      name: "cadsadsadsat2",
      desc: "cat2_Desc",
    },
    {
      id: "3",
      name: "cadasdsat3",
      desc: "cat3_Desc",
    },
  ];
  return <CategoryCarousel categories={categories} />;
  // return <div>{JSON.stringify(categories)}</div>;
};
