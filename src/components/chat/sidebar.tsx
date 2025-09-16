"use client";

import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDots,
  IconEdit,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconListDetails,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ComponentProps, useEffect, useState } from "react";
import { deleteChat } from "@/actions/chat/delete-chat";
import { renameChat } from "@/actions/chat/rename-chat";
// import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathwayStore } from "@/hooks/use-pathway";
import { Button } from "../ui/button";
import { PathwaySwitcher } from "./pathway-switcher";

const _data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Projects",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "Team",
      url: "#",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
};

type Chat = {
  id: string;
  title: string;
  updatedAt: Date;
  pathwayId: string;
  pathway: {
    title: string;
  };
};

interface ChatSidebarProps extends ComponentProps<typeof Sidebar> {
  chats: Chat[];
}

export function ChatSidebar({
  chats: initialChats,
  ...props
}: ChatSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { clearPathway } = usePathwayStore();
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [editingChat, setEditingChat] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const newChat = () => {
    clearPathway();
    router.push("/");
  };

  const handleDeleteChat = async (chatId: string) => {
    const result = await deleteChat(chatId);
    if (result.success) {
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
      if (pathname === `/chat/${chatId}`) {
        router.push("/");
      }
    }
  };

  const handleRenameChat = async (chatId: string) => {
    if (!editTitle.trim()) return;

    const result = await renameChat(chatId, editTitle);
    if (result.success) {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, title: editTitle } : chat,
        ),
      );
      setEditingChat(null);
      setEditTitle("");
    }
  };

  const startEditing = (chat: Chat) => {
    setEditingChat(chat.id);
    setEditTitle(chat.title);
  };

  const cancelEditing = () => {
    setEditingChat(null);
    setEditTitle("");
  };

  useEffect(() => {
    setChats(initialChats);
  }, [initialChats]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!px-1.5 py-8"
            >
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.svg" alt="Logo" width={48} height={48} />
                <span className="text-2xl font-semibold">Chai GPT</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button size="sm" className="rounded w-full" onClick={newChat}>
                <Plus className="size-4" />
                <span>New Chat</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <PathwaySwitcher disabled={pathname !== "/"} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {chats.length > 0 ? (
          <SidebarMenu>
            {chats.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <div className="flex items-center justify-between w-full group">
                  {editingChat === chat.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRenameChat(chat.id);
                        } else if (e.key === "Escape") {
                          cancelEditing();
                        }
                      }}
                      onBlur={() => handleRenameChat(chat.id)}
                      className="flex-1 px-2 py-1 text-sm border rounded"
                      // biome-ignore lint/a11y/noAutofocus: <explanation>
                      autoFocus
                    />
                  ) : (
                    <>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/chat/${chat.id}`}
                        className="flex-1"
                      >
                        <Link href={`/chat/${chat.id}`}>
                          <span className="truncate">{chat.title}</span>
                        </Link>
                      </SidebarMenuButton>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 size-6 p-0"
                          >
                            <IconDots className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => startEditing(chat)}
                            className="flex items-center gap-2"
                          >
                            <IconEdit className="size-4" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteChat(chat.id)}
                            className="flex items-center gap-2 text-destructive"
                          >
                            <IconTrash className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        ) : (
          <div className="flex items-center justify-center p-4">
            <div className="text-sm text-muted-foreground">No chats yet</div>
          </div>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
