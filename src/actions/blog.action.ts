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
                clerkId: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        saved: {
          select: {
            blogId: true,
            userId: true,
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
export const deleteBlog = async (blogId: string) => {
  try {
    const userId = await getDbUserId();
    if (!userId) return { success: false, message: "Unauthenticated" };
    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
    });
    if (!blog) return { success: false, message: "Blog not found" };
    if (blog.authorId !== userId)
      return { success: false, message: "Unauthorized" };
    await prisma.blog.delete({
      where: {
        id: blogId,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Error in deleteBlog", error);
  }
};
export const getAllUserBlogs = async (userId: string) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        authorId: userId,
      },
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
        saved: {
          select: {
            blogId: true,
            userId: true,
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
    console.log("Error in getAllUserBlogs", error);
    throw new Error("Failed to fetch blogs");
  }
};
export const toggleLike = async (blogId: string) => {
  try {
    const userId = await getDbUserId();
    if (!userId) return { success: false, message: "Unauthenticated" };

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_blogId: {
          userId,
          blogId,
        },
      },
    });

    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
      select: {
        authorId: true,
      },
    });
    if (!blog) return { success: false, message: "Blog not found" };

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_blogId: {
            userId,
            blogId,
          },
        },
      });
    } else {
      await prisma.like.create({
        data: {
          userId,
          blogId,
        },
      });
    }
    revalidatePath("/");
    return { success: true, message: "Like toggled" };
  } catch (error) {
    console.log("Error in toggleLike", error);
    return { success: false, message: "Failed to toggle like" };
  }
};
export const createComment = async (blogId: string, content: string) => {
  try {
    const userId = await getDbUserId();
    if (!userId) return { success: false, message: "Unauthenticated" };
    if (!content) return { success: false, message: "No content provided" };

    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
    });
    if (!blog) return { success: false, message: "Blog not found" };
    const comment = await prisma.comment.create({
      data: {
        content,
        blogId,
        commenterId: userId,
      },
    });
    revalidatePath(`/blog/${blogId}`);
    return { success: true, comment };
  } catch (error) {
    console.log("Error in createComment", error);
    return { success: false, message: "Failed to create comment" };
  }
};
export const getAllComments = async (blogId: string) => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        blogId,
      },
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
    });
    return comments;
  } catch (error) {
    console.log("Error in getAllComments", error);
    return { success: false, message: "Failed to fetch comments" };
  }
};
export const toggleSave = async (blogId: string) => {
  try {
    const userId = await getDbUserId();
    if (!userId) return { success: false, message: "Unauthenticated" };

    const existingSave = await prisma.saved.findUnique({
      where: {
        userId_blogId: {
          userId,
          blogId,
        },
      },
    });

    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId,
      },
      select: {
        authorId: true,
      },
    });
    if (!blog) return { success: false, message: "Blog not found" };

    if (existingSave) {
      await prisma.saved.delete({
        where: {
          userId_blogId: {
            userId,
            blogId,
          },
        },
      });
    } else {
      await prisma.saved.create({
        data: {
          userId,
          blogId,
        },
      });
    }
    revalidatePath("/");
    return { success: true, message: "Saved toggled" };
  } catch (error) {
    console.log("Error in toggleSave", error);
    return { success: false, message: "Failed to toggle Save" };
  }
};
export const getBlogById = async (blogId: string) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id: blogId,
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
                clerkId: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        saved: {
          select: {
            blogId: true,
            userId: true,
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
    if (!blog) return;
    return blog;
  } catch (error) {
    console.log("Error in getBlogById", error);
  }
};

// TODO:
export const getBlogsByCategory = async (category: string) => {
  try {
    const blog = await prisma.blog.findMany({
      where: {
        categories: category,
      },
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
        saved: {
          select: {
            blogId: true,
            userId: true,
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
    return blog;
  } catch (error) {
    console.log("Error in getBlogByCategory", error);
  }
};

export const getMostCommonCategories = async () => {
  const result = await prisma.blog.groupBy({
    take: 15,
    by: ["categories"],

    _count: {
      categories: true,
    },
    orderBy: {
      _count: {
        categories: "desc",
      },
    },
  });

  return result.map((category) => category.categories);
};
export const getSearchedBlogs = async (value: string) => {
  try {
    if (value.trim() === "") return;
    const blogs = await prisma.blog.findMany({
      where: {
        OR: [
          {
            content: {
              contains: value,
            },
          },
          {
            title: {
              contains: value,
            },
          },
          {
            categories: {
              contains: value,
            },
          },
        ],
      },
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
        saved: {
          select: {
            blogId: true,
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
    console.log("error in getSearchedBlogs", error);
  }
};
export const deleteComment = async (commentId: string) => {
  try {
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Error in deleteComment", error);
  }
};
