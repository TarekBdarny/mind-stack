import {
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "../UserAvatar";
import { ThemeToggle } from "./ThemeToggle";
import { SignOutButton } from "@clerk/nextjs";
import { User } from "./MobileNavbar";

const MobileNavbarDropdown = ({ user }: { user: User }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="p-4" variant={"outline"} size={"drop"}>
          <UserAvatar />
          <div className="flex flex-col items-start ml-2">
            <p>{user?.name}</p>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          <ChevronsUpDown className="ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[320px] bg-">
        <DropdownMenuLabel className="flex">
          <UserAvatar />
          <div className="flex flex-col items-start ml-2">
            <p>{user?.name}</p>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <DropdownMenuItem>
            <Sparkles />
            <span>Upgrade to Hero</span>
          </DropdownMenuItem>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard />
          <span>Billing</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Bell />
          Notifications
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ThemeToggle />
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          <LogOut />
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileNavbarDropdown;
