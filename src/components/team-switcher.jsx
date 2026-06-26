"use client"

import aurora from "../assets/aurora.svg";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom";

export function TeamSwitcher() {
  const navigate = useNavigate()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              onClick={() => navigate("/agency/dashboard")}
            >
              <div className="flex aspect-square h-9 items-center justify-center">
                <img src={aurora} alt="logo" />
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-md font-medium text-black">
                  Aurora
                </p>
                <p className="text-xs w-35">7Span Internet Pvt. Ltd.</p>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
