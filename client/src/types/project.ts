import type { ProjectDto } from "@/api/server";

export interface Project extends ProjectDto {
  taskCount?: number;
}
