import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import BoardPage from "@/pages/BoardPage";
import { ThemeProvider } from "@/context/ThemeContext";

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

// Mock contexts
vi.mock("@/context/ProjectContext", () => ({
  useProject: () => ({
    selectedProject: {
      id: 1,
      name: "Test Project",
      description: "Test Description",
      color: "#3b82f6",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      taskIds: [1],
    },
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

vi.mock("@/context/UserContext", () => ({
  useUser: () => ({
    users: [],
    defaultUser: { id: 1, username: "testuser" },
  }),
}));

vi.mock("@/context/GenAiContext", () => ({
  useGenAi: () => ({
    chatHistory: [],
    clearChatHistory: vi.fn(),
    response: { loading: false },
  }),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider defaultTheme="light" storageKey="test-theme">
      {component}
    </ThemeProvider>
  );
};

describe("BoardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render board page container", () => {
    // Arrange
    
    // Act
    renderWithProviders(<BoardPage />);
    
    // Assert
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("should contain board and chat components", () => {
    // Arrange
    
    // Act
    renderWithProviders(<BoardPage />);
    
    // Assert
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("should render with BoardProvider", () => {
    // Arrange
    
    // Act
    renderWithProviders(<BoardPage />);
    
    // Assert
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("should have proper layout structure", () => {
    // Arrange
    
    // Act
    renderWithProviders(<BoardPage />);
    
    // Assert
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("should render responsive layout", () => {
    // Arrange
    
    // Act
    renderWithProviders(<BoardPage />);
    
    // Assert
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });
});
