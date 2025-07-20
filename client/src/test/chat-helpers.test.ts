import { describe, it, expect } from "vitest";
import { isUserMessage, isAiMessage } from "@/utils/chat-helpers";
import type { ChatMessage } from "@/context/GenAiContext";

describe("Chat Helpers", () => {
  it("should identify user messages correctly", () => {
    // Arrange
    const userMessage: ChatMessage = {
      id: "1",
      type: "user",
      content: {
        project_id: "1",
        prompt: "Hello",
      },
      timestamp: new Date(),
    };

    // Act
    const result = isUserMessage(userMessage);

    // Assert
    expect(result).toBe(true);
  });

  it("should identify AI messages correctly", () => {
    // Arrange
    const aiMessage: ChatMessage = {
      id: "2",
      type: "ai",
      content: {
        intent: "greeting",
        answer: "Hello back",
      },
      timestamp: new Date(),
    };

    // Act
    const result = isAiMessage(aiMessage);

    // Assert
    expect(result).toBe(true);
  });

  it("should return false for wrong message type in isUserMessage", () => {
    // Arrange
    const aiMessage: ChatMessage = {
      id: "3",
      type: "ai",
      content: {
        intent: "response",
        answer: "AI response",
      },
      timestamp: new Date(),
    };

    // Act
    const result = isUserMessage(aiMessage);

    // Assert
    expect(result).toBe(false);
  });

  it("should return false for wrong message type in isAiMessage", () => {
    // Arrange
    const userMessage: ChatMessage = {
      id: "4",
      type: "user",
      content: {
        project_id: "1",
        prompt: "User input",
      },
      timestamp: new Date(),
    };

    // Act
    const result = isAiMessage(userMessage);

    // Assert
    expect(result).toBe(false);
  });
});
