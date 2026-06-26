import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Bell } from 'lucide-react';
import { useEffect } from "react";
import { authServices } from "../services/auth-services.js"
import { userStore } from "../store/user-store.js";
import { toast } from "sonner";

export default function AgencyLayout() {

  const { setUser } = userStore();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const fetchUser = async() => {
      try {
        if (token) {
          const result = await authServices.getUserDetails();
          setUser(result.data);
        } else {
          toast.error("Unauthorized!")
          navigate("/")
        }
      } catch (error) {
        const message = error?.message || "Failed to load user details";
        toast.error(message);
      }
    }

    fetchUser();
  },[])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 shadow">
          <div className="flex items-center px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="flex items-center px-4">
            <Bell className="-ml-1 cursor-pointer p-2 rounded-md hover:bg-gray-100" size={32} />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mt-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
