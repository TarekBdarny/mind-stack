"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { getSearchedBlogs } from "@/actions/blog.action";
import { Label } from "../ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/date";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
type Blogs = Awaited<ReturnType<typeof getSearchedBlogs>>;
const SearchInput = () => {
  const [inputValue, setInputValue] = useState("");
  const [blogs, setBlogs] = useState<Blogs>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const fetchBlogs = async () => {
      if (inputValue.trim() === "") {
        setBlogs([]);
        return;
      }
      setIsSearching(true);
      const res = await getSearchedBlogs(inputValue);
      setBlogs(res);
      setIsSearching(false);
    };
    fetchBlogs();
  }, [inputValue]);

  useEffect(() => {
    console.log(blogs);
  }, [blogs]);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className=" flex cursor-pointer w-full lg:w-fit "
          variant={"outline"}
        >
          <div className="flex items-center gap-2 ">
            <Search />
            Search Blogs
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[500px]">
        <DialogHeader className="absolute rounded-lg  top-0 w-full bg-background">
          <DialogTitle className="">
            <div className="relative ">
              <Input
                className="px-9 h-12 border-none rounded-lg outline-none   focus-visible:ring-0
                
                "
                autoComplete="off"
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
                id="search-input"
                placeholder="Search Anything"
              />
              <Label
                htmlFor="search-input"
                className="absolute top-1/2 -translate-y-1/2 left-2 "
              >
                <Search size={20} />
              </Label>
              <Separator />
            </div>
          </DialogTitle>
          <DialogDescription className="px-4">
            Search blogs via title, category or content
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="overflow-x-hidden pr-4 -z-50 ">
          {isSearching ? (
            <h1>loading /./</h1>
          ) : (
            <div className=" translate-y-16 ">
              {blogs?.length === 0 && inputValue.trim() !== "" && (
                <p className="text-2xl ">No Blogs Found</p>
              )}
              {blogs?.map((blog, index) => (
                <div key={index} onClick={() => setIsOpen((prev) => !prev)}>
                  <SearchBlog key={index} blog={blog} />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SearchInput;

type Blog = Blogs[number];
const SearchBlog = ({ blog }: { blog: Blog }) => {
  return (
    <div className="flex flex-col gap-4 w-full ">
      <div>
        {/* user image name */}
        <div className="flex items-center justify-between gap-4 mb-3 w-full">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={blog?.author.image || "/default_image.png"} />
              <AvatarFallback>
                {blog?.author.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Link href={`/profile/${blog?.author.username}/blogs`}>
              <p className="font-semibold hover:underline">
                {blog?.author.name}
              </p>
            </Link>
          </div>
          <div>
            <p className="text-foreground">
              {formatRelativeTime(new Date(blog?.createdAt))}
            </p>
          </div>
        </div>
        <div className="">
          <Link href={`/blog/${blog?.id}`}>
            <h1 className="break-all line-clamp-1 text-xl ">{blog?.title}</h1>
          </Link>

          <Badge className="mt-3">
            <Link href={`/blog/${blog?.categories}`}>{blog?.categories}</Link>
          </Badge>
        </div>
        <Separator className="my-5" />
      </div>
    </div>
  );
};
