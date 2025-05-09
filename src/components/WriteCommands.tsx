"use client";

import MenuBar from "@/app/write/menu-bar";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import HighLight from "@tiptap/extension-highlight";
import { useEffect, useState } from "react";
import PostBlogButton from "./PostBlogButton";
const Tiptap = () => {
  const [data, setData] = useState<string | null>(null);
  useEffect(() => {
    const storedData = localStorage.getItem("draft");
    setData(storedData);
  }, []);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          bulletList: {
            HTMLAttributes: {
              class: "list-disc ml-3",
            },
          },
          orderedList: {
            HTMLAttributes: {
              class: "list-decimal ml-3",
            },
          },
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        HighLight.configure({
          HTMLAttributes: {
            class: "bg-primary",
          },
        }),
      ],
      content: data?.trim() ?? "",
      editorProps: {
        attributes: {
          class: "outline-none leading-relaxed",
        },
      },
      onUpdate: ({ editor }) => {
        setData(editor.getText());
        localStorage.setItem("draft", editor.getHTML());
      },
    },
    [data]
  );

  return (
    <div className="flex flex-col gap-5 ">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <PostBlogButton />
    </div>
  );
};

export default Tiptap;
