
import { useState } from "react";
import { useBoard } from "@/context/BoardContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";

interface CommentSectionProps {
  ticketId: string;
}

const CommentSection = ({ ticketId }: CommentSectionProps) => {
  const { getTicketById, users, addComment } = useBoard();
  const [newComment, setNewComment] = useState("");
  const [commentAuthorId, setCommentAuthorId] = useState(users[0]?.id || "");

  const ticket = getTicketById(ticketId);
  const comments = ticket?.comments || [];
  const commentAuthor = users.find((user) => user.id === commentAuthorId);

  const handleAddComment = () => {
    if (!newComment.trim() || !commentAuthor) {
      toast.error("Comment cannot be empty");
      return;
    }

    addComment(ticketId, newComment.trim(), commentAuthor);
    setNewComment("");
    toast.success("Comment added");
  };

  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-2 font-medium">
        <MessageSquare size={18} />
        Comments ({comments.length})
      </h3>

      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                <AvatarFallback>
                  {comment.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.author.name}</span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
                <div className="mt-1 text-gray-700">{comment.content}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">No comments yet</div>
      )}

      <div className="pt-4 border-t">
        <div className="flex gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={commentAuthor?.avatar} alt={commentAuthor?.name} />
            <AvatarFallback>
              {commentAuthor?.name
                .split(" ")
                .map((n) => n[0])
                .join("") || "??"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Add a comment..."
              className="resize-none"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="flex justify-between items-center">
              <select
                className="text-sm border rounded px-2 py-1"
                value={commentAuthorId}
                onChange={(e) => setCommentAuthorId(e.target.value)}
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    Comment as: {user.name}
                  </option>
                ))}
              </select>
              <Button onClick={handleAddComment}>Add Comment</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
