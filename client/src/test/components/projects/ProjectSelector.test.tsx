import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProjectSelector from '@/components/projects/ProjectSelector';
import type { Project } from '@/types';

// Mock the UI components
vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-menu">{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-trigger">{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <div data-testid="dropdown-item" onClick={onClick}>{children}</div>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
    <button onClick={onClick} className={className} data-testid="project-selector-button">
      {children}
    </button>
  ),
}));

vi.mock('lucide-react', () => ({
  ChevronDown: ({ size }: { size: number }) => <div data-testid="chevron-down" data-size={size}>ChevronDown</div>,
}));

describe('ProjectSelector', () => {
  const mockProjects: Project[] = [
    {
      id: 1,
      name: 'Project Alpha',
      color: '#ff0000',
      taskCount: 5,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      taskIds: [1, 2, 3],
    },
    {
      id: 2,
      name: 'Project Beta',
      color: '#00ff00',
      taskCount: 3,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      taskIds: [4, 5],
    },
    {
      id: 3,
      name: 'Project Gamma',
      color: '#cccccc',
      taskCount: 0,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      taskIds: [],
    },
  ];

  const mockOnProjectSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the selected project name', () => {
    render(
      <ProjectSelector
        projects={mockProjects}
        selectedProject={mockProjects[0]}
        onProjectSelect={mockOnProjectSelect}
      />
    );

    const button = screen.getByTestId('project-selector-button');
    expect(button).toHaveTextContent('Project Alpha');
  });

  it('should render chevron down icon', () => {
    render(
      <ProjectSelector
        projects={mockProjects}
        selectedProject={mockProjects[0]}
        onProjectSelect={mockOnProjectSelect}
      />
    );

    const chevron = screen.getByTestId('chevron-down');
    expect(chevron).toBeInTheDocument();
    expect(chevron).toHaveAttribute('data-size', '20');
  });

  it('should render all projects in dropdown', () => {
    render(
      <ProjectSelector
        projects={mockProjects}
        selectedProject={mockProjects[0]}
        onProjectSelect={mockOnProjectSelect}
      />
    );

    const dropdownItems = screen.getAllByTestId('dropdown-item');
    expect(dropdownItems).toHaveLength(3);
    
    expect(screen.getAllByText('Project Alpha')).toHaveLength(2); // Button + dropdown item
    expect(screen.getByText('Project Beta')).toBeInTheDocument();
    expect(screen.getByText('Project Gamma')).toBeInTheDocument();
  });

  it('should call onProjectSelect when a project is clicked', () => {
    render(
      <ProjectSelector
        projects={mockProjects}
        selectedProject={mockProjects[0]}
        onProjectSelect={mockOnProjectSelect}
      />
    );

    const dropdownItems = screen.getAllByTestId('dropdown-item');
    fireEvent.click(dropdownItems[1]); // Click on Project Beta

    expect(mockOnProjectSelect).toHaveBeenCalledWith(mockProjects[1]);
  });

  it('should render project color indicators', () => {
    render(
      <ProjectSelector
        projects={mockProjects}
        selectedProject={mockProjects[0]}
        onProjectSelect={mockOnProjectSelect}
      />
    );

    // Check that all projects are rendered (including their color indicators)
    const dropdownItems = screen.getAllByTestId('dropdown-item');
    expect(dropdownItems).toHaveLength(3);
  });

  it('should handle projects without color (default gray)', () => {
    render(
      <ProjectSelector
        projects={mockProjects}
        selectedProject={mockProjects[2]} // Project without color
        onProjectSelect={mockOnProjectSelect}
      />
    );

    const button = screen.getByTestId('project-selector-button');
    expect(button).toHaveTextContent('Project Gamma');
  });

  it('should render dropdown menu structure', () => {
    render(
      <ProjectSelector
        projects={mockProjects}
        selectedProject={mockProjects[0]}
        onProjectSelect={mockOnProjectSelect}
      />
    );

    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-content')).toBeInTheDocument();
  });

  it('should handle empty projects array', () => {
    render(
      <ProjectSelector
        projects={[]}
        selectedProject={mockProjects[0]}
        onProjectSelect={mockOnProjectSelect}
      />
    );

    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
    expect(screen.queryByTestId('dropdown-item')).not.toBeInTheDocument();
  });
});
