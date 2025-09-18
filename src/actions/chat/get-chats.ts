"use server";

import { unstable_cache } from "next/cache";
import { db } from "@/lib/prisma";

export const getChats = unstable_cache(
  async () => {
    try {
      const chats = await db.chat.findMany({
        select: {
          id: true,
          title: true,
          updatedAt: true,
          pathwayId: true,
          pathway: {
            select: {
              title: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      return chats;
    } catch (error) {
      console.error("Error fetching chats:", error);
      return [];
    }
  },
  ["chats"],
  {
    revalidate: 60, // Cache for 60 seconds
    tags: ["chats"],
  },
);
