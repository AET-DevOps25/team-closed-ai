import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateProjectDialog from "@/components/projects/CreateProjectDialog";
import { ThemeProvider } from "@/context/ThemeContext";

// Mock ProjectContext
vi.mock("@/context/ProjectContext", () => ({
  useProject: () => ({
    createProject: vi.fn().mockResolvedValue({}),
  }),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider defaultTheme="light" storageKey="test-theme">
      {component}
    </ThemeProvider>
  );
};

describe("CreateProjectDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render when open", () => {
    // Arrange
    
    // Act
    renderWithProviders(
      <CreateProjectDialog isOpen={true} onClose={vi.fn()} />
    );
    
    // Assert
    expect(screen.getByText("Create New Project")).toBeInTheDocument();
  });

  it("should not render when closed", () => {
    // Arrange
    
    // Act
    renderWithProviders(
      <CreateProjectDialog isOpen={false} onClose={vi.fn()} />
    );
    
    // Assert
    expect(screen.queryByText("Create New Project")).not.toBeInTheDocument();
  });

  it("should render form fields", () => {
    // Arrange
    
    // Act
    renderWithProviders(
      <CreateProjectDialog isOpen={true} onClose={vi.fn()} />
    );
    
    // Assert
    expect(screen.getByLabelText("Project Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Project Color")).toBeInTheDocument();
    expect(screen.getByLabelText("Description (Optional)")).toBeInTheDocument();
  });

  it("should handle form input changes", () => {
    // Arrange
    renderWithProviders(
      <CreateProjectDialog isOpen={true} onClose={vi.fn()} />
    );
    
    // Act
    const nameInput = screen.getByLabelText("Project Name");
    fireEvent.change(nameInput, { target: { value: "Test Project" } });
    
    // Assert
    expect(nameInput).toHaveValue("Test Project");
  });

  it("should handle color input changes", () => {
    // Arrange
    renderWithProviders(
      <CreateProjectDialog isOpen={true} onClose={vi.fn()} />
    );
    
    // Act
    const colorInput = screen.getByLabelText("Project Color");
    fireEvent.change(colorInput, { target: { value: "#ff0000" } });
    
    // Assert
    expect(colorInput).toHaveValue("#ff0000");
  });

  it("should handle description input changes", () => {
    // Arrange
    renderWithProviders(
      <CreateProjectDialog isOpen={true} onClose={vi.fn()} />
    );
    
    // Act
    const descriptionInput = screen.getByLabelText("Description (Optional)");
    fireEvent.change(descriptionInput, { target: { value: "Test description" } });
    
    // Assert
    expect(descriptionInput).toHaveValue("Test description");
  });

  it("should show cancel and create buttons", () => {
    // Arrange
    
    // Act
    renderWithProviders(
      <CreateProjectDialog isOpen={true} onClose={vi.fn()} />
    );
    
    // Assert
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Create Project")).toBeInTheDocument();
  });

  it("should handle cancel button click", () => {
    // Arrange
    const onCloseMock = vi.fn();
    renderWithProviders(
      <CreateProjectDialog isOpen={true} onClose={onCloseMock} />
    );
    
    // Act
    fireEvent.click(screen.getByText("Cancel"));
    
    // Assert
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("should handle form submission", async () => {
    // Arrange
    renderWithProviders(
      <CreateProjectDialog isOpen={true} onClose={vi.fn()} />
    );
    
    // Act
    const nameInput = screen.getByLabelText("Project Name");
    fireEvent.change(nameInput, { target: { value: "Test Project" } });
    
    const submitButton = screen.getByRole("button", { name: /create project/i });
    fireEvent.click(submitButton);
    
    // Assert
    await waitFor(() => {
      expect(nameInput).toHaveValue("Test Project");
    });
  });
});
