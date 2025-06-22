import type { ProjectDto } from "@/api/api";

export interface Project extends ProjectDto {
  taskCount?: number;
}
