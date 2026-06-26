"use client"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  IdCardLanyard,
  UserRound,
  SquareChartGantt,
} from "lucide-react";
import { userStore } from "../store/user-store"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/agency/dashboard",
      icon: <LayoutDashboard />,
    },
    {
      title: "Employees",
      url: "/agency/employees",
      icon: <IdCardLanyard />,
    },
    {
      title: "Clients",
      url: "/agency/clients",
      icon: <UserRound />,
    },
    {
      title: "Projects",
      url: "/agency/projects",
      icon: <SquareChartGantt />,
    },
  ],
};

export function AppSidebar({
  ...props
}) {

  const { user } = userStore();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
