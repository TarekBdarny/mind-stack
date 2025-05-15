import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";
import { UserProps } from "./page";
import { getAuthUser, isFollowing } from "@/actions/user.action";
import { UserDialog } from "@/components/EditUserDialog";
import FollowButton from "@/components/FollowButton";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const ProfileUI = async ({ user }: UserProps) => {
  const authUser = await getAuthUser();
  const following = await isFollowing(user.id);
  const isOwnProfile = authUser?.id === user.id;

  return (
    <section className="max-w-3/4 mx-auto px-4 mb-2  ">
      {/* USER IMAGE */}
      <div className="flex flex-col gap-20 xl:relative xl:h-[400px] ">
        <div className="relative">
          <Image
            src={"/gray.png"}
            alt="cover"
            className="rounded-lg"
            style={{ width: "100%", height: "300px", objectFit: "fill" }}
            width={100}
            height={100}
          />
          <Image
            className="rounded-full border-2 border-background  absolute -bottom-20 left-1/2 -translate-x-1/2 sm:left-4 sm:-translate-x-0 hidden xl:block"
            src={user?.image || "default_image.png"}
            alt={user.username}
            width={150}
            height={150}
          />
          <Image
            className="rounded-full border-2 border-background  absolute -bottom-15 left-1/2 -translate-x-1/2  block xl:hidden"
            src={user?.image || "default_image.png"}
            alt={user.username}
            width={120}
            height={120}
          />
        </div>
        {/* USER DATA : USERNAME NAME ... */}
        <div className=" flex flex-col lg:flex-row justify-between items-center px-2 sm:px-4 w-full lg:w-3/4 mx-auto py-4 xl:absolute xl:-bottom-20 mb-18 sm:left-[63%] xl:left-3/5 lg:left-[53%] xl:-translate-x-1/2  ">
          <div className="flex flex-col gap-2 justify-center items-center sm:items-start ">
            <h1>{user.name}</h1>
            <p>{user._count.blogs} Blogs</p>
          </div>
          {!authUser ? (
            <SignInButton mode="modal">
              <Button>Follow</Button>
            </SignInButton>
          ) : isOwnProfile ? (
            <UserDialog user={user} />
          ) : (
            <FollowButton targetId={user.id} following={following} />
          )}
        </div>
      </div>
      <Separator />
      {/* USER BIO */}
    </section>
  );
};

export default ProfileUI;
