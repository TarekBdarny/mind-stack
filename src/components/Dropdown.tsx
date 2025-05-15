import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Compass } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { getMostCommonCategories } from "@/actions/blog.action";

import { useUser } from "@clerk/nextjs";
// import { Dispatch, SetStateAction } from "react";

export type Categories = Awaited<ReturnType<typeof getMostCommonCategories>>;
const Dropdown = ({
  categories,
}: // setOpen,
{
  categories: Categories;
  // setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user } = useUser();
  console.log(user);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"lg"}>
          <Compass />
          Explore
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" sideOffset={10}>
        <DropdownMenuLabel>Popular Topics</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {categories.map((category, index) => (
            <Link key={index} href={`/blog/${category}`}>
              <DropdownMenuItem>
                <Badge variant={"outline"}>{category}</Badge>
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
