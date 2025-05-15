import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { Separator } from "../ui/separator";
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
    <header className="w-full lg:max-w-3/4 mx-auto pl-4 pr-6 py-4 sticky top-0 z-50 bg-background ">
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
