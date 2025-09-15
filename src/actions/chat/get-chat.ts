"use server";

import { unstable_cache } from "next/cache";
import { db } from "@/lib/prisma";

export const getChat = unstable_cache(
  async (chatId: string) => {
    try {
      if (!chatId) {
        return {
          success: false,
          chat: null,
        };
      }

      const chat = await db.chat.findUnique({
        where: {
          id: chatId,
        },
        select: {
          id: true,
          title: true,
          pathwayId: true,
          pathway: {
            select: {
              id: true,
              title: true,
              description: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!chat) {
        return {
          success: false,
          chat: null,
        };
      }

      return {
        success: true,
        chat,
      };
    } catch (error) {
      console.error("Error fetching chat:", error);
      return {
        success: false,
        chat: null,
      };
    }
  },
  ["chats"],
  {
    revalidate: 60, // Cache for 60 seconds
    tags: ["chats"],
  },
);
