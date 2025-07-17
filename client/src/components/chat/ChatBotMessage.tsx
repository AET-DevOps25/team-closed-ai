import { isAiMessage, isUserMessage } from "@/utils/chat-helpers";
import type { ChatMessage } from "@/context/GenAiContext";
import type { UserDto } from "@/api/server";
import ChatBotAvatar from "./ChatBotAvatar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useBoard } from "@/context/BoardContext";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import ChatBotMarkdown from "./ChatBotMarkdown";

interface ChatBotMessageProps {
  message: ChatMessage;
  user: UserDto | null;
}

const ChatBotMessage = ({ message, user }: ChatBotMessageProps) => {
  const [isCreatingTasks, setIsCreatingTasks] = useState(false);
  const { addTasks } = useBoard();

  const handleCreateTasks = async () => {
    if (!isAiMessage(message) || !message.content.new_tasks) {
      return;
    }

    setIsCreatingTasks(true);
    try {
      const tasks = message.content.new_tasks;

      await addTasks(
        tasks.map((task) => ({
          title: task.title,
          description: task.description,
          taskStatus: task.taskStatus || "BACKLOG",
          assigneeId: user?.id || undefined,
        })),
      );

      toast.success(
        `Successfully created ${tasks.length} task${tasks.length > 1 ? "s" : ""}`,
      );
    } catch (error) {
      console.error("Failed to create tasks:", error);
      toast.error("Failed to create tasks");
    } finally {
      setIsCreatingTasks(false);
    }
  };

  return (
    <div
      key={message.id}
      className={`flex items-end gap-2 ${isUserMessage(message) ? "flex-row-reverse" : ""}`}
    >
      <ChatBotAvatar user={isUserMessage(message) ? user : null} />
      <div
        className={`flex-1 rounded-lg p-3 ${isUserMessage(message) ? "bg-blue-500 dark:bg-blue-600 text-right" : "bg-muted"}`}
      >
        {isUserMessage(message) ? (
          <div>
            <p className="text-sm text-white">{message.content.prompt}</p>
            <p className="text-xs text-white/80 mt-1">
              {message.timestamp.toLocaleTimeString()}
            </p>
          </div>
        ) : isAiMessage(message) ? (
          <div>
            <ChatBotMarkdown message={message.content.answer} />
            {message.content.new_tasks &&
              message.content.new_tasks.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      New Tasks:
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs"
                      onClick={handleCreateTasks}
                      disabled={isCreatingTasks}
                    >
                      {isCreatingTasks ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3 mr-1" />
                          Create All
                        </>
                      )}
                    </Button>
                  </div>
                  {message.content.new_tasks.map((task, index) => (
                    <div
                      key={index}
                      className="text-xs text-muted-foreground ml-2"
                    >
                      • {task.title}: {task.description}
                    </div>
                  ))}
                </div>
              )}
            {message.content.existing_tasks &&
              message.content.existing_tasks.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Related Tasks:
                  </p>
                  {message.content.existing_tasks.map((task, index) => (
                    <div
                      key={index}
                      className="text-xs text-muted-foreground ml-2"
                    >
                      •{" "}
                      <ChatBotMarkdown
                        message={`${task.title}: ${task.description}`}
                      />
                    </div>
                  ))}
                </div>
              )}

            <p className="text-xs text-muted-foreground mt-1">
              {message.timestamp.toLocaleTimeString()}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChatBotMessage;
