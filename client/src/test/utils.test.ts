import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("Utils", () => {
  it("should merge class names correctly", () => {
    // Arrange
    const baseClass = "text-base";
    const conditionalClass = "font-bold";

    // Act
    const result = cn(baseClass, conditionalClass);

    // Assert
    expect(result).toBe("text-base font-bold");
  });

  it("should handle overlapping Tailwind classes", () => {
    // Arrange
    const conflictingClasses = ["p-2", "p-4", "text-red-500", "text-blue-500"];

    // Act
    const result = cn(...conflictingClasses);

    // Assert
    expect(result).toBe("p-4 text-blue-500");
  });

  it("should handle undefined and null values", () => {
    // Arrange
    const mixedInputs = ["text-base", null, undefined, "font-bold"];

    // Act
    const result = cn(...mixedInputs);

    // Assert
    expect(result).toBe("text-base font-bold");
  });
});
