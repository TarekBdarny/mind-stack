"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";

export const createBlog = async (
  content: string | null,
  category: string,
  title: string = "",
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
        title: title,
        categories: category,
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
export const getAllBlogs = async () => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            clerkId: true,
            image: true,
          },
        },
        comments: {
          include: {
            commenter: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
    return blogs;
  } catch (error) {
    console.log("Error in getAllBlogs", error);
    throw new Error("Failed to fetch blogs");
  }
};
