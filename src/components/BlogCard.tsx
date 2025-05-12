"use client";

import {
  createComment,
  getAllBlogs,
  toggleLike,
  toggleSave,
} from "@/actions/blog.action";
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatRelativeTime } from "@/lib/date"; // Changed to use formatRelativeTime
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import DeleteButton from "./DeleteButton";
import { Bookmark, Edit, Heart, MessageCircleCodeIcon } from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import CommentBox from "./CommentBox";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";

type Blogs = Awaited<ReturnType<typeof getAllBlogs>>;
type Blog = Blogs[number];

const BlogCard = ({
  blog,
  dbUserId,
}: {
  blog: Blog;
  dbUserId: string | null;
}) => {
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(
    blog.saved.some((save) => save.userId === dbUserId)
  );
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    blog.likes.some((like) => like.userId === dbUserId)
  );
  const [optimisticLikes, setOptmisticLikes] = useState(blog._count.likes);
  const [showComments, setShowComments] = useState(false);

  if (!blog || !blog.content) return null;

  const authorName = blog.author.name || blog.author.username;
  const authorUsername = blog.author.username || blog.author.name;
  const authorImage = blog.author.image ?? "/default_image.png";
  // Assuming blog.id exists for the "Read More" link
  const blogLink = `/blog/${blog.id}`; // You might need to adjust this path
  const handleLike = async () => {
    if (isLiking || !user) return;
    try {
      setIsLiking(true);
      setHasLiked(!hasLiked);
      setOptmisticLikes((prev) => (hasLiked ? prev - 1 : prev + 1));
      await toggleLike(blog.id);
    } catch (error) {
      console.log(error);
      setOptmisticLikes(blog._count.likes);
      setHasLiked(blog.likes.some((like) => like.userId === dbUserId));
    } finally {
      setIsLiking(false);
    }
  };
  const handleComment = async () => {
    if (isCommenting) return;
    try {
      setIsCommenting(true);
      if (newComment.trim() === "") {
        toast.error("Please write a comment");
        return;
      }
      const res = await createComment(blog.id, newComment);
      if (!res.success) {
        toast.error("Failed to create comment");
        return;
      }
      setNewComment("");
      toast.success("Comment created successfully");
      setIsCommenting(false);
    } catch (error) {
      toast.error("Failed to create comment");
      console.log("Error in handleComment", error);
    } finally {
      setIsCommenting(false);
    }
  };
  const handleSave = async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      const res = await toggleSave(blog.id);
      if (res.success) {
        setIsSaved((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to save blog");
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <Card className="w-full flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-background">
      <CardHeader className="px-2 sm:px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href={`/profile/${authorUsername}`} passHref>
              <Avatar className="size-10 sm:size-12 border-2 border-transparent hover:border-primary transition-colors">
                <AvatarImage src={authorImage} alt={authorName} />
                <AvatarFallback>
                  {authorName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>

            <div>
              <Link href={`/profile/${authorUsername}`} passHref>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:underline">
                  {authorName}
                </p>
              </Link>
              <p className="text-xs text-muted-foreground">@{authorUsername}</p>
            </div>
          </div>
          {user?.id === blog.author.clerkId && (
            <div>
              <Link href={`/blog/edit/${blog.id}`} passHref>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-primary duration-100 cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit Button</span>
                </Button>
              </Link>
              <DeleteButton blogId={blog.id} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <Link href={blogLink} passHref>
          <h1 className="mb-5 line-clamp-1 break-words">{blog.title}</h1>
        </Link>
        <div
          className="prose dark:prose-invert line-clamp-3 "
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </CardContent>

      <Separator />
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          <div>
            <ProtectedButton user={user !== null}>
              <Button
                variant={"ghost"}
                className="cursor-pointer"
                onClick={handleLike}
              >
                <Heart
                  className={`${hasLiked ? "fill-red-400" : "fill-background"}`}
                />
                <span className="text-sm">{optimisticLikes}</span>
              </Button>
            </ProtectedButton>
            <Button
              variant={"ghost"}
              className="cursor-pointer"
              onClick={() => setShowComments((prev) => !prev)}
            >
              {showComments ? (
                <MessageCircleCodeIcon className="fill-indigo-400" />
              ) : (
                <MessageCircleCodeIcon />
              )}
              <span className="text-sm">{blog._count.comments}</span>
            </Button>
            <ProtectedButton user={user !== null}>
              <Button
                variant={"ghost"}
                disabled={isSaving}
                onClick={handleSave}
                className="cursor-pointer"
              >
                {isSaved ? <Bookmark className="fill-primary" /> : <Bookmark />}
              </Button>
            </ProtectedButton>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {formatRelativeTime(new Date(blog.createdAt))}
            </p>
          </div>
        </div>
      </CardFooter>
      {showComments && (
        <div className="flex w-full flex-col justify-between px-4 sm:px-6  gap-4">
          {/* ALL COMMENTS */}
          <div>
            {blog._count.comments === 0 ? (
              <p>No Comments yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                <ScrollArea className="h-56 w-full">
                  {blog.comments.map((comment, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Link
                            href={`/profile/${comment.commenter.username}`}
                            passHref
                          >
                            <Avatar className="size-10 sm:size-12 border-2 border-transparent hover:border-primary transition-colors">
                              <AvatarImage
                                src={
                                  comment.commenter.image || "default_image.png"
                                }
                                alt={comment.commenter.username}
                              />
                              <AvatarFallback>
                                {comment.commenter.username
                                  .charAt(0)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </Link>
                          <div className="flex space-x-2 items-center">
                            <p className="font-medium">
                              {comment.commenter.name}
                            </p>
                            <span className="text-sm text-muted-foreground">
                              @{comment.commenter.username}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              {formatRelativeTime(new Date(comment.createdAt))}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 px-2">
                        <p className="break-words">{comment.content}</p>
                      </div>
                      <div className=" not-last:text-red-400">
                        <Separator className="my-4" />
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            )}
          </div>
          {/* WRITE A COMMENT */}
          <div className="w-full">
            <CommentBox
              content={newComment}
              isCommenting={isCommenting}
              handleComment={handleComment}
              setNewComment={setNewComment}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default BlogCard;

{
  /* <CardFooter className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          {formatRelativeTime(new Date(blog.createdAt))}
        </p>
        <Link href={blogLink} passHref>
          <Button
            variant="link"
            size="sm"
            className="text-primary cursor-pointer"
          >
            Read More
          </Button>
        </Link>
      </CardFooter> */
}
const ProtectedButton = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: boolean; // Replace with the correct type for your user object
}) => {
  return user ? (
    <>{children}</>
  ) : (
    <SignInButton mode="modal">{children}</SignInButton>
  );
};
