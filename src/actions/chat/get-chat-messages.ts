"use server";

import type { MessageRole } from "@/generated/prisma";
import { db } from "@/lib/prisma";

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
};

export async function getChatMessages(chatId: string) {
  try {
    if (!chatId) {
      return {
        success: false,
        messages: [],
      };
    }

    const chat = await db.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      return {
        success: false,
        messages: [],
      };
    }

    return {
      success: true,
      messages: chat.messages,
    };
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return {
      success: false,
      messages: [],
    };
  }
}
