import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { adminLogout } from "@/services/adminAuth";

interface AdminLayoutProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function AdminLayout({ title, description, actions, children }: AdminLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await adminLogout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar onLogout={handleLogout} />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader title={title} description={description} actions={actions} />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
