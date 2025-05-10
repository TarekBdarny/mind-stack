"use client";

import MenuBar from "@/app/write/menu-bar";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import HighLight from "@tiptap/extension-highlight";
import { useEffect, useState, useRef } from "react"; // Added useRef
import PostBlogButton from "./PostBlogButton";
// Input component is not explicitly used in the provided snippet for the title,
// but assuming it might be from "./ui/input" if it were a custom component.
// The current title input is a standard HTML <input>. If "./ui/input" is needed, ensure it's imported.

const Tiptap = () => {
  const [title, setTitle] = useState<string>(""); // Initialize with empty string
  const titleRef = useRef(title); // Ref to hold current title for onUpdate

  useEffect(() => {
    titleRef.current = title;
  }, [title]); // Keep ref updated with title

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          bulletList: { HTMLAttributes: { class: "list-disc ml-3" } },
          orderedList: { HTMLAttributes: { class: "list-decimal ml-3" } },
        }),
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        HighLight.configure({ HTMLAttributes: { class: "bg-primary" } }),
      ],
      content: "", // Initial content, will be populated by useEffect
      editorProps: {
        attributes: { class: "outline-none leading-relaxed" },
      },

      onUpdate: ({ editor }) => {
        localStorage.setItem(
          "draft",
          JSON.stringify({
            content: editor.getHTML(),
            title: titleRef.current, // Use ref here for the latest title
          })
        );
      },
    },
    []
  ); // Empty dependency array ensures a stable editor instance

  useEffect(() => {
    // Load from localStorage and populate editor and title state
    const storedData = localStorage.getItem("draft");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setTitle(parsed.title || ""); // Set title state

      // Ensure editor instance is available before trying to set its content
      if (editor && parsed.content) {
        // Check if current editor content is different to avoid unnecessary updates
        if (editor.getHTML() !== parsed.content) {
          editor.commands.setContent(parsed.content, false); // Set content without emitting an update event
        }
      }
    }
  }, [editor]); // This effect runs when the editor instance is ready

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // titleRef will be updated by its own useEffect
    // Update localStorage immediately when title changes
    localStorage.setItem(
      "draft",
      JSON.stringify({
        content: editor?.getHTML() || "", // Get current content from editor, or empty if editor not ready
        title: newTitle,
      })
    );
  };

  // Display a loading message or component until the editor is initialized
  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="flex flex-col gap-5 relative">
      <MenuBar editor={editor} />
      <input
        type="text"
        className="w-full p-8 text-3xl font-semibold bg-background outline-none border-b-1 border-primary mb-10"
        onChange={handleTitleChange}
        placeholder="Enter title here"
        value={title} // Controlled input using the title state
        autoFocus={!title}
      />
      <EditorContent editor={editor} />
      <PostBlogButton />
    </div>
  );
};

export default Tiptap;
