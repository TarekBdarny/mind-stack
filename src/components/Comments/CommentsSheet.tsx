import { Dispatch, SetStateAction } from "react";
import Comment from "./Comment";
import CommentBox from "./CommentBox";
import { ScrollArea } from "../ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Blog } from "../BlogCard";
import { Separator } from "../ui/separator";

type SheetProps = {
  showComments: boolean;
  setShowComments: Dispatch<SetStateAction<boolean>>;
  setNewComment: Dispatch<SetStateAction<string>>;
  newComment: string;
  isCommenting: boolean;
  handleComment: () => Promise<void>;
  blog?: Blog;
};
const CommentsSheet = ({
  showComments,
  setShowComments,
  newComment,
  isCommenting,
  handleComment,
  setNewComment,
  blog,
}: SheetProps) => {
  return (
    <Sheet open={showComments} onOpenChange={setShowComments}>
      <SheetHeader className="sr-only">
        <SheetTitle>Comments</SheetTitle>
      </SheetHeader>
      <SheetContent className="p-4">
        <div className="w-full mt-10">
          <CommentBox
            use="separate"
            content={newComment}
            isCommenting={isCommenting}
            handleComment={handleComment}
            setNewComment={setNewComment}
          />
        </div>
        <Separator />
        <div className="mt-3">
          {blog?._count.comments === 0 ? (
            <p>No Comments yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              <ScrollArea className="h-[600px] w-full">
                {blog?.comments.map((comment, index) => (
                  <Comment
                    key={index}
                    commentId={comment.id}
                    commenter={comment.commenter}
                    content={comment.content}
                    createdAt={comment.createdAt}
                  />
                ))}
              </ScrollArea>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
export default CommentsSheet;
