"use client";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LogIn, Send } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { getAuthUser } from "@/actions/user.action";
import { Skeleton } from "../ui/skeleton";
import { Textarea } from "../ui/textarea";

type User = Awaited<ReturnType<typeof getAuthUser>>;

type CommentProps = {
  content: string;
  handleComment: () => Promise<void>;
  setNewComment: Dispatch<SetStateAction<string>>;
  isCommenting: boolean;
  use?: string | "group";
};

const CommentBox = ({
  content,
  setNewComment,
  handleComment,
  use,
  isCommenting,
}: CommentProps) => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      const res: User = await getAuthUser();
      if (res) {
        setAuthUser(res);
      }
      setLoading(false);
    };
    getUser();
  }, []);
  if (loading) return <CommentBoxSkeleton />;

  return (
    <>
      {use === "group" && authUser && !loading ? (
        <div className="flex items-center">
          <Link href={`/profile/${authUser?.username}`} passHref>
            <Avatar className="size-10 sm:size-12 border-2 border-transparent hover:border-primary transition-colors">
              <AvatarImage
                src={authUser?.image || "default_image.png"}
                alt={"User Avatar"}
              />
              <AvatarFallback>
                {authUser?.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex w-full justify-between items-center ml-3">
            <Input
              placeholder="Write a comment..."
              type="text"
              className="flex-grow p-2 text-lg"
              value={content}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              onClick={handleComment}
              disabled={isCommenting}
              className="ml-2 text-white cursor-pointer"
            >
              {!isCommenting ? "Comment" : "Posting..."}
              <Send />
            </Button>
          </div>
        </div>
      ) : use === "separate" && authUser ? (
        <div className="flex flex-col gap-5">
          <div className="flex w-full gap-3 items-center">
            <Link href={`/profile/${authUser?.username}/blogs`} passHref>
              <Avatar className="size-10 sm:size-12 border-2 border-transparent hover:border-primary transition-colors">
                <AvatarImage
                  src={authUser?.image || "default_image.png"}
                  alt={"User Avatar"}
                />
                <AvatarFallback>
                  {authUser?.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <Link
              href={`/profile/${authUser?.username}/blogs`}
              className="text-lg hover:underline"
            >
              {authUser.name}
            </Link>
          </div>
          <div className="relative ">
            <Textarea
              value={content}
              className="w-full h-52 resize-none "
              maxLength={100}
              disabled={isCommenting}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={`What is in you mind ${authUser.name} !`}
            />
            <Button
              className="absolute right-4 bottom-2 hover:text-primary cursor-pointer hover:-translate-y-1"
              variant={"outline"}
              disabled={isCommenting}
              onClick={handleComment}
            >
              <Send />
              {isCommenting ? "Posting ... " : "Comment"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="">
          <Button
            asChild
            variant={"outline"}
            className="cursor-pointer"
            size={"lg"}
          >
            <SignInButton mode="modal">
              <div>
                Sign in to Comment
                <LogIn />
              </div>
            </SignInButton>
          </Button>
        </div>
      )}
    </>
  );
};

export default CommentBox;

const CommentBoxSkeleton = () => {
  return (
    <div className="flex items-center w-full">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex w-full justify-between items-center ml-3 gap-3">
        <Skeleton className="grow h-10" />
        <Skeleton className="w-28 h-10" />
      </div>
    </div>
  );
};
