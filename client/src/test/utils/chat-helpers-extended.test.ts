import { describe, it, expect } from "vitest";
import { isUserMessage, isAiMessage } from "@/utils/chat-helpers";

describe("Additional Chat Helpers", () => {
  it("should handle messages without type property", () => {
    // Arrange
    const messageWithoutType = { content: "Test" } as any;

    // Act & Assert
    expect(isUserMessage(messageWithoutType)).toBe(false);
    expect(isAiMessage(messageWithoutType)).toBe(false);
  });

  it("should handle messages with invalid type", () => {
    // Arrange
    const messageWithInvalidType = { type: "invalid", content: "Test" } as any;

    // Act & Assert
    expect(isUserMessage(messageWithInvalidType)).toBe(false);
    expect(isAiMessage(messageWithInvalidType)).toBe(false);
  });

  it("should handle empty objects", () => {
    // Arrange
    const emptyObject = {} as any;

    // Act & Assert
    expect(isUserMessage(emptyObject)).toBe(false);
    expect(isAiMessage(emptyObject)).toBe(false);
  });

  it("should handle objects with different type values", () => {
    // Arrange
    const differentTypes = [
      { type: "system" } as any,
      { type: "error" } as any,
      { type: "" } as any,
    ];

    // Act & Assert
    differentTypes.forEach((msg) => {
      expect(isUserMessage(msg)).toBe(false);
      expect(isAiMessage(msg)).toBe(false);
    });
  });
});
