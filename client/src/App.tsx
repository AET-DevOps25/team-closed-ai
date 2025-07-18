import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ProjectProvider } from "@/context/ProjectContext";
import { UserProvider } from "@/context/UserContext";
import { GenAiProvider } from "@/context/GenAiContext";
import BoardPage from "./pages/BoardPage";

const App = () => (
  <TooltipProvider>
    <Sonner />
    <UserProvider>
      <ProjectProvider>
        <GenAiProvider>
          <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <main className="flex-1">
              <BrowserRouter>
                <Routes>
                  <Route path="*" element={<BoardPage />} />
                </Routes>
              </BrowserRouter>
            </main>
          </SidebarProvider>
        </GenAiProvider>
      </ProjectProvider>
    </UserProvider>
  </TooltipProvider>
);

export default App;
