import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import type { Project } from "@/types";

interface ProjectSelectorProps {
  projects: Project[];
  selectedProject: Project;
  onProjectSelect: (project: Project) => void;
}

const ProjectSelector = ({
  projects,
  selectedProject,
  onProjectSelect,
}: ProjectSelectorProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-2xl font-bold h-auto px-4 py-2 border-none bg-transparent hover:bg-transparent"
        >
          {selectedProject.name}
          <ChevronDown size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-56 bg-white border shadow-lg"
      >
        {projects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            onClick={() => onProjectSelect(project)}
            className="cursor-pointer hover:bg-gray-100"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: project.color || "#9ca3af" }}
              />
              {project.name}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectSelector;
