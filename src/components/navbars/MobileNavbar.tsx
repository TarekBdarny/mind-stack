"use client";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { NavbarItems } from "./NavbarItems";
import MobileNavbarDropdown from "./MobileNavbarDropdown";
import { useMediaQuery } from "react-responsive";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getAuthUser } from "@/actions/user.action";

export type User = Awaited<ReturnType<typeof getAuthUser>>;
type TestUser = {
  _count: { blogs: number; followers: number; following: number };
  name: string | null;
  id: string;
  email: string;
  username: string;
  clerkId: string;
  bio: string | null;
  image: string | null;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
};
const MobileNavbar = () => {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<TestUser>();
  const [open, setOpen] = useState(false);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1023px)" });

  useEffect(() => {
    setMounted(true);
    const getUser = async () => {
      try {
        const res = await getAuthUser();
        setUser(res);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  if (!mounted || !isTabletOrMobile) return null;
  return (
    isTabletOrMobile && (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">
            <span className="sr-only">Open menu</span>
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[350px]">
          <SheetHeader>
            <SheetTitle>
              Mind <span className="text-primary">Stack</span>
            </SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 p-4">
            <NavbarItems mobile={true} />
          </div>
          {/* IMPLEMENT FOOTER THAT SHOWS USER PROFILE IMAGE AND DROPDOWN */}
          <SheetFooter>
            <SignedOut>
              <div className="flex flex-row flex-1 items-center gap-2 px-2">
                <Button variant={"outline"} className="flex-1/2 text-primary">
                  <SignInButton />
                </Button>
                <Button variant={"outline"} className="flex-1/2">
                  <SignUpButton />
                </Button>
              </div>
            </SignedOut>
            <SignedIn>
              <MobileNavbarDropdown user={user} setOpen={setOpen} />
            </SignedIn>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  );
};

export default MobileNavbar;
