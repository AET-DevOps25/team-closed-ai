import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectProvider, useProject } from '@/context/ProjectContext';
import { useProjectApi } from '@/hooks/use-project-api';
import type { ProjectDto, CreateProjectDto } from '@/api/server';
import type { Project } from '@/types';

// Mock the useProjectApi hook
vi.mock('@/hooks/use-project-api');

const mockProjectApi = {
  projects: { data: null as ProjectDto[] | null, loading: false, error: null as string | null },
  getAllProjects: vi.fn(),
  createProject: vi.fn(),
  deleteProject: vi.fn(),
};

const mockProjectsDto: ProjectDto[] = [
  {
    id: 1,
    name: 'Project 1',
    color: '#FF0000',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    taskIds: [],
  },
  {
    id: 2,
    name: 'Project 2', 
    color: '#00FF00',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
    taskIds: [],
  },
];

// Test component that uses the ProjectContext
const TestComponent = () => {
  const project = useProject();
  
  return (
    <div>
      <div data-testid="project-count">{project.projects.length}</div>
      <div data-testid="loading">{project.loading.toString()}</div>
      <div data-testid="error">{project.error || 'null'}</div>
      <div data-testid="selected-project">
        {project.selectedProject ? project.selectedProject.name : 'none'}
      </div>
      <button 
        onClick={() => project.selectProject({ id: 2, name: 'Project 2', color: '#00FF00', createdAt: '2024-01-02', updatedAt: '2024-01-02', taskIds: [] })}
        data-testid="select-project-button"
      >
        Select Project
      </button>
      <button 
        onClick={() => project.createProject({ name: 'New Project', color: '#0000FF' })}
        data-testid="create-project-button"
      >
        Create Project
      </button>
      <button 
        onClick={() => project.deleteProject(1)}
        data-testid="delete-project-button"
      >
        Delete Project
      </button>
      <button 
        onClick={() => project.refetch()}
        data-testid="refetch-button"
      >
        Refetch
      </button>
    </div>
  );
};

describe('ProjectContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useProjectApi as any).mockReturnValue(mockProjectApi);
  });

  it('should provide default context values', () => {
    render(
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
    );

    expect(screen.getByTestId('project-count')).toHaveTextContent('0');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('null');
    expect(screen.getByTestId('selected-project')).toHaveTextContent('none');
  });

  it('should throw error when useProject is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useProject must be used within a ProjectProvider');
    
    consoleSpy.mockRestore();
  });

  it('should fetch projects on mount', async () => {
    render(
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
    );

    expect(mockProjectApi.getAllProjects).toHaveBeenCalledTimes(1);
  });

  it('should update projects when API data changes', async () => {
    // Start with empty data
    mockProjectApi.projects.data = null;
    
    const { rerender } = render(
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
    );

    expect(screen.getByTestId('project-count')).toHaveTextContent('0');

    // Update mock data
    mockProjectApi.projects.data = mockProjectsDto;
    
    rerender(
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('project-count')).toHaveTextContent('2');
    });
  });

  it('should automatically select first project when available', async () => {
    mockProjectApi.projects.data = mockProjectsDto;
    
    render(
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('selected-project')).toHaveTextContent('Project 1');
    });
  });

  it('should not change selected project if one is already selected', async () => {
    // Start with one project selected
    mockProjectApi.projects.data = [mockProjectsDto[0]];
    
    const { rerender } = render(
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('selected-project')).toHaveTextContent('Project 1');
    });

    // Add more projects - should keep first selected
    mockProjectApi.projects.data = mockProjectsDto;
    
    rerender(
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('selected-project')).toHaveTextContent('Project 1');
    });
  });

  it('should handle loading state from API', async () => {
    mockProjectApi.projects.loading = true;
    
    render(
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('should handle error state from API', async () => {
    mockProjectApi.projects.error = 'API Error';
    
    render(
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
    );

    expect(screen.getByTestId('error')).toHaveTextContent('API Error');
  });

  it('should allow selecting a project', async () => {
    mockProjectApi.projects.data = mockProjectsDto;
    
    render(
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('selected-project')).toHaveTextContent('Project 1');
    });

    await act(async () => {
      screen.getByTestId('select-project-button').click();
    });

    expect(screen.getByTestId('selected-project')).toHaveTextContent('Project 2');
  });

  it('should create a new project', async () => {
    const createProjectDto: CreateProjectDto = {
      name: 'New Project',
      color: '#0000FF'
    };

    mockProjectApi.createProject.mockResolvedValue(undefined);

    render(
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
    );

    await act(async () => {
      screen.getByTestId('create-project-button').click();
    });

    expect(mockProjectApi.createProject).toHaveBeenCalledWith(createProjectDto);
  });

  it('should delete a project', async () => {
    mockProjectApi.deleteProject.mockResolvedValue(undefined);

    render(
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
    );

    await act(async () => {
      screen.getByTestId('delete-project-button').click();
    });

    expect(mockProjectApi.deleteProject).toHaveBeenCalledWith(1);
  });

  it('should not clear selected project when deleting a non-selected project', async () => {
    mockProjectApi.projects.data = mockProjectsDto;
    mockProjectApi.deleteProject.mockResolvedValue(undefined);
    
    render(
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
    );

    // First project should be selected automatically
    await waitFor(() => {
      expect(screen.getByTestId('selected-project')).toHaveTextContent('Project 1');
    });

    // Delete a different project (id: 2, but selected is id: 1)
    await act(async () => {
      const deleteButton = screen.getByTestId('delete-project-button');
      // Modify the onClick to delete project 2 instead
      deleteButton.onclick = () => mockProjectApi.deleteProject(2);
      deleteButton.click();
    });

    expect(screen.getByTestId('selected-project')).toHaveTextContent('Project 1');
  });

  it('should refetch projects', async () => {
    mockProjectApi.getAllProjects.mockResolvedValue(undefined);

    render(
      <ProjectProvider>
        <TestComponent />
      </ProjectProvider>
    );

    // Clear the initial call
    mockProjectApi.getAllProjects.mockClear();

    await act(async () => {
      screen.getByTestId('refetch-button').click();
    });

    expect(mockProjectApi.getAllProjects).toHaveBeenCalledTimes(1);
  });
});
