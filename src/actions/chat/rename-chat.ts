"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/lib/prisma";

export async function renameChat(chatId: string, newTitle: string) {
  try {
    if (!chatId || !newTitle.trim()) {
      return {
        success: false,
        message: "Chat ID and title are required",
      };
    }

    await db.chat.update({
      where: {
        id: chatId,
      },
      data: {
        title: newTitle.trim(),
      },
    });

    revalidatePath("/");
    revalidatePath("/chat/[id]", "page");
    revalidateTag("chats");

    return {
      success: true,
      message: "Chat renamed successfully",
    };
  } catch (error) {
    console.error("Error renaming chat:", error);
    return {
      success: false,
      message: "Failed to rename chat",
    };
  }
}
