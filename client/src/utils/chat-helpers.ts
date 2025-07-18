import type {
  ChatMessage,
  UserChatMessage,
  AiChatMessage,
} from "@/context/GenAiContext";

export const isUserMessage = (
  message: ChatMessage,
): message is UserChatMessage => {
  return message.type === "user";
};

export const isAiMessage = (message: ChatMessage): message is AiChatMessage => {
  return message.type === "ai";
};
