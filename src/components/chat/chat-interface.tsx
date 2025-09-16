"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createChat } from "@/actions/chat/create-chat";
import type { ChatMessage } from "@/actions/chat/get-chat-messages";
import { usePathwayStore } from "@/hooks/use-pathway";
import { ChatHeader } from "./chat-header";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

interface ChatInterfaceProps {
  chatId?: string;
  userId: string;
  initialMessages?: ChatMessage[];
  chatPathway?: {
    id: string;
    title: string;
    description: string | null;
  };
}

export function ChatInterface({
  chatId,
  userId,
  initialMessages = [],
  chatPathway,
}: ChatInterfaceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [input, setInput] = useState<string>("");
  const pendingChatId = useRef<string | null>(null);
  const { pathwayId, setPathway } = usePathwayStore();

  const allowedRoles = ["user", "assistant", "system"] as const;
  const convertedMessages = initialMessages
    .filter((msg) =>
      allowedRoles.includes(msg.role as (typeof allowedRoles)[number]),
    )
    .map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant" | "system",
      parts: [{ type: "text" as const, text: msg.content }],
      createdAt: msg.createdAt,
    }));

  const { messages, sendMessage, status, regenerate } = useChat({
    messages: convertedMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onFinish: () => {
      if (pendingChatId.current && pathname === "/") {
        router.push(`/chat/${pendingChatId.current}`);
        pendingChatId.current = null;
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  const handleChangeInput = (val: string) => {
    setInput(val);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (pathname === "/" && pathwayId && !chatId && !pendingChatId.current) {
      try {
        const result = await createChat(pathwayId, input);
        if (result.success && result.chatId) {
          pendingChatId.current = result.chatId;
          sendMessage(
            {
              parts: [{ type: "text", text: input }],
              createdAt: new Date(),
            },
            { body: { chatId: result.chatId, userId } },
          );
          setInput("");
          return;
        }
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    }

    sendMessage(
      {
        parts: [{ type: "text", text: input }],
        createdAt: new Date(),
      },
      { body: { chatId, userId } },
    );
    setInput("");
  };

  useEffect(() => {
    if (chatPathway && (!pathwayId || pathwayId !== chatPathway.id)) {
      setPathway(chatPathway);
    }
  }, [chatPathway, pathwayId, setPathway]);

  return (
    <main className="h-svh">
      <ChatHeader />

      <ChatMessages
        messages={messages}
        status={status}
        regenerate={regenerate}
      />

      <ChatInput
        input={input}
        handleInputChange={handleChangeInput}
        onSubmit={onSubmit}
        disabled={status === "streaming" || status === "submitted"}
      />
    </main>
  );
}
