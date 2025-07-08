import { isAiMessage, isUserMessage } from "@/utils/chat-helpers";
import type { ChatMessage } from "@/context/GenAiContext";
import type { UserDto } from "@/api/server";
import ChatBotAvatar from "./ChatBotAvatar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useBoard } from "@/context/BoardContext";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

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
        className={`flex-1 rounded-lg p-3 ${isUserMessage(message) ? "bg-blue-400 text-right" : "bg-gray-100"}`}
      >
        {isUserMessage(message) ? (
          <div>
            <p className="text-sm text-white">{message.content.prompt}</p>
            <p className="text-xs text-white mt-1">
              {message.timestamp.toLocaleTimeString()}
            </p>
          </div>
        ) : isAiMessage(message) ? (
          <div>
            <p className="text-sm">{message.content.answer}</p>
            {message.content.new_tasks &&
              message.content.new_tasks.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-600">
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
                    <div key={index} className="text-xs text-gray-600 ml-2">
                      • {task.title}: {task.description}
                    </div>
                  ))}
                </div>
              )}
            {message.content.existing_tasks &&
              message.content.existing_tasks.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-semibold text-gray-600">
                    Related Tasks:
                  </p>
                  {message.content.existing_tasks.map((task, index) => (
                    <div key={index} className="text-xs text-gray-600 ml-2">
                      • {task.title}: {task.description}
                    </div>
                  ))}
                </div>
              )}

            <p className="text-xs text-gray-400 mt-1">
              {message.timestamp.toLocaleTimeString()}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChatBotMessage;
