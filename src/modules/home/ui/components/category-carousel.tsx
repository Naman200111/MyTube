"use client";

import { Badge } from "@/components/ui/badge";
import { useRef, useState } from "react";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

type categoryContent = {
  id: string;
  name: string;
  desc?: string;
};

type categoryCarouselProps = {
  categories: categoryContent[];
};

const CategoryCarousel = ({ categories }: categoryCarouselProps) => {
  // improvements => conditionally render left and right scroll arrows
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(-1);
  const onScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -width : width,
        behavior: "smooth",
      });
    }
  };

  const onSelectCategory = (idx: number) => {
    setSelectedCategoryId(idx);
  };

  return (
    // <Carousel
    // >
    //   <CarouselContent className="-ml-4">
    //     <CarouselItem className="pl-4 basis-auto">
    //       <Badge variant="secondary" className="p-[6px]">
    //         All
    //       </Badge>
    //     </CarouselItem>
    //     {categories.map((category: categoryContent, idx) => (
    //       <CarouselItem key={idx} className="pl-4 basis-auto">
    //         <Badge variant="secondary" className="p-[6px]">
    //           {category.name}
    //         </Badge>
    //       </CarouselItem>
    //     ))}
    //   </CarouselContent>
    //   <CarouselPrevious />
    //   <CarouselNext />
    // </Carousel>

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
          variant={selectedCategoryId === -1 ? "default" : "secondary"}
          className="p-[6px]"
          onClick={() => onSelectCategory(-1)}
        >
          All
        </Badge>
        {categories.map((category: categoryContent, idx: number) => {
          return (
            <div key={idx} onClick={() => onSelectCategory(idx)}>
              <Badge
                variant={selectedCategoryId === idx ? "default" : "secondary"}
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
