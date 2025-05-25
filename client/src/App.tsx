import {Toaster as Sonner} from "@/components/ui/sonner";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import {BrowserRouter, Route, Routes} from "react-router";
import {TooltipProvider} from "@/components/ui/tooltip.tsx";
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/AppSidebar.tsx";

function App() {
    return (
        <TooltipProvider>
            <Sonner/>
            <SidebarProvider defaultOpen={true}>
                <AppSidebar/>
                <main className="flex-1">
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Index/>}/>
                            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                            <Route path="*" element={<NotFound/>}/>
                        </Routes>
                    </BrowserRouter>
                </main>
            </SidebarProvider>
        </TooltipProvider>
    )
}

export default App
