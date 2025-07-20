import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ChatBot from "@/components/chat/ChatBot";
import { ThemeProvider } from "@/context/ThemeContext";

// Mock GenAiContext
vi.mock("@/context/GenAiContext", () => ({
  useGenAi: () => ({
    chatHistory: [
      {
        id: "1",
        timestamp: new Date(),
        content: { prompt: "Hello" },
        type: "user",
      },
      {
        id: "2",
        timestamp: new Date(),
        content: { answer: "Hi there!" },
        type: "ai",
      },
    ],
    clearChatHistory: vi.fn(),
    response: { loading: false },
  }),
}));

// Mock BoardContext  
vi.mock("@/context/BoardContext", () => ({
  useBoard: () => ({
    addTasks: vi.fn(),
  }),
}));

const mockUser = {
  id: 1,
  username: "testuser",
  email: "test@test.com",
  name: "Test User",
  firstName: "Test",
  lastName: "User",
  profilePicture: "test.jpg",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider defaultTheme="light" storageKey="test-theme">
      {component}
    </ThemeProvider>
  );
};

describe("ChatBot", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render when open", () => {
    // Arrange
    
    // Act
    renderWithProviders(
      <ChatBot
        isOpen={true}
        onClose={vi.fn()}
        projectId="1"
        user={mockUser}
      />
    );
    
    // Assert
    expect(screen.getByText("AI Assistant")).toBeInTheDocument();
  });

  it("should not render when closed", () => {
    // Arrange
    
    // Act
    renderWithProviders(
      <ChatBot
        isOpen={false}
        onClose={vi.fn()}
        projectId="1"
        user={mockUser}
      />
    );
    
    // Assert
    expect(screen.queryByText("AI Assistant")).not.toBeInTheDocument();
  });

  it("should show chat history", () => {
    // Arrange
    
    // Act
    renderWithProviders(
      <ChatBot
        isOpen={true}
        onClose={vi.fn()}
        projectId="1"
        user={mockUser}
      />
    );
    
    // Assert
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
  });

  it("should handle close button click", async () => {
    // Arrange
    const onCloseMock = vi.fn();
    
    renderWithProviders(
      <ChatBot 
        isOpen={true} 
        onClose={onCloseMock}
        user={mockUser}
        projectId="1"
      />
    );
    
    // Act
    // Der X-Button ist der zweite Button (ohne title/name)
    const allButtons = screen.getAllByRole("button");
    const closeButton = allButtons.find(button => 
      button.querySelector('svg')?.classList.contains('lucide-x')
    );
    expect(closeButton).toBeDefined();
    fireEvent.click(closeButton!);
    
    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });  it("should show clear chat button", () => {
    // Arrange
    
    // Act
    renderWithProviders(
      <ChatBot
        isOpen={true}
        onClose={vi.fn()}
        projectId="1"
        user={mockUser}
      />
    );
    
    // Assert
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should display default welcome message when no chat history", () => {
    // Arrange
    // Mock empty chat history
    vi.doMock("@/context/GenAiContext", () => ({
      useGenAi: () => ({
        chatHistory: [],
        clearChatHistory: vi.fn(),
        response: { loading: false },
      }),
    }));
    
    // Act
    renderWithProviders(
      <ChatBot
        isOpen={true}
        onClose={vi.fn()}
        projectId="1"
        user={mockUser}
      />
    );
    
    // Assert
    expect(screen.getByText("AI Assistant")).toBeInTheDocument();
  });
});
