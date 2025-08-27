import { AdminSidebar } from "@/components/admin/sidebar";
import { ModeToggle } from "@/components/theme/theme-toggle";
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
        <main className="h-svh overflow-hidden overflow-y-auto">
          <div className="flex justify-between items-center p-1">
            <SidebarTrigger className="-ml-1" />
            <ModeToggle />
          </div>
          <div className="p-4 lg:px-8">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
