import { Toggle } from "@/components/ui/toggle";
import {
  AArrowUp,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react";
import { Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }
  const getOS = (): string => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userAgentData = (navigator as any).userAgentData;

    if (userAgentData?.platform) {
      const platform = userAgentData.platform.toLowerCase();
      if (platform.includes("win")) return "Windows";
    }
    return "macOS";
  };

  const Options = [
    {
      icon: <Heading1 className="size-4" />,
      tooltip: "Title",
      shortcut: <Shortcut OS={getOS()} Alt={true} char="1" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      tooltip: "Heading 2",
      shortcut: <Shortcut OS={getOS()} Alt={true} char="2" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      tooltip: "Heading 3",
      shortcut: <Shortcut OS={getOS()} Alt={true} char="3" />,

      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <AArrowUp className="size-4" />,
      tooltip: "Bigger font",
      shortcut: <Shortcut OS={getOS()} Alt={true} char="4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      pressed: editor.isActive("heading", { level: 4 }),
    },
    {
      icon: <Bold className="size-4" />,
      tooltip: "Bold",
      shortcut: <Shortcut OS={getOS()} char="B" />,

      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      icon: <Italic className="size-4" />,
      tooltip: "Italic",
      shortcut: <Shortcut OS={getOS()} char="I" />,

      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough className="size-4" />,
      tooltip: "Strikethrough",
      shortcut: <Shortcut OS={getOS()} char="S" />,

      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
    {
      icon: <AlignLeft className="size-4" />,
      tooltip: "Align Left",
      shortcut: <Shortcut OS={getOS()} char="L" />,

      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter className="size-4" />,
      tooltip: "Align Center",
      shortcut: <Shortcut OS={getOS()} char="E" />,

      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight className="size-4" />,
      tooltip: "Align Right",
      shortcut: <Shortcut OS={getOS()} char="R" />,

      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <List className="size-4" />,
      tooltip: "Bullet List",
      shortcut: <Shortcut OS={getOS()} char="8" />,

      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="size-4" />,
      tooltip: "Ordered list",
      shortcut: <Shortcut OS={getOS()} char="7" />,

      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
    {
      icon: <Highlighter className="size-4" />,
      tooltip: "Highlighter",
      shortcut: <Shortcut OS={getOS()} char="H" />,

      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive("highlight"),
    },
  ];

  return (
    <div className="w-[350px] sm:w-fit mx-auto rounded-md p-1 mb-1 space-x-2 z-50 sticky top-15 bg-background">
      {Options.map((option, i) => (
        <TooltipProvider key={i}>
          <Tooltip>
            <TooltipTrigger>
              <Toggle
                asChild
                className={`cursor-pointer  rounded-md p-2 transition-colors
            ${option.pressed && "border text-white border-primary"}
          `}
                pressed={option.pressed}
                size={"lg"}
                onPressedChange={option.onClick}
              >
                {option.icon}
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>{option.tooltip}</p>
              {option.shortcut}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      <Separator className="mt-4" />
    </div>
  );
};

export default MenuBar;
type ShortcutProps = {
  OS: string;
  char: string;
  Alt?: boolean;
};

const Shortcut = ({ OS, Alt = false, char }: ShortcutProps) => {
  const modifier =
    OS === "Windows" ? (Alt ? "Ctrl+Alt+" : "⇧Ctrl+") : Alt ? "⌥⌘+" : "⇧⌘+";
  return (
    <p>
      {modifier}
      {char}
    </p>
  );
};
