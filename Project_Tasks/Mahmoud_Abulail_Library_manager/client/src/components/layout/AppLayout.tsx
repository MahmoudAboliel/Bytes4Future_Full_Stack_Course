import { Outlet } from "react-router";
import AppSidebar from "./AppSidebar";
import { SidebarProvider } from "../ui/sidebar";
import Header from "./Header";

const AppLayout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="w-full">
        <Header />
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default AppLayout;
