"use client";

import { useState } from "react";
import { CategorySection } from "../sections/category-section";
import VideosHomeFeedSection from "../sections/videos-home-feed-section";

export const HomeView = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  return (
    <div className="max-w-[1440px] select-none overflow-hidden w-[100%] mx-auto">
      <CategorySection
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
      <VideosHomeFeedSection selectedCategory={selectedCategory} />
    </div>
  );
};
