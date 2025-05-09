"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";
import { redirect } from "next/dist/server/api-utils";

export const createBlog = async (
  content: string | null,
  images: string = ""
) => {
  try {
    if (!content) return { success: false, message: "No content provided" };
    console.log(content);
    const userId = await getDbUserId();
    if (!userId) return { success: false, message: "Unauthenticated" };

    const newBlog = await prisma.blog.create({
      data: {
        content,
        authorId: userId,
        images,
      },
    });
    revalidatePath("/");

    return { success: true, blog: newBlog };
  } catch (error) {
    console.log("error in create blog action", error);
  }
};
