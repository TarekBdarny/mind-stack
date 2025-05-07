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

const MobileNavbar = () => {
  const [mounted, setMounted] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1023px)" });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isTabletOrMobile) return null;
  return (
    isTabletOrMobile && (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <span className="sr-only">Open menu</span>
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[350px]">
          <SheetHeader>
            <SheetTitle>Mind Stack</SheetTitle>
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
              <MobileNavbarDropdown />
            </SignedIn>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  );
};

export default MobileNavbar;
