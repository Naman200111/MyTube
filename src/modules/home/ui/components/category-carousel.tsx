import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type categoryContent = {
  id: string;
  name: string;
  desc?: string;
};

type categoryCarouselProps = {
  categories: categoryContent[];
};

const CategoryCarousel = ({ categories }: categoryCarouselProps) => {
  return (
    <Carousel
    // opts={{
    //   align: "start",
    //   loop: true,
    // }}
    >
      <CarouselContent className="-ml-4">
        <CarouselItem className="pl-4 basis-auto">
          <Badge variant="secondary" className="p-[6px]">
            All
          </Badge>
        </CarouselItem>
        {categories.map((category: categoryContent, idx) => (
          <CarouselItem key={idx} className="pl-4 basis-auto">
            <Badge variant="secondary" className="p-[6px]">
              {category.name}
            </Badge>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default CategoryCarousel;
