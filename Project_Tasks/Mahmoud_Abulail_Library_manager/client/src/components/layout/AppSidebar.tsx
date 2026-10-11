import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router";
import { pages } from "@/lib/constances";

const AppSidebar = () => {
  const { open } = useSidebar();
  const { pathname } = useLocation();
  
  return (
    <Sidebar variant="sidebar" collapsible="icon" className="shadow">
      <SidebarHeader className="flex-row items-center border-b">
        <SidebarTrigger />
        {open && (
          <Link to="/" className="font-medium text-xl text-gray-800">
            MyLib
          </Link>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {pages.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    className={`
                        hover:font-medium hover:pl-4
                        ${
                        pathname === link.href 
                        ? "bg-gray-300/55 font-medium pl-4" 
                        : pathname.split("/").at(-1) === link.href 
                        ? "bg-gray-300/55 pl-4 font-medium" : ""}`}
                    render={<Link to={link.href} />}
                  >
                    {<link.icon className="" />}
                    <span>{link.label}</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction>
                    <span className="sr-only">Add Project</span>
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
