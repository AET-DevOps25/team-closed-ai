import type {
  ChatMessage,
  UserChatMessage,
  AiChatMessage,
} from "@/context/GenAiContext";

// Type guards
export const isUserMessage = (
  message: ChatMessage,
): message is UserChatMessage => {
  return message.type === "user";
};

export const isAiMessage = (message: ChatMessage): message is AiChatMessage => {
  return message.type === "ai";
};

// Helper functions for chat history
export const getChatHistoryAsText = (chatHistory: ChatMessage[]): string => {
  return chatHistory
    .map((message) => {
      if (isUserMessage(message)) {
        return `User: ${message.content.prompt}`;
      } else {
        return `AI: ${message.content.answer}`;
      }
    })
    .join("\n\n");
};

export const getLastUserMessage = (
  chatHistory: ChatMessage[],
): UserChatMessage | null => {
  for (let i = chatHistory.length - 1; i >= 0; i--) {
    if (isUserMessage(chatHistory[i])) {
      return chatHistory[i] as UserChatMessage;
    }
  }
  return null;
};

export const getLastAiMessage = (
  chatHistory: ChatMessage[],
): AiChatMessage | null => {
  for (let i = chatHistory.length - 1; i >= 0; i--) {
    if (isAiMessage(chatHistory[i])) {
      return chatHistory[i] as AiChatMessage;
    }
  }
  return null;
};

export const getMessageById = (
  chatHistory: ChatMessage[],
  messageId: string,
): ChatMessage | null => {
  return chatHistory.find((message) => message.id === messageId) || null;
};

// Get conversation pairs (user message + AI response)
export interface ConversationPair {
  userMessage: UserChatMessage;
  aiMessage: AiChatMessage | null;
}

export const getConversationPairs = (
  chatHistory: ChatMessage[],
): ConversationPair[] => {
  const pairs: ConversationPair[] = [];
  let currentUserMessage: UserChatMessage | null = null;

  for (const message of chatHistory) {
    if (isUserMessage(message)) {
      // If we have a previous user message without AI response, add it
      if (currentUserMessage) {
        pairs.push({
          userMessage: currentUserMessage,
          aiMessage: null,
        });
      }
      currentUserMessage = message;
    } else if (isAiMessage(message) && currentUserMessage) {
      // Pair the AI message with the current user message
      pairs.push({
        userMessage: currentUserMessage,
        aiMessage: message,
      });
      currentUserMessage = null;
    }
  }

  // Don't forget the last user message if there's no AI response yet
  if (currentUserMessage) {
    pairs.push({
      userMessage: currentUserMessage,
      aiMessage: null,
    });
  }

  return pairs;
};
