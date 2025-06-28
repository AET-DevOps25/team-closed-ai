import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ProjectProvider } from "@/context/ProjectContext";
import { UserProvider } from "@/context/UserContext";
import BoardPage from "./pages/BoardPage";
//import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Sonner />
    <UserProvider>
      <ProjectProvider>
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <main className="flex-1">
            <BrowserRouter>
              <Routes>
                <Route path="*" element={<BoardPage />} />
                {/*<Route path="*" element={<NotFound />} />*/}
              </Routes>
            </BrowserRouter>
          </main>
        </SidebarProvider>
      </ProjectProvider>
    </UserProvider>
  </TooltipProvider>
);

export default App;
