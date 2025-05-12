import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pen } from "lucide-react";
import Image from "next/image";
import React from "react";
import { UserProps } from "./page";
import { getAuthUser } from "@/actions/user.action";

const ProfileUI = async ({ user }: UserProps) => {
  const authUser = await getAuthUser();
  const isOwnProfile = authUser?.id === user.id;

  return (
    <section className="max-w-7xl mx-auto px-4 mb-2  ">
      {/* USER IMAGE */}
      <div className="flex flex-col gap-20 sm:relative sm:h-[400px] ">
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
            className="rounded-full border-2 border-background  absolute -bottom-20 left-1/2 -translate-x-1/2 sm:left-4 sm:-translate-x-0"
            src={user?.image || "default_image.png"}
            alt={user.username}
            width={150}
            height={150}
          />
        </div>
        {/* USER DATA : USERNAME NAME ... */}
        <div className=" flex flex-col sm:flex-row justify-between items-center px-2 sm:px-4 w-full sm:w-3/4 mx-auto py-4 sm:absolute sm:-bottom-20 mb-18 sm:left-[63%] md:left-3/5 lg:left-[53%] sm:-translate-x-1/2  ">
          <div className="flex flex-col gap-2 justify-center items-center sm:items-start ">
            <h1>{user.name}</h1>
            <p>{user._count.blogs} Blogs</p>
          </div>
          {isOwnProfile && (
            <div className=" mt-4">
              <Button>
                <Pen />
                Edit profile
              </Button>
            </div>
          )}
        </div>
      </div>
      <Separator />
      {/* USER BIO */}
    </section>
  );
};

export default ProfileUI;
