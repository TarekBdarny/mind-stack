import React from "react";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

const CategorySelections = () => {
  const categories = [
    "Software Engineer",
    "Computer Science",
    "Health",
    "Wealth",
    "Money Making",
    "Web Development",
    "Other",
  ];
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md ">
      <div className="w-full my-6 py-2 px-2 md:px-4 xl:px-16 2xl:px-32 ">
        <ul className="flex gap-4 lg:gap-7">
          {categories.map((category) => (
            <li key={category}>
              <Link href={"#"}>
                <Badge
                  variant={"outline"}
                  className="p-4 min-w-[100px] rounded-lg"
                >
                  {category}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default CategorySelections;
