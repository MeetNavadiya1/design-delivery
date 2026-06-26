import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";

export function NavMain({ items }) {
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={location.pathname.startsWith(item.url)}
                >
                  <NavLink
                    to={item.url}
                    className={`flex w-full items-center gap-2 `}
                    onClick={() => {
                      if (isMobile) setOpenMobile(false);
                    }}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
