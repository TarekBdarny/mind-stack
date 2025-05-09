import { Search } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Poppins } from "next/font/google";
import { NavbarItems } from "./NavbarItems";
import MobileNavbar from "./MobileNavbar";
import { registerUserToDB } from "@/actions/user.action";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const Navbar = async () => {
  const user = await currentUser();

  if (user) registerUserToDB();
  return (
    <header className="max-w-7xl mx-auto px-4 py-4 sticky top-0 z-50 bg-background ">
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
              className="w-[250px] lg:w-[400px] py-2 px-4 outline-none"
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
      <Separator className="mt-4" />
    </header>
  );
};

export default Navbar;
