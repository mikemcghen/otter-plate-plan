import { NavLink } from "react-router-dom";
import {
  Home,
  Waves,
  Heart,
  User,
  Settings,
  Sparkles,
  Menu,
  X,
  GitBranch,
  Wrench,
  Bell,
  Plus,
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
  { title: "Wellness", url: "/check-in", icon: Heart },
  { title: "Social Cove", url: "/trends", icon: Waves },
  { title: "Account", url: "/account", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Onboarding", url: "/onboarding", icon: Sparkles },
  { title: "State Flow", url: "/state-flow", icon: GitBranch },
];

type DevAdminSidebarProps = {
  onTriggerDailyGreeting?: () => void;
  onTriggerEndOfDay?: () => void;
  onTriggerLevelUp?: () => void;
  onTriggerBadgeUnlock?: () => void;
  onTriggerAchievement?: () => void;
  onTriggerSnackPicker?: () => void;
  onTriggerSuccessModal?: () => void;
  onTriggerNotificationBanner?: () => void;
  onTriggerQuickLog?: () => void;
};

export function DevAdminSidebar({
  onTriggerDailyGreeting,
  onTriggerEndOfDay,
  onTriggerLevelUp,
  onTriggerBadgeUnlock,
  onTriggerAchievement,
  onTriggerSnackPicker,
  onTriggerSuccessModal,
  onTriggerNotificationBanner,
  onTriggerQuickLog,
}: DevAdminSidebarProps) {
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
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-warning-foreground" />
              <h2 className="text-sm font-bold text-warning-foreground">
                Dev Mode
              </h2>
            </div>
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
            Navigation Pages
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

        {/* Notification Controls */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-warning-foreground flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notification Controls
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2 px-2">
              {onTriggerDailyGreeting && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs border-warning/30 hover:bg-warning/10"
                  onClick={onTriggerDailyGreeting}
                >
                  <Sparkles className="h-3 w-3 mr-2" />
                  Daily Greeting
                </Button>
              )}
              {onTriggerEndOfDay && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs border-warning/30 hover:bg-warning/10"
                  onClick={onTriggerEndOfDay}
                >
                  <Sparkles className="h-3 w-3 mr-2" />
                  End of Day Summary
                </Button>
              )}
              {onTriggerLevelUp && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs border-warning/30 hover:bg-warning/10"
                  onClick={onTriggerLevelUp}
                >
                  <Sparkles className="h-3 w-3 mr-2" />
                  Level Up Modal
                </Button>
              )}
              {onTriggerBadgeUnlock && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs border-warning/30 hover:bg-warning/10"
                  onClick={onTriggerBadgeUnlock}
                >
                  <Sparkles className="h-3 w-3 mr-2" />
                  Badge Unlock
                </Button>
              )}
              {onTriggerAchievement && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs border-warning/30 hover:bg-warning/10"
                  onClick={onTriggerAchievement}
                >
                  <Sparkles className="h-3 w-3 mr-2" />
                  Achievement Capsule
                </Button>
              )}
              {onTriggerSnackPicker && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs border-warning/30 hover:bg-warning/10"
                  onClick={onTriggerSnackPicker}
                >
                  <Sparkles className="h-3 w-3 mr-2" />
                  Snack Picker
                </Button>
              )}
              {onTriggerSuccessModal && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs border-warning/30 hover:bg-warning/10"
                  onClick={onTriggerSuccessModal}
                >
                  <Sparkles className="h-3 w-3 mr-2" />
                  Success Confirmation
                </Button>
              )}
              {onTriggerNotificationBanner && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs border-warning/30 hover:bg-warning/10"
                  onClick={onTriggerNotificationBanner}
                >
                  <Sparkles className="h-3 w-3 mr-2" />
                  Notification Banner
                </Button>
              )}
              {onTriggerQuickLog && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs border-warning/30 hover:bg-warning/10"
                  onClick={onTriggerQuickLog}
                >
                  <Plus className="h-3 w-3 mr-2" />
                  Quick Log Panel
                </Button>
              )}
            </div>
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
