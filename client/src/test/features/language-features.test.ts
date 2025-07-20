import { describe, it, expect } from "vitest";

// Test various JavaScript/TypeScript features
describe("TypeScript and JavaScript Features", () => {
  it("should handle array operations", () => {
    // Arrange
    const numbers = [1, 2, 3, 4, 5];

    // Act
    const doubled = numbers.map((n) => n * 2);
    const filtered = numbers.filter((n) => n > 3);
    const sum = numbers.reduce((acc, n) => acc + n, 0);

    // Assert
    expect(doubled).toEqual([2, 4, 6, 8, 10]);
    expect(filtered).toEqual([4, 5]);
    expect(sum).toBe(15);
  });

  it("should handle object manipulation", () => {
    // Arrange
    const user = { name: "John", age: 30 };

    // Act
    const updated = { ...user, age: 31 };
    const keys = Object.keys(user);
    const values = Object.values(user);

    // Assert
    expect(updated.age).toBe(31);
    expect(keys).toEqual(["name", "age"]);
    expect(values).toEqual(["John", 30]);
  });

  it("should handle string operations", () => {
    // Arrange
    const text = "Hello World";

    // Act
    const upper = text.toUpperCase();
    const lower = text.toLowerCase();
    const words = text.split(" ");

    // Assert
    expect(upper).toBe("HELLO WORLD");
    expect(lower).toBe("hello world");
    expect(words).toEqual(["Hello", "World"]);
  });

  it("should handle conditional logic", () => {
    // Arrange
    const getValue = (condition: boolean) => (condition ? "true" : "false");

    // Act & Assert
    expect(getValue(true)).toBe("true");
    expect(getValue(false)).toBe("false");
  });

  it("should handle async operations", async () => {
    // Arrange
    const asyncFunction = async (value: string) => {
      return new Promise<string>((resolve) => {
        setTimeout(() => resolve(value.toUpperCase()), 10);
      });
    };

    // Act
    const result = await asyncFunction("test");

    // Assert
    expect(result).toBe("TEST");
  });

  it("should handle error scenarios", () => {
    // Arrange
    const throwError = () => {
      throw new Error("Test error");
    };

    // Act & Assert
    expect(throwError).toThrow("Test error");
  });

  it("should handle null and undefined values", () => {
    // Arrange
    const data = {
      value: null as string | null,
      optional: undefined as string | undefined,
    };

    // Act
    const hasValue = data.value !== null;
    const hasOptional = data.optional !== undefined;

    // Assert
    expect(hasValue).toBe(false);
    expect(hasOptional).toBe(false);
  });
});
