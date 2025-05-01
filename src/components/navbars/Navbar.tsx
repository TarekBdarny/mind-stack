import { Search } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Poppins } from "next/font/google";
import { NavbarItems } from "./NavbarItems";
import MobileNavbar from "./MobileNavbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const Navbar = () => {
  return (
    <>
      <header className="py-4 px-2 md:px-4 xl:px-32 ">
        <nav className="flex items-center justify-between w-full">
          <div className="flex gap-4">
            <Link href={"/"}>
              <h1
                className={`text-2xl font-semibold flex gap-1 ${poppins.className}`}
              >
                Mind <p className="text-primary">Stack</p>
              </h1>
            </Link>
          </div>
          <div>
            <div className="flex items-center relative  ">
              <Input
                className="w-[400px] py-2 px-4 outline-none"
                placeholder="Search For Anything"
              />
              <label htmlFor="search-input" className="absolute right-2">
                <Search />
                <span className="sr-only">Search</span>
              </label>
            </div>
          </div>
          <div className="hidden lg:block">
            <NavbarItems />
          </div>
          <div className="block lg:hidden">
            <MobileNavbar />
          </div>
        </nav>
      </header>
      <Separator className="" />
    </>
  );
};

export default Navbar;
