import type { GenAIResponse, PromptRequest } from "@/api/genai/api";
import type { ApiState } from "@/types/api";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { useGenAiApi } from "@/hooks/use-genai-api";

export interface UserChatMessage {
  id: string;
  type: "user";
  timestamp: Date;
  content: PromptRequest;
}

export interface AiChatMessage {
  id: string;
  type: "ai";
  timestamp: Date;
  content: GenAIResponse;
}

export type ChatMessage = UserChatMessage | AiChatMessage;

interface GenAiContextType {
  response: ApiState<GenAIResponse>;
  health: ApiState<string>;
  chatHistory: ChatMessage[];
  addUserMessage: (prompt: PromptRequest) => string;
  addAiMessage: (response: GenAIResponse) => void;
  clearChatHistory: () => void;
  sendMessage: (prompt: PromptRequest) => Promise<void>;
}

const GenAiContext = createContext<GenAiContextType | undefined>(undefined);

export const GenAiProvider = ({ children }: { children: ReactNode }) => {
  const genAiApi = useGenAiApi();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [lastResponseData, setLastResponseData] =
    useState<GenAIResponse | null>(null);

  const addUserMessage = useCallback((prompt: PromptRequest): string => {
    const messageId = `user-${Date.now()}-${Math.random()}`;
    const userMessage: UserChatMessage = {
      id: messageId,
      type: "user",
      timestamp: new Date(),
      content: prompt,
    };

    setChatHistory((prev) => [...prev, userMessage]);
    return messageId;
  }, []);

  const addAiMessage = useCallback((genAiResponse: GenAIResponse): void => {
    const aiMessage: AiChatMessage = {
      id: `ai-${Date.now()}-${Math.random()}`,
      type: "ai",
      timestamp: new Date(),
      content: genAiResponse,
    };

    setChatHistory((prev) => [...prev, aiMessage]);
  }, []);

  useEffect(() => {
    if (genAiApi.response.data && genAiApi.response.data !== lastResponseData) {
      addAiMessage(genAiApi.response.data);
      setLastResponseData(genAiApi.response.data);
    }
  }, [genAiApi.response.data, lastResponseData, addAiMessage]);

  const clearChatHistory = useCallback((): void => {
    setChatHistory([]);
    genAiApi.clearErrors();
    setLastResponseData(null);
  }, [genAiApi]);

  const sendMessage = useCallback(
    async (prompt: PromptRequest): Promise<void> => {
      addUserMessage(prompt);

      try {
        await genAiApi.createPrompt(prompt);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [addUserMessage, genAiApi],
  );

  return (
    <GenAiContext.Provider
      value={{
        response: genAiApi.response,
        health: genAiApi.health,
        chatHistory,
        addUserMessage,
        addAiMessage,
        clearChatHistory,
        sendMessage,
      }}
    >
      {children}
    </GenAiContext.Provider>
  );
};

export const useGenAi = () => {
  const context = useContext(GenAiContext);
  if (context === undefined) {
    throw new Error("useGenAi must be used within a GenAiProvider");
  }
  return context;
};
