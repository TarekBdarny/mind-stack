import { UserProps } from "@/app/profile/[username]/page";
import { formatMemberSince } from "@/lib/date";
import {
  MapPin,
  Notebook,
  ShieldCheck,
  UserRound,
  UserRoundCheck,
  Users,
} from "lucide-react";
import React from "react";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  getDbUserId,
  getFollowers,
  getFollowing,
  getUserByUsername,
  isFollowing,
} from "@/actions/user.action";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import FollowButton from "./FollowButton";
import Link from "next/link";

type User = Awaited<ReturnType<typeof getUserByUsername>>;
type Array = Awaited<ReturnType<typeof getFollowers>>;
type Follower = {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
};
const ProfilePageSidebar = async ({ user }: UserProps) => {
  const [followers, followings] = await Promise.all([
    getFollowers(user.id),
    getFollowing(user.id),
  ]);
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
      <FollowingFollowersDialog
        array={followings}
        user={user}
        use="following"
      />
      <FollowingFollowersDialog array={followers} user={user} use="followers" />
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

const FollowCard = async ({ follower }: { follower: Follower }) => {
  const following = await isFollowing(follower.id);
  const dbUserId = await getDbUserId();
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <Avatar className="size-10">
          <AvatarImage
            src={follower?.image || "/default_image.png"}
            alt="Profile image"
          />
          <AvatarFallback>
            {follower?.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <Link
            href={`/profile/${follower.username}`}
            className="hover:underline"
          >
            {follower.name}
          </Link>
          <p className="text-muted-foreground">@{follower.username}</p>
        </div>
      </div>
      {dbUserId === follower.id ? (
        <p className="text-muted-foreground">You</p>
      ) : (
        <FollowButton targetId={follower.id} following={following} />
      )}
    </div>
  );
};
const FollowingFollowersDialog = ({
  array,
  user,
  use,
}: {
  array: Array;
  user: User;
  use: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="cursor-pointer">
          {use === "following" ? (
            <p className="flex items-center gap-2">
              <Users />
              Following {user?._count.following}{" "}
            </p>
          ) : (
            <p className="flex items-center gap-2">
              <UserRoundCheck />
              Followers {user?._count.followers}{" "}
            </p>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {user?.name} {use === "following" ? "Followings" : "Followers"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {array?.length !== 0 ? (
            array?.map((follower) => (
              <FollowCard key={follower.id} follower={follower} />
            ))
          ) : use === "following" ? (
            <p>{user?.name} is not following anyone.</p>
          ) : (
            <p>{user?.name} has no followers.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
