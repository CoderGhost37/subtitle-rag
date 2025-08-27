import { AdminSidebar } from "@/components/admin/sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <main className="h-svh overflow-hidden">
          <SidebarTrigger className="-ml-1" />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
