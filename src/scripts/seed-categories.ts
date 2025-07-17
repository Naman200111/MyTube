// script to seed categories inside the categories table

import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames = [
  "Vehicles",
  "Comedy",
  "Education",
  "Gaming",
  "Entertainment",
  "Films and Animations",
  "How to style",
  "Music",
  "News and Politics",
  "People and blogs",
  "Pets and Animals",
  "Science and Technology",
  "Sports",
  "Travel and events",
];

async function seedCategories() {
  try {
    console.log("Seeding categories...");
    const categoriesObjects = categoryNames.map((category) => {
      return {
        name: category,
        description: `Videos which fall under category: ${category}`,
      };
    });

    await db.insert(categories).values(categoriesObjects);
    console.log("Categories seeding successful");
  } catch (error) {
    console.log("Error seeding categories...", error);
  }
}

seedCategories();
