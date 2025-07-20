import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Board from "@/components/board/Board";
import { BoardProvider } from "@/context/BoardContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";

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

const mockProject = {
  id: 1,
  name: "Test Project",
  description: "Test Description",
  color: "#3b82f6",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  taskIds: [1],
};

const mockTask = {
  id: 1,
  title: "Test Task",
  description: "Test Description",
  taskStatus: "BACKLOG" as const,
  assigneeId: 1,
  projectId: 1,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  attachments: [],
};

// Mock BoardContext
vi.mock("@/context/BoardContext", () => ({
  BoardProvider: ({ children }: { children: React.ReactNode }) => children,
  useBoard: () => ({
    tasks: [mockTask],
    moveTask: vi.fn(),
    loading: false,
    error: null,
    refetch: vi.fn(),
    getTaskById: vi.fn(() => mockTask),
    addTasks: vi.fn(),
  }),
}));

// Mock UserContext
vi.mock("@/context/UserContext", () => ({
  UserProvider: ({ children }: { children: React.ReactNode }) => children,
  useUser: () => ({
    users: [],
    defaultUser: { id: 1, username: "testuser" },
  }),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider defaultTheme="light" storageKey="test-theme">
      <UserProvider>
        <BoardProvider>
          {component}
        </BoardProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

describe("Board", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render basic board structure", () => {
    // Arrange & Act
    renderWithProviders(<Board selectedProject={mockProject} />);
    
    // Assert - Einfacher Test ohne komplexe UI-Interaktionen
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("should show select project message when no project", () => {
    // Arrange & Act  
    renderWithProviders(<Board selectedProject={null} />);
    
    // Assert
    expect(screen.getByText(/select a project/i)).toBeInTheDocument();
  });
});
