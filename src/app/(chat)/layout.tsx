import { ChatSidebar } from "@/components/chat/sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <ChatSidebar />
      <SidebarInset>
        <main className="h-svh overflow-hidden">
          <SidebarTrigger className="-ml-1 absolute top-2 left-2" />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
