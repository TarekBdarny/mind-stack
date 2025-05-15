"use client";
import {
  ChevronsUpDown,
  CircleUser,
  FolderClosed,
  Heart,
  LogOut,
  Sparkles,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "../UserAvatar";
import { ThemeToggle } from "./ThemeToggle";
import { SignOutButton } from "@clerk/nextjs";
import { User } from "./MobileNavbar";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

const MobileNavbarDropdown = ({
  user,
  setOpen,
}: {
  user: User;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="p-4" variant={"outline"} size={"drop"}>
          <UserAvatar />
          <div className="flex flex-col items-start ml-2">
            <p>{user?.name}</p>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[320px] bg-">
        <DropdownMenuLabel className="flex">
          <UserAvatar />
          <div className="flex flex-col items-start ml-2">
            <p>{user?.name}</p>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Sparkles />
          <span>Upgrade to Hero</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Link
          href={`/profile/${user?.username}`}
          onClick={() => setOpen(false)}
        >
          <DropdownMenuItem>
            <CircleUser />
            Profile
          </DropdownMenuItem>
        </Link>
        <Link
          href={`/profile/${user?.username}/blogs`}
          onClick={() => setOpen(false)}
        >
          <DropdownMenuItem>
            <FolderClosed />
            <span>My Blogs</span>
          </DropdownMenuItem>
        </Link>
        <Link
          href={`/profile/${user?.username}/liked`}
          onClick={() => setOpen(false)}
        >
          <DropdownMenuItem>
            <Heart className="fill-destructive" />
            Liked
          </DropdownMenuItem>
        </Link>

        <Link
          href={`/profile/${user?.username}/saved`}
          onClick={() => setOpen(false)}
        >
          <DropdownMenuItem>
            <Star />
            Saved
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem>
          <ThemeToggle />
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          <LogOut />
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileNavbarDropdown;
