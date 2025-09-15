"use server";

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { revalidateTag } from "next/cache";
import { db } from "@/lib/prisma";

export async function createChat(pathwayId: string, firstMessage: string) {
  try {
    if (!pathwayId || !firstMessage.trim()) {
      return {
        success: false,
        message: "Missing required fields: pathwayId or firstMessage",
      };
    }

    const { text: generatedTitle } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Generate a short, concise title (3-6 words) for a chat based on this first message: "${firstMessage}". Only return the title (without quotes), nothing else.`,
      temperature: 0.3,
    });

    const chat = await db.chat.create({
      data: {
        title: generatedTitle.trim(),
        pathwayId,
        messages: {
          create: {
            role: "user",
            content: firstMessage,
          },
        },
      },
    });

    revalidateTag("chats");

    return {
      success: true,
      chatId: chat.id,
      title: chat.title,
    };
  } catch (error) {
    console.error("Error creating chat:", error);
    return {
      success: false,
      message: "Failed to create chat",
    };
  }
}
