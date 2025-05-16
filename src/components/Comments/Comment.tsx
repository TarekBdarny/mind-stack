"use client";

import React, { useState } from "react";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/date";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Trash } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { deleteComment } from "@/actions/blog.action";
import { toast } from "sonner";
type User = {
  username: string;
  image: string | null;
  name: string | null;
  id: string;
  clerkId: string;
};
type CommentProps = {
  commenter: User;
  commentId: string;
  content: string;
  createdAt: Date;
};
const Comment = ({
  commenter,
  content,
  createdAt,
  commentId,
}: CommentProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useUser();
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteComment(commentId);
      if (res?.success) {
        toast.success("Comment deleted successfully");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center gap-2">
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
            <div className="flex flex-col sm:flex-row space-x-2 items-center">
              <p className="font-medium">{commenter.name}</p>
              <span className="text-sm text-muted-foreground">
                @{commenter.username}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatRelativeTime(new Date(createdAt))}
            </p>
          </div>
          {user?.id === commenter.clerkId && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-destructive duration-100 cursor-pointer"
                >
                  <Trash />
                  <span className="sr-only">Delete Button</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your comment.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
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
