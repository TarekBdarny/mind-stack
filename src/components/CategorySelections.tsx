import React from "react";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { getMostCommonCategories } from "@/actions/blog.action";

const CategorySelections = async () => {
  const categories = await getMostCommonCategories();

  return (
    <ScrollArea className="max-w-7xl py-3 mx-auto  whitespace-nowrap rounded-md ">
      <div className="px-4">
        <ul className="flex gap-4 lg:gap-5.5">
          {categories.map((category) => (
            <li key={category}>
              <Link href={`/blog/${category}`} className="">
                <Badge
                  variant={"outline"}
                  className={`p-4 min-w-[100px] rounded-lg hover:bg-primary-foreground/80`}
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
