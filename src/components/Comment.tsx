"use client";
import React from "react";
import { Comment as CommentType } from "@prisma/client";
const Comment = ({ comment }: CommentType) => {
  console.log();
  return <div>Comment</div>;
};

export default Comment;
