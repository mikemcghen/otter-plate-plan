import { NavLink } from "react-router-dom";
import {
  Home,
  TrendingUp,
  Scale,
  Settings,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Onboarding", url: "/onboarding", icon: Sparkles },
  { title: "Weigh-In", url: "/check-in", icon: Scale },
  { title: "Trends", url: "/trends", icon: TrendingUp },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function DevAdminSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isOpen = state === "expanded";

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r-2 border-warning bg-warning/5"
    >
      <SidebarContent>
        {/* Header */}
        <div className="p-4 border-b-2 border-warning/30 bg-warning/10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-warning-foreground">
              🛠️ Dev Mode
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleSidebar}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Testing navigation only
          </p>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-warning-foreground">
            All Pages
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        isActive
                          ? "bg-warning/20 text-warning-foreground font-semibold border-l-4 border-warning"
                          : "hover:bg-warning/10 text-foreground"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Reset Onboarding */}
        <div className="p-4 mt-auto border-t-2 border-warning/30">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs border-warning/50"
            onClick={() => {
              localStorage.removeItem("ottrcal_onboarding_complete");
              window.location.href = "/onboarding";
            }}
          >
            Reset Onboarding
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
