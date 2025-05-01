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

const Dropdown = () => {
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
          <Link href={"#"}>
            <DropdownMenuItem>
              <Badge variant={"outline"}>Programming</Badge>
            </DropdownMenuItem>
          </Link>
          <Link href={"#"}>
            <DropdownMenuItem>
              <Badge variant={"outline"}>Softwares</Badge>
            </DropdownMenuItem>
          </Link>
          <Link href={"#"}>
            <DropdownMenuItem>
              <Badge variant={"outline"}>Technology</Badge>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
