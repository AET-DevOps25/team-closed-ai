import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useProjectApi } from "@/hooks/use-project-api";
import type { Project } from "@/types";
import { mapProjectDtoToProject } from "@/utils/type-mappers";
import type { CreateProjectDto } from "@/api/api";

interface ProjectContextType {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
  selectProject: (project: Project) => void;
  createProject: (createProjectDto: CreateProjectDto) => Promise<void>;
  deleteProject: (projectId: number) => Promise<void>;
  refetch: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const projectApi = useProjectApi();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    projectApi.getAllProjects();
  }, []);

  useEffect(() => {
    if (projectApi.projects.data) {
      const mappedProjects = projectApi.projects.data.map(
        mapProjectDtoToProject,
      );
      setProjects(mappedProjects);

      if (!selectedProject && mappedProjects.length > 0) {
        setSelectedProject(mappedProjects[0]);
      }
    }
  }, [projectApi.projects.data, selectedProject]);

  const selectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const createProject = async (createProjectDto: CreateProjectDto) => {
    await projectApi.createProject(createProjectDto);
  };

  const deleteProject = async (projectId: number) => {
    await projectApi.deleteProject(projectId);
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
  };

  const refetch = async () => {
    await projectApi.getAllProjects();
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        loading: projectApi.projects.loading,
        error: projectApi.projects.error,
        selectProject,
        createProject,
        deleteProject,
        refetch,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
