import React from "react";
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

const MobileNavbar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Mind Stack</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 p-4">
          <NavbarItems mobile={true} />
        </div>
        {/* IMPLEMENT FOOTER THAT SHOWS USER PROFILE IMAGE AND DROPDOWN */}
        <SheetFooter>Hello</SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbar;
