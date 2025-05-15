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
import { formatRelativeTime, getFormattedBlogDate } from "@/lib/date"; // Changed to use formatRelativeTime
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import DeleteButton from "./DeleteButton";
import { Bookmark, Edit, Heart, MessageCircleCodeIcon } from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import CommentBox from "./Comments/CommentBox";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

import Comment from "./Comments/Comment";
import CommentsSheet from "./Comments/CommentsSheet";
import FollowButton from "./FollowButton";

type Blogs = Awaited<ReturnType<typeof getAllBlogs>>;
export type Blog = Blogs[number];

type BlogProps = {
  blog: Blog;
  dbUserId: string | null;
  use?: string | "group";
};

const BlogCard = ({ blog, dbUserId, use }: BlogProps) => {
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
  if (use === "separate")
    return (
      <SeparateBlog blog={blog} user={user as { id: string } | null}>
        <div className="flex items-center justify-between w-full  max-w-3/4">
          <div className="">
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
        </div>

        <Separator />
        <CommentsSheet
          showComments={showComments}
          setShowComments={setShowComments}
          newComment={newComment}
          handleComment={handleComment}
          isCommenting={isCommenting}
          setNewComment={setNewComment}
          blog={blog}
        />
      </SeparateBlog>
    );
  return (
    <Card className=" flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-background">
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
                    <Comment
                      key={index}
                      commenter={comment.commenter}
                      content={comment.content}
                      createdAt={comment.createdAt}
                    />
                  ))}
                </ScrollArea>
              </div>
            )}
          </div>
          {/* WRITE A COMMENT */}
          <div className="w-full">
            <CommentBox
              use={use}
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
export const ProtectedButton = ({
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

const SeparateBlog = ({
  blog,
  children,
  user,
}: {
  blog: Blog;
  children: React.ReactNode;
  user: {
    id: string;
  } | null;
}) => {
  return (
    <section className="min-w-full max-w-3/4 mx-auto  sm:px-10">
      <div className="flex flex-col gap-4 lg:*:ml-20">
        <div className="flex gap-4">
          <Badge variant={"outline"} className=" w-24 p-2">
            {blog?.categories}
          </Badge>

          <Badge variant={"outline"} className=" w-24 p-2">
            New
          </Badge>
        </div>
        {/* TItle and user info */}
        <div className="w-full">
          <h1 className=" break-words mt-2 mb-5 pr-10 ">{blog?.title}</h1>
          <div className="flex items-center gap-4 mb-4 ">
            <Avatar>
              <AvatarImage src={blog?.author.image || "/default_image.png"} />
              <AvatarFallback>
                {blog?.author.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Link href={`/profile/${blog?.author.username}/blogs`}>
              <p className="hover:underline">{blog?.author.name}</p>
            </Link>
            {user?.id === blog?.author.clerkId ? (
              <Badge
                variant={"outline"}
                className="text-muted-foreground px-4 py-2"
              >
                You
              </Badge>
            ) : (
              <FollowButton targetId={blog?.author.id} />
            )}
            <p className="text-muted-foreground">
              {getFormattedBlogDate(blog?.createdAt)}
            </p>
          </div>
          <Separator />
          {/* Likes Comment save section */}
        </div>
        {children}
        <div
          className="prose dark:prose-invert break-words mt-5"
          dangerouslySetInnerHTML={{
            __html: blog.content || <h1>NO CONTENT</h1>,
          }}
        />
      </div>
    </section>
  );
};
