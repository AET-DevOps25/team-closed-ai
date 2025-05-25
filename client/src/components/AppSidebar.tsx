import { LayoutDashboard, Settings, FileText } from "lucide-react";
import { UserProfileFooter } from "@/components/UserProfileFooter";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  // TODO: Replace with actual auth state
  const isAuthenticated = true;

  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://ui-avatars.com/api/?name=John+Doe",
  };

  const handleSignIn = () => {
    // TODO: Implement sign in
    console.log("Sign in clicked");
  };

  const handleSignOut = () => {
    // TODO: Implement sign out
    console.log("Sign out clicked");
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="text-2xl font-bold text-center">
          <a href="/" className="hover:opacity-80 transition-opacity">
            ClosedAI
          </a>
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserProfileFooter
          isAuthenticated={isAuthenticated}
          user={user}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
