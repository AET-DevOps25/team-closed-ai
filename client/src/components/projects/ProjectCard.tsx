import { Folder, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProject } from "@/context/ProjectContext";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onSelect: (project: Project) => void;
}

const ProjectCard = ({ project, isSelected, onSelect }: ProjectCardProps) => {
  const { deleteProject } = useProject();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${project.name}"?`)) {
      await deleteProject(project.id);
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md p-2 group ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => onSelect(project)}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: project.color || "#9ca3af" }}
            />
            <span className="text-sm font-medium truncate">{project.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground ml-4">
            <Folder size={10} />
            <span>{project.taskCount || 0} tasks</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 flex-shrink-0"
          onClick={handleDelete}
        >
          <Trash2 size={10} />
        </Button>
      </div>
    </Card>
  );
};

export default ProjectCard;
