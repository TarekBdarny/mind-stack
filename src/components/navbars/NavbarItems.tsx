"use client";
import { Button } from "../ui/button";
import { Bell, Edit } from "lucide-react";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Dropdown, { Categories } from "../Dropdown";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import { getMostCommonCategories } from "@/actions/blog.action";
import { useEffect, useState } from "react";

export const NavbarItems = ({ mobile }: { mobile?: boolean }) => {
  const [categories, setCategories] = useState<Categories>([]);
  // const categories = await getMostCommonCategories();
  useEffect(() => {
    const getCategories = async () => {
      const res = await getMostCommonCategories();
      setCategories(res);
    };
    getCategories();
  }, []);
  return (
    <ul className={` gap-6 flex ${mobile && "flex-col"}`}>
      <Dropdown categories={categories} />
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
      {!mobile && <ThemeToggle />}
      {!mobile && (
        <Link href={"/notifications"} className="flex ">
          <Button size={"icon"} variant={"ghost"} className="cursor-pointer">
            <Bell />
            <span className="sr-only">Notifications</span>
          </Button>
        </Link>
      )}
      {!mobile && (
        <>
          <SignedOut>
            <Button
              asChild
              variant={"outline"}
              className="text-primary cursor-pointer "
            >
              <SignInButton />
            </Button>
            <Button
              asChild
              variant={"outline"}
              className="hover:text-primary cursor-pointer"
            >
              <SignUpButton />
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </>
      )}
    </ul>
  );
};
