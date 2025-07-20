import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Trash2 } from "lucide-react";
import { useGenAi } from "@/context/GenAiContext";
import { useEffect, useRef } from "react";
import type { UserDto } from "@/api/server";
import ChatBotAvatar from "./ChatBotAvatar";
import ChatBotMessage from "./ChatBotMessage";
import ChatBotInput from "./ChatBotInput";

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  user: UserDto | null;
}

const ChatBot = ({ isOpen, onClose, projectId, user }: ChatBotProps) => {
  const { chatHistory, clearChatHistory, response } = useGenAi();
  const isLoading = response.loading;
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current;
      const lastChild = viewport.lastElementChild;

      if (lastChild) {
        lastChild.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  if (!isOpen) return null;

  return (
    <Card
      className="fixed bottom-4 right-4 w-96 max-h-[80vh] min-h-96 shadow-lg z-50 flex flex-col"
      style={{ padding: "0px", gap: "0px" }}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4 flex-shrink-0">
        <CardTitle className="text-lg">AI Assistant</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChatHistory}
            title="Clear chat history"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex flex-col flex-1 min-h-0">
        <ScrollArea className="flex-1 p-4 max-h-[50vh] overflow-y-auto">
          <div className="space-y-4" ref={scrollAreaRef}>
            {chatHistory.length === 0 && (
              <div className="flex items-end gap-2">
                <ChatBotAvatar user={null} />
                <div className="flex-1 bg-muted rounded-lg p-3">
                  <p className="text-sm">
                    Hi! I'm your AI assistant. I can help you with questions
                    about your project or create new tasks. Just tell me what
                    you need!
                  </p>
                </div>
              </div>
            )}

            {chatHistory.map((message) => (
              <ChatBotMessage key={message.id} message={message} user={user} />
            ))}

            {isLoading && (
              <div className="flex items-end gap-2">
                <ChatBotAvatar user={null} />
                <div className="flex-1 bg-muted rounded-lg p-3">
                  <p className="text-sm flex items-center">
                    Thinking
                    <span className="ml-1 flex">
                      <span className="animate-bounce delay-0">.</span>
                      <span className="animate-bounce delay-150">.</span>
                      <span className="animate-bounce delay-300">.</span>
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <ChatBotInput
          projectId={projectId}
          userId={user?.id.toString() || null}
        />
      </CardContent>
    </Card>
  );
};

export default ChatBot;
