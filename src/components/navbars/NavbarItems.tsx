"use client";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Dropdown, { Categories } from "../Dropdown";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import { getMostCommonCategories } from "@/actions/blog.action";
import { useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import { ProtectedButton } from "../BlogCard";

export const NavbarItems = ({ mobile }: { mobile?: boolean }) => {
  const [categories, setCategories] = useState<Categories>([]);
  const { user } = useUser();
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
      <ProtectedButton user={user !== null}>
        <Link href={`${user === null ? "/" : "/write"}`} className="flex ">
          <Button
            size={"lg"}
            variant={"outline"}
            className={`cursor-pointer ${mobile && "w-full"} text-primary`}
          >
            <Edit />
            Write
          </Button>
        </Link>
      </ProtectedButton>

      <div className="">
        <SearchInput />
      </div>
      {!mobile && <ThemeToggle />}

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
