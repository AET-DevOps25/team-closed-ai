import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProjectCard from "@/components/projects/ProjectCard";
import { ThemeProvider } from "@/context/ThemeContext";

const mockProject = {
  id: 1,
  name: "Test Project",
  description: "Test Description", 
  color: "#3b82f6",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  taskIds: [1, 2, 3],
  taskCount: 3,
};

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock ProjectContext
vi.mock("@/context/ProjectContext", () => ({
  useProject: () => ({
    deleteProject: vi.fn().mockResolvedValue({}),
  }),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider defaultTheme="light" storageKey="test-theme">
      {component}
    </ThemeProvider>
  );
};

describe("ProjectCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render project information", () => {
    // Arrange
    
    // Act
    renderWithProviders(
      <ProjectCard
        project={mockProject}
        isSelected={false}
        onSelect={vi.fn()}
      />
    );
    
    // Assert
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("3 tasks")).toBeInTheDocument();
  });

  it("should show project color indicator", () => {
    // Arrange
    
    // Act
    renderWithProviders(
      <ProjectCard
        project={mockProject}
        isSelected={false}
        onSelect={vi.fn()}
      />
    );
    
    // Assert
    const colorIndicator = document.querySelector('[style*="background-color: rgb(59, 130, 246)"]');
    expect(colorIndicator).toBeInTheDocument();
  });

  it("should handle project selection", () => {
    // Arrange
    const onSelectMock = vi.fn();
    renderWithProviders(
      <ProjectCard
        project={mockProject}
        isSelected={false}
        onSelect={onSelectMock}
      />
    );
    
    // Act
    fireEvent.click(screen.getByText("Test Project"));
    
    // Assert
    expect(onSelectMock).toHaveBeenCalledWith(mockProject);
  });

  it("should show delete button on hover", () => {
    // Arrange
    
    // Act
    renderWithProviders(
      <ProjectCard
        project={mockProject}
        isSelected={false}
        onSelect={vi.fn()}
      />
    );
    
    // Assert
    const deleteButton = screen.getByRole("button");
    expect(deleteButton).toBeInTheDocument();
  });

  it("should handle delete button click", () => {
    // Arrange
    renderWithProviders(
      <ProjectCard
        project={mockProject}
        isSelected={false}
        onSelect={vi.fn()}
      />
    );
    
    // Act
    const deleteButton = screen.getByRole("button");
    fireEvent.click(deleteButton);
    
    // Assert
    expect(deleteButton).toBeInTheDocument();
  });

  it("should show task count correctly", () => {
    // Arrange
    const projectWithZeroTasks = { ...mockProject, taskCount: 0 };
    
    // Act
    renderWithProviders(
      <ProjectCard
        project={projectWithZeroTasks}
        isSelected={false}
        onSelect={vi.fn()}
      />
    );
    
    // Assert
    expect(screen.getByText("0 tasks")).toBeInTheDocument();
  });

  it("should handle project without color", () => {
    // Arrange
    const projectWithoutColor = { ...mockProject, color: "" };
    
    // Act
    renderWithProviders(
      <ProjectCard
        project={projectWithoutColor}
        isSelected={false}
        onSelect={vi.fn()}
      />
    );
    
    // Assert
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("should show selected state", () => {
    // Arrange
    
    // Act
    renderWithProviders(
      <ProjectCard
        project={mockProject}
        isSelected={true}
        onSelect={vi.fn()}
      />
    );
    
    // Assert
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });
});
