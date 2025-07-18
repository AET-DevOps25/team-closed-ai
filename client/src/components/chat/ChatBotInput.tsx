import type { PromptRequest } from "@/api/genai";
import { useGenAi } from "@/context/GenAiContext";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";

interface ChatBotInputProps {
  projectId: string;
  userId: string | null;
}

const ChatBotInput = ({ projectId, userId }: ChatBotInputProps) => {
  const [inputMessage, setInputMessage] = useState("");
  const { sendMessage, response } = useGenAi();
  const isLoading = response.loading;

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const promptRequest: PromptRequest = {
      project_id: projectId,
      user_id: userId,
      prompt: inputMessage.trim(),
    };

    setInputMessage("");

    try {
      await sendMessage(promptRequest);
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 border-t border-border flex-shrink-0">
      <div className="flex w-full max-w-sm items-center gap-2">
        <Input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button
          type="submit"
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isLoading}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatBotInput;
