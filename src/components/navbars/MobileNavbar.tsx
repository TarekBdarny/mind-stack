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

const MobileNavbar = () => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1023px)" });

  return (
    isTabletOrMobile && (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
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
            <MobileNavbarDropdown />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  );
};

export default MobileNavbar;
