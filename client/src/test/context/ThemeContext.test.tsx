import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

// Test component that uses the theme context
const TestThemeComponent = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button onClick={() => setTheme("dark")}>Set Dark</button>
      <button onClick={() => setTheme("light")}>Set Light</button>
      <button onClick={() => setTheme("system")}>Set System</button>
    </div>
  );
};

describe("ThemeContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should provide default theme", () => {
    // Arrange
    
    // Act
    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <TestThemeComponent />
      </ThemeProvider>
    );
    
    // Assert
    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
  });

  it("should allow theme switching to dark", () => {
    // Arrange
    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <TestThemeComponent />
      </ThemeProvider>
    );
    
    // Act
    fireEvent.click(screen.getByText("Set Dark"));
    
    // Assert
    expect(screen.getByTestId("current-theme")).toHaveTextContent("dark");
  });

  it("should allow theme switching to light", () => {
    // Arrange
    render(
      <ThemeProvider defaultTheme="dark" storageKey="test-theme">
        <TestThemeComponent />
      </ThemeProvider>
    );
    
    // Act
    fireEvent.click(screen.getByText("Set Light"));
    
    // Assert
    expect(screen.getByTestId("current-theme")).toHaveTextContent("light");
  });

  it("should allow theme switching to system", () => {
    // Arrange
    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <TestThemeComponent />
      </ThemeProvider>
    );
    
    // Act
    fireEvent.click(screen.getByText("Set System"));
    
    // Assert
    expect(screen.getByTestId("current-theme")).toHaveTextContent("system");
  });

  it("should render children components", () => {
    // Arrange
    
    // Act
    render(
      <ThemeProvider defaultTheme="light" storageKey="test-theme">
        <div data-testid="child">Child Content</div>
      </ThemeProvider>
    );
    
    // Assert
    expect(screen.getByTestId("child")).toHaveTextContent("Child Content");
  });

  it("should handle system theme default", () => {
    // Arrange
    
    // Act
    render(
      <ThemeProvider defaultTheme="system" storageKey="test-theme">
        <TestThemeComponent />
      </ThemeProvider>
    );
    
    // Assert
    expect(screen.getByTestId("current-theme")).toHaveTextContent("system");
  });
});
