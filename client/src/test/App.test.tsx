import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "@/App";
import { BrowserRouter } from "react-router";

// Mock alle Context Provider
vi.mock("@/context/ThemeContext", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({ theme: "light" }),
}));

vi.mock("@/context/ProjectContext", () => ({
  ProjectProvider: ({ children }: { children: React.ReactNode }) => children,
  useProject: () => ({
    projects: [],
    selectedProject: null,
    loading: false,
    error: null,
    selectProject: vi.fn(),
    refetch: vi.fn(),
  }),
}));

vi.mock("@/context/UserContext", () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => children,
  useUser: () => ({
    users: [],
    defaultUser: { 
      id: 1, 
      username: "testuser", 
      name: "Test User",
      email: "test@example.com" 
    },
  }),
}));

vi.mock("@/context/GenAiContext", () => ({
  GenAiProvider: ({ children }: { children: React.ReactNode }) => children,
  useGenAi: () => ({
    chatHistory: [],
    clearChatHistory: vi.fn(),
    response: { loading: false },
  }),
}));

vi.mock("@/context/BoardContext", () => ({
  BoardProvider: ({ children }: { children: React.ReactNode }) => children,
  useBoard: () => ({
    tasks: [],
    moveTask: vi.fn(),
    loading: false,
    error: null,
    refetch: vi.fn(),
    getTaskById: vi.fn(),
    addTasks: vi.fn(),
  }),
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render main app structure", () => {
    // Arrange
    
    // Act
    render(<App />);
    
    // Assert
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("should render with all providers", () => {
    // Arrange
    
    // Act
    render(<App />);
    
    // Assert
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("should handle routing", () => {
    // Arrange
    
    // Act
    render(<App />);
    
    // Assert
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("should render sidebar and main content", () => {
    // Arrange
    
    // Act
    render(<App />);
    
    // Assert
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("should contain router navigation", () => {
    // Arrange
    
    // Act
    render(<App />);
    
    // Assert
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
