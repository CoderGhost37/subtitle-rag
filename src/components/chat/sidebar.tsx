"use client";

import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconListDetails,
  IconUsers,
} from "@tabler/icons-react";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type * as React from "react";
// import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
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

export function ChatSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* <SidebarMenu>
                    <SidebarMenuItem className="flex items-center gap-2">
                        <SidebarMenuButton
                            tooltip="Quick Create"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                        >
                            <IconCirclePlusFilled />
                            <span>Quick Create</span>
                        </SidebarMenuButton>
                        <Button
                            size="icon"
                            className="size-8 group-data-[collapsible=icon]:opacity-0"
                            variant="outline"
                        >
                            <IconMail />
                            <span className="sr-only">Inbox</span>
                        </Button>
                    </SidebarMenuItem>
                </SidebarMenu> */}
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
              <Link href="/">
                <Button size="sm" className="rounded w-full">
                  <Plus className="size-4" />
                  <span>New Chat</span>
                </Button>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <PathwaySwitcher />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>{/* <NavMain items={data.navMain} /> */}</SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
