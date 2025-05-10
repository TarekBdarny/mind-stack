"use client";
import React, { useState } from "react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";

import { createBlog } from "@/actions/blog.action";
import { toast } from "sonner";
import { dateFormat } from "@/lib/date";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { ArrowRightFromLine, Send } from "lucide-react";

const PostBlogButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async (category: string) => {
    setLoading(true);
    console.log(category);
    const data = localStorage.getItem("draft");
    if (!data || data === "") {
      toast("No blog data found");
      setLoading(false);
      return;
    }
    const { content, title } = JSON.parse(data);
    if (title.trim() === "") {
      toast("Title is required");
      setLoading(false);
      return;
    }
    try {
      const result = await createBlog(content, category, title);
      if (result?.success) {
        toast("Blog has been created", {
          description: dateFormat(new Date()),
        });
        localStorage.setItem("draft", "");
        router.push("/");
      }
    } catch (error) {
      toast("failed to create blog");
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky bottom-5  ">
      <PostBlogTitle loading={loading} handleCLick={handleClick} />
    </div>
  );
};
type PostBlogCategoryProps = {
  loading: boolean;
  handleCLick: (category: string) => void;
};
const PostBlogTitle = ({ loading, handleCLick }: PostBlogCategoryProps) => {
  const [category, setCategory] = useState("");
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="cursor-pointer w-full" type="button">
          Continue
          <ArrowRightFromLine />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add a category to the Blog.</AlertDialogTitle>
          <AlertDialogDescription>
            Add a category to the blog to make it easier for users to find your
            blog.
            <Input
              className="my-5"
              placeholder="Enter A Category"
              onChange={(e) => setCategory(e.target.value)}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer"
            disabled={loading}
            onClick={() => handleCLick(category)}
          >
            {loading ? (
              "Loading..."
            ) : (
              <>
                <p>Post</p> <Send />
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default PostBlogButton;
