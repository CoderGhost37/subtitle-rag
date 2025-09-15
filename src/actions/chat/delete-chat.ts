"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/lib/prisma";

export async function deleteChat(chatId: string) {
  try {
    if (!chatId) {
      return {
        success: false,
        message: "Chat ID is required",
      };
    }

    await db.chat.delete({
      where: {
        id: chatId,
      },
    });

    revalidatePath("/");
    revalidatePath("/chat/[id]", "page");
    revalidateTag("chats");

    return {
      success: true,
      message: "Chat deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting chat:", error);
    return {
      success: false,
      message: "Failed to delete chat",
    };
  }
}
