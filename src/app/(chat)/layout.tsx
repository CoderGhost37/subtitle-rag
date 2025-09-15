import { getChats } from "@/actions/chat/get-chats";
import { ChatSidebar } from "@/components/chat/sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chats = await getChats();

  return (
    <SidebarProvider>
      <ChatSidebar chats={chats} />
      <SidebarInset>
        <main className="h-svh overflow-hidden">
          <SidebarTrigger className="-ml-1 absolute top-2 left-2" />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
