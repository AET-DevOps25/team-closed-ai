import { useState } from "react";
import { Plus, RefreshCw, AlertCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProject } from "@/context/ProjectContext";
import CreateProjectDialog from "./projects/CreateProjectDialog";
import ProjectCard from "./projects/ProjectCard";
import { ModeToggle } from "./ModeToggle";
import { UserProfileFooter } from "./users/UserProfileFooter";

export function AppSidebar() {
  const { projects, selectedProject, loading, error, selectProject, refetch } =
    useProject();
  const { theme } = useTheme();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleRefresh = async () => {
    await refetch();
  };

  // Determine which logo to show based on theme
  const logoSrc =
    theme === "dark" ? "/closedai-dark.svg" : "/closedai-light.svg";

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="relative">
          <div className="flex items-center justify-center gap-2">
            <img src={logoSrc} alt="ClosedAI Logo" className="h-8 w-8" />
            <h1 className="text-2xl font-bold">
              <a href="/" className="hover:opacity-80 transition-opacity">
                ClosedAI
              </a>
            </h1>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <ModeToggle />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-2">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw
                  size={14}
                  className={loading ? "animate-spin" : ""}
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus size={14} />
              </Button>
            </div>
          </div>
          <SidebarGroupContent>
            {error && (
              <Alert className="mx-2 mb-3" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="flex items-center justify-center p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Loading projects...</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 p-2">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isSelected={selectedProject?.id === project.id}
                    onSelect={selectProject}
                  />
                ))}
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserProfileFooter />
      </SidebarFooter>
      <CreateProjectDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </Sidebar>
  );
}
