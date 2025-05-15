import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";

import { getRandomUsers } from "@/actions/user.action";
import FollowButton from "./FollowButton";

const WhoToFollow = async () => {
  const randomUsers = await getRandomUsers();
  return (
    <div className="flex flex-col gap-4 px-4">
      {randomUsers?.map((user, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Avatar>
              <AvatarImage
                src={user?.image || "/default_image.png"}
                alt="Profile image"
              />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <Link
                href={`/profile/${user?.username}`}
                className="hover:underline"
              >
                {user.name}
              </Link>

              <p className="text-muted-foreground">
                {user._count.followers} followers
              </p>
            </div>
          </div>
          <FollowButton targetId={user.id} />
        </div>
      ))}
    </div>
  );
};

export default WhoToFollow;
