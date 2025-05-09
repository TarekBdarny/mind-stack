"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";

const PostBlogButton = () => {
  const [BlogData, setBlogData] = useState<string | null>(
    localStorage.getItem("draft")
  );
  const handleClick = (e) => {
    e.preventDefault();
    console.log(BlogData?.length);
  };

  return (
    <div className="sticky top-20 h-screen">
      <Button
        type="submit"
        className="w-full cursor-pointer hover:-translate-y-1 transition-all duration-300"
        size={"drop"}
        onClick={(e) => handleClick(e)}
      >
        Post
      </Button>
    </div>
  );
};

export default PostBlogButton;
