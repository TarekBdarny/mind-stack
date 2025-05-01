import { Button } from "../ui/button";
import { Bell, Edit } from "lucide-react";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Dropdown from "../Dropdown";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";

export const NavbarItems = ({ mobile }: { mobile?: boolean }) => {
  return (
    <ul className={` gap-6 flex ${mobile && "flex-col"}`}>
      <Dropdown />
      <Link href={"/write"} className="flex ">
        <Button
          size={"lg"}
          variant={"outline"}
          className={`cursor-pointer ${mobile && "w-full"} text-primary`}
        >
          <Edit />
          Write
        </Button>
      </Link>
      <ThemeToggle />
      <Link href={"/notifications"} className="flex ">
        <Button size={"icon"} variant={"ghost"} className="cursor-pointer">
          <Bell />
          <span className="sr-only">Notifications</span>
        </Button>
      </Link>

      <SignedOut>
        <Button variant={"outline"} className="text-primary cursor-pointer ">
          <SignInButton />
        </Button>
        <Button
          variant={"outline"}
          className="hover:text-primary cursor-pointer"
        >
          <SignUpButton />
        </Button>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </ul>
  );
};
