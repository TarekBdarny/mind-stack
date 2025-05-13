"use client";
import { getAuthUser } from "@/actions/user.action";
import React from "react";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/date";
type User = {
  username: string;
  image: string | null;
  name: string | null;
  id: string;
};
type CommentProps = {
  commenter: User;
  content: string;
  createdAt: Date;
};
const Comment = ({ commenter, content, createdAt }: CommentProps) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Link href={`/profile/${commenter.username}`} passHref>
            <Avatar className="size-10 sm:size-12 border-2 border-transparent hover:border-primary transition-colors">
              <AvatarImage
                src={commenter.image || "default_image.png"}
                alt={commenter.username}
              />
              <AvatarFallback>
                {commenter.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex space-x-2 items-center">
            <p className="font-medium">{commenter.name}</p>
            <span className="text-sm text-muted-foreground">
              @{commenter.username}
            </span>
            <p className="text-xs text-muted-foreground">
              {formatRelativeTime(new Date(createdAt))}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 px-2">
        <p className="break-all">{content}</p>
      </div>
      <div className=" not-last:text-red-400">
        <Separator className="my-4" />
      </div>
    </div>
  );
};

export default Comment;
