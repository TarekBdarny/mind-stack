import { UserProps } from "@/app/profile/[username]/page";
import { formatMemberSince } from "@/lib/date";
import { MapPin, Notebook, ShieldCheck, UserRound } from "lucide-react";
import React from "react";
import { Separator } from "./ui/separator";

const ProfilePageSidebar = ({ user }: UserProps) => {
  return (
    <div className="w-full sm:w-[300px] sm:flex-shrink-0 border rounded-md h-fit  px-6 py-8 flex flex-col gap-6 ">
      <p className="text-lg">
        About
        <span className="text-primary"> {user.name}</span>
      </p>
      <Separator />
      <p className="flex gap-2">
        <UserRound />@{user.username}
      </p>

      <div className="flex gap-2 items-center ">
        <Notebook />
        <p className="  ">{user?.bio || "No bio yet"}</p>
      </div>
      <div className="flex gap-2 items-center ">
        <MapPin />
        <p className="  ">{user?.location || "No location yet"}</p>
      </div>
      <div className="flex gap-2 items-center ">
        <ShieldCheck />
        <p className=" text-sm">{formatMemberSince(user.createdAt)}</p>
      </div>
    </div>
  );
};

export default ProfilePageSidebar;
{
}
