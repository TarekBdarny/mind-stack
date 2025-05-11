import { getAllBlogs } from "@/actions/blog.action";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatRelativeTime } from "@/lib/date"; // Changed to use formatRelativeTime
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { currentUser, User } from "@clerk/nextjs/server";
import DeleteButton from "./DeleteButton";
import { Bookmark, Edit, Heart, MessageCircleCodeIcon } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

type Blogs = Awaited<ReturnType<typeof getAllBlogs>>;
type Blog = Blogs[number];

const BlogCard = async ({ blog }: { blog: Blog }) => {
  if (!blog || !blog.content) return null;
  const user = await currentUser();
  console.log(user?.id, blog.author.clerkId);
  const authorName = blog.author.name || blog.author.username;
  const authorUsername = blog.author.username || blog.author.name;
  const authorImage = blog.author.image ?? "/default_image.png";
  // Assuming blog.id exists for the "Read More" link
  const blogLink = `/blog/${blog.id}`; // You might need to adjust this path

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-background">
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
          <h1 className="mb-5 line-clamp-1">{blog.title}</h1>
        </Link>
        <div
          className="prose dark:prose-invert max-w-none line-clamp-3 "
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </CardContent>

      <Separator />
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          <div>
            {user ? (
              <>
                <Button variant={"ghost"} className="cursor-pointer">
                  <Heart />
                  <span className="text-sm">10</span>
                </Button>
                <Button variant={"ghost"} className="cursor-pointer">
                  <MessageCircleCodeIcon />
                  <span className="text-sm">5</span>
                </Button>

                <Button variant={"ghost"} className="cursor-pointer">
                  <Bookmark />
                </Button>
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant={"ghost"} className="cursor-pointer">
                    <Heart />
                    <span className="text-sm">10</span>
                  </Button>
                </SignInButton>
                <Button variant={"ghost"} className="cursor-pointer">
                  <MessageCircleCodeIcon />
                  <span className="text-sm">5</span>
                </Button>
                <SignInButton mode="modal">
                  <Button variant={"ghost"} className="cursor-pointer">
                    <Bookmark />
                  </Button>
                </SignInButton>
              </>
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {formatRelativeTime(new Date(blog.createdAt))}
            </p>
          </div>
        </div>
      </CardFooter>
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
const ProtectActionButton = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) => {
  return !user ? (
    <SignInButton mode="modal">{children}</SignInButton>
  ) : (
    {
      children,
    }
  );
};
