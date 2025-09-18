"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import {
  IconDashboard,
  IconDotsVertical,
  IconLogout,
} from "@tabler/icons-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "./ui/skeleton";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {isLoaded ? (
          user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user.imageUrl}
                      alt={user.firstName as string}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user.firstName}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user.emailAddresses?.[0]?.emailAddress}
                    </span>
                  </div>
                  <IconDotsVertical className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-58 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user.imageUrl}
                        alt={user.firstName as string}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {user.firstName}
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {user.emailAddresses?.[0]?.emailAddress}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.publicMetadata?.role === "admin" && (
                  <Link href="/admin">
                    <DropdownMenuItem>
                      <IconDashboard />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                )}
                <DropdownMenuItem onClick={() => signOut()}>
                  <IconLogout />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null
        ) : (
          <Skeleton className="h-8 w-full rounded-lg" />
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
