"use client";

import { Badge } from "@/components/ui/badge";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type categoryContent = {
  id: string;
  name: string;
  desc?: string;
};

type categoryCarouselProps = {
  categories: categoryContent[];
  setSelectedCategory: (val: string) => void;
  selectedCategory: string;
};

const CategoryCarousel = ({
  categories,
  setSelectedCategory,
  selectedCategory,
}: categoryCarouselProps) => {
  // improvements => conditionally render left and right scroll arrows
  const scrollRef = useRef<HTMLDivElement>(null);
  const onScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -width : width,
        behavior: "smooth",
      });
    }
  };

  const onSelectCategory = (name: string) => {
    setSelectedCategory(name);
  };

  return (
    <div className="flex gap-3 items-center cursor-pointer">
      {true ? (
        <div
          className="hover:bg-slate-50 hover:rounded-full p-2"
          onClick={() => onScroll("left")}
        >
          <ChevronLeft className="size-4" />
        </div>
      ) : null}
      <div ref={scrollRef} className="flex flex-nowrap gap-2 overflow-hidden">
        <Badge
          variant={selectedCategory === "" ? "default" : "secondary"}
          className="p-[6px]"
          onClick={() => onSelectCategory("")}
        >
          All
        </Badge>
        {categories.map((category: categoryContent, idx: number) => {
          return (
            <div key={idx} onClick={() => onSelectCategory(category.name)}>
              <Badge
                variant={
                  selectedCategory === category.name ? "default" : "secondary"
                }
                className="p-[6px] text-nowrap"
              >
                {category.name}
              </Badge>
            </div>
          );
        })}
      </div>
      {true ? (
        <div
          className="hover:bg-slate-50 hover:rounded-full p-2"
          onClick={() => onScroll("right")}
        >
          <ChevronRight className="size-4" />
        </div>
      ) : null}
    </div>
  );
};

export default CategoryCarousel;
